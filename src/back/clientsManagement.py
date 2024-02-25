from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from models import Student, Country, Exchange, Career, University, User
from typing import List

load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

client = AsyncIOMotorClient(MONGODB_URI)
db = client['Intercambios']

universitiesRouter = APIRouter()
exchangesRouter = APIRouter()
majorsRouter = APIRouter()
usersRouter = APIRouter()
studentsRouter = APIRouter()
countriesRouter = APIRouter()

@studentsRouter.get("/students/") # y
async def get_students():
    print (await db["students"].find().to_list(1000))
    return await db["students"].find().to_list(1000)

@studentsRouter.post("/students/", response_model=Student)
async def create_student(student: Student):
    new_student = await db["students"].insert_one(student.dict(by_alias=True))
    return await db["students"].find_one({"_id": new_student.inserted_id})

@countriesRouter.get("/countries/") # y
async def get_countries():
    print (await db["countries"].find().to_list(1000))
    return await db["countries"].find().to_list(1000)

@countriesRouter.post("/countries/", response_model=Country)
async def create_country(country: Country):
    new_country = await db["countries"].insert_one(country.dict(by_alias=True))
    return await db["countries"].find_one({"_id": new_country.inserted_id})

@majorsRouter.get("/careers/") # y
async def get_careers():
    careers = await db["careers"].find().to_list(1000)
    print(careers)
    return careers

@majorsRouter.post("/careers/", response_model=Career)
async def create_career(career: Career):
    new_career = await db["careers"].insert_one(career.dict())
    created_career = await db["careers"].find_one({"_id": new_career.inserted_id})
    return created_career

@exchangesRouter.get("/exchanges/") # y
async def get_exchanges():
    exchanges = await db["exchanges"].find().to_list(1000)
    print(exchanges)
    return exchanges

@exchangesRouter.post("/exchanges/", response_model=Exchange)
async def create_exchange(exchange: Exchange):
    new_exchange = await db["exchanges"].insert_one(exchange.dict())
    created_exchange = await db["exchanges"].find_one({"_id": new_exchange.inserted_id})
    return created_exchange

@universitiesRouter.get("/universities/") # y
async def get_universities():
    universities = await db["universities"].find().to_list(1000)
    print(universities)
    return universities

@universitiesRouter.post("/universities/", response_model=University)
async def create_university(university: University):
    new_university = await db["universities"].insert_one(university.dict())
    created_university = await db["universities"].find_one({"_id": new_university.inserted_id})
    return created_university

@usersRouter.get("/users/") # y
async def get_users():
    users = await db["users"].find().to_list(1000)
    print(users)
    return users

@usersRouter.post("/users/", response_model=User)
async def create_user(user: User):
    new_user = await db["users"].insert_one(user.dict())
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})
    return created_user