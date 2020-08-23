import pickle
import numpy
import json
import random
import nltk
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

factory = StemmerFactory()
stemmer = factory.create_stemmer()

with open("sanansari/chatbot/data.json", "r", encoding="utf-8") as file:
    data = json.load(file)

with open("sanansari/chatbot/data.pickle", "rb") as f:
    words, labels, training, output = pickle.load(f)


wb = numpy.load('sanansari/chatbot/model_weights.npz', allow_pickle=True)
w, b = wb['wb']

def predict(x):
  x = numpy.array(x, dtype=numpy.float32)
  l0 = numpy.dot(x, w[0]) + b[0]
  l0 = numpy.maximum(0, l0)
  l1 = numpy.dot(l0, w[1]) + b[1]
  l1 = numpy.maximum(0, l1)
  l2 = numpy.dot(l1, w[2]) + b[2]
  return l2

def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1
    
    return numpy.array(bag).reshape(1,107)


def chat(inp):
    results = predict([bag_of_words(inp, words)])
    results_index = numpy.argmax(results)
    tag = labels[results_index]

    for tg in data["intents"]:
        if tg['tag'] == tag:
            responses = tg['responses']

    return(random.choice(responses))
