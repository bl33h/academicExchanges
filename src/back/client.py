import os
from dotenv import load_dotenv
from pymongo import MongoClient

# ------- env setup -------
# load config from a .env file
load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

# connect to the MongoDB cluster
client = MongoClient(MONGODB_URI)

db = client['Intercambios']

# list all the collections
collections = db.list_collection_names()
for collection in collections:
   print(collection)