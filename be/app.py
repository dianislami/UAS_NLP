from fastapi import FastAPI
from pydantic import BaseModel

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from nltk.tokenize import sent_tokenize
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "./indobert_disaster_summarizer"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()


class ArticleRequest(BaseModel):
    article: str


@app.post("/summarize")
def summarize(request: ArticleRequest):

    sentences = sent_tokenize(request.article)

    results = []

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

        results.append({
            "sentence": sentence,
            "score": round(score, 4)
        })

    # ambil yang penting
    important = [r for r in results if r["score"] >= 0.5]

    summary = " ".join([r["sentence"] for r in important])

    return {
        "summary": summary,
        "important_sentences": important
    }