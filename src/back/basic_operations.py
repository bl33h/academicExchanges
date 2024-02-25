import datetime   # This will be needed later
import os

from dotenv import load_dotenv
from pymongo import MongoClient

# Load config from a .env file:
load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

# Connect to your MongoDB cluster:
client = MongoClient(MONGODB_URI)

# Get a reference to the 'sample_mflix' database:
db = client['Intercambios']

# List all the collections in 'sample_mflix':
collections = db.list_collection_names()
for collection in collections:
   print(collection)