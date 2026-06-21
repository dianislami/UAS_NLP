import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from nltk.tokenize import sent_tokenize

MODEL_PATH = "./indobert_disaster_summarizer"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()


def summarize_article(article_text, threshold=0.5):

    sentences = sent_tokenize(article_text)

    important_sentences = []

    for sentence in sentences:

        inputs = tokenizer(
            sentence,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)

        score = probs[0][1].item()

        if score >= threshold:
            important_sentences.append({
                "sentence": sentence,
                "score": round(score, 4)
            })

    summary = " ".join(
        [s["sentence"] for s in important_sentences]
    )

    return {
        "summary": summary,
        "important_sentences": important_sentences
    }