import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from nltk.tokenize import sent_tokenize

MODEL_PATH = "./indobert_disaster_summarizer"
DEFAULT_THRESHOLD = 0.8
DEFAULT_MAX_SENTENCES = 3
DEFAULT_FALLBACK_SENTENCES = 3

tokenizer = None
model = None


def get_model():
    global tokenizer, model

    if tokenizer is None:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    if model is None:
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
        model.eval()

    return tokenizer, model


def summarize_article(
    article_text,
    threshold=DEFAULT_THRESHOLD,
    max_sentences=DEFAULT_MAX_SENTENCES,
    fallback_sentences=DEFAULT_FALLBACK_SENTENCES,
):
    active_tokenizer, active_model = get_model()
    sentences = sent_tokenize(article_text)

    scored_sentences = []

    for idx, sentence in enumerate(sentences):
        inputs = active_tokenizer(
            sentence,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        with torch.no_grad():
            outputs = active_model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)

        score = probs[0][1].item()

        scored_sentences.append({
            "index": idx,
            "sentence": sentence,
            "score": round(score, 4)
        })

    passed_threshold = [
        item for item in scored_sentences
        if item["score"] >= threshold
    ]

    top_sentences = sorted(
        passed_threshold,
        key=lambda x: x["score"],
        reverse=True
    )[:max_sentences]

    if not top_sentences:
        top_sentences = sorted(
            scored_sentences,
            key=lambda x: x["score"],
            reverse=True
        )[:fallback_sentences]

    top_sentences = sorted(top_sentences, key=lambda x: x["index"])
    important_sentences = [
        {
            "sentence": item["sentence"],
            "score": item["score"]
        }
        for item in top_sentences
    ]

    summary = " ".join([s["sentence"] for s in important_sentences])

    print(f"Threshold yang digunakan: {threshold}")
    print(f"Jumlah kalimat total: {len(sentences)}")
    print(f"Jumlah kalimat terpilih: {len(important_sentences)}")

    return {
        "summary": summary,
        "important_sentences": important_sentences
    }
