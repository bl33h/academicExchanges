from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('mongodb+srv://men21289:men21289@intercambios.eg3fuqe.mongodb.net/?retryWrites=true&w=majority&appName=Intercambios')

@app.route('/api/data', methods=['GET'])
def get_data():
    db = client['Intercambios']
    collection = db['exchanges']
    
    data = list(collection.find({}, {'_id': 0}))
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
