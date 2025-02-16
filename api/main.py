from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from transformers import pipeline
import torch

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


sentiment_analyzer = pipeline("sentiment-analysis", model="pysentimiento/robertuito-sentiment-analysis")
zero_shot_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
text_generator = pipeline("text-generation", model="DeepESP/gpt2-spanish")
fill_mask = pipeline("fill-mask", model="dccuchile/bert-base-spanish-wwm-cased")
ner = pipeline("ner", model="mrm8488/bert-spanish-cased-finetuned-ner", grouped_entities=True)
qa = pipeline("question-answering", model="PlanTL-GOB-ES/roberta-large-bne-sqac")
summarizer = pipeline("summarization", model="csebuetnlp/mT5_multilingual_XLSum")
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-es-en")

class TextInput(BaseModel):
    text: str

class ZeroShotInput(BaseModel):
    text: str
    candidate_labels: list

class QaInput(BaseModel):
    question: str
    context: str

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("templates/index.html", "r") as file:
        return HTMLResponse(content=file.read())

@app.post("/sentiment-analysis/")
async def sentiment_analysis(input: TextInput):
    result = sentiment_analyzer(input.text)
    return {"result": result}

@app.post("/zero-shot-classification/")
async def zero_shot_classification(input: ZeroShotInput):
    result = zero_shot_classifier(input.text, candidate_labels=input.candidate_labels, hypothesis_template="Este texto trata sobre {}.")
    return {"result": result}

@app.post("/text-generation/")
async def text_generation(input: TextInput):
    result = text_generator(input.text, max_length=50, num_return_sequences=2)
    return {"result": result}

@app.post("/fill-mask/")
async def fill_mask_endpoint(input: TextInput):
    result = fill_mask(input.text)
    return {"result": result}

@app.post("/ner/")
async def named_entity_recognition_endpoint(input: TextInput):
    result = ner(input.text)
    parsed_result = []
    for entity in result:
        entity["score"] = float(entity["score"])
        parsed_result.append(entity)

    return {"result": parsed_result}

@app.post("/question-answering/")
async def question_answering(input: QaInput):
    result = qa(question=input.question, context=input.context)
    return {"result": result}

@app.post("/summarization/")
async def summarization(input: TextInput):
    result = summarizer(input.text)
    return {"result": result}

@app.post("/translation/")
async def translation(input: TextInput):
    result = translator(input.text)
    return {"result": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
