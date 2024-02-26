from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status, Depends, Path
from models import Student, Country, Exchange, Career, University, User
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from passlib.context import CryptContext
from bson import ObjectId

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
    students = await db["students"].find().to_list(1000)
    for student in students:
        student["_id"] = str(student["_id"])
        student["career_id"] = str(student["career_id"])
    return students

@studentsRouter.get("/students/{student_id}")
async def get_student_by_id(student_id: str = Path(...)):
    student = await db["students"].find_one({"_id": ObjectId(student_id)})

    if student:
        student["_id"] = str(student["_id"])
        student["career_id"] = str(student["career_id"])
        return student
    else:
        return {"error": "Estudiante no encontrado"}, 404

@studentsRouter.post("/students/", response_model=Student)
async def create_student(student: Student):
    # Convierte las cadenas _id y career_id a ObjectId
    student_dict = student.dict(by_alias=True)
    student_dict["career_id"] = ObjectId(student_dict["career_id"])

    new_student = await db["students"].insert_one(student_dict)
    return await db["students"].find_one({"_id": new_student.inserted_id})

@countriesRouter.get("/countries/") # y
async def get_countries():
    countries = await db["countries"].find().to_list(1000)
    for country in countries:
        country["_id"] = str(country["_id"])
        country["continent"]["_id"] = str(country["continent"]["_id"])
    return countries

@countriesRouter.post("/countries/", response_model=Country) # y
async def create_country(country: Country):
    country_dict = country.dict(by_alias=True)
    country_dict["_id"] = ObjectId(country_dict["_id"])
    country_dict["continent"]["_id"] = ObjectId(country_dict["continent"]["_id"])

    new_country = await db["countries"].insert_one(country.dict(by_alias=True))
    return await db["countries"].find_one({"_id": new_country.inserted_id})

@majorsRouter.get("/careers/") # y
async def get_careers():
    careers = await db["careers"].find().to_list(1000)
    print(careers)
    return careers

@majorsRouter.post("/careers/", response_model=Career) # y
async def create_career(career: Career):
    new_career = await db["careers"].insert_one(career.dict())
    created_career = await db["careers"].find_one({"_id": new_career.inserted_id})
    return created_career

@exchangesRouter.get("/exchanges/")
async def get_exchanges():
    pipeline = [
        {
            "$lookup": {
                "from": "students",
                "localField": "student_id",
                "foreignField": "_id",
                "as": "student_info"
            }
        },
        {
            "$unwind": "$student_info"
        },
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "student_id": {"$toString": "$student_id"},
                "university_id": {"$toString": "$university_id"},
                "details": "$details",
                "student": "$student_info"
            }
        }
    ]

    exchanges = await db["exchanges"].aggregate(pipeline).to_list(1000)

    for exchange in exchanges:
        exchange["student"]["_id"] = str(exchange["student"]["_id"])
        exchange["student"]["career_id"] = str(exchange["student"]["career_id"])
    
    return exchanges

@exchangesRouter.post("/exchanges/", response_model=Exchange)
async def create_exchange(exchange: Exchange):
    new_exchange = await db["exchanges"].insert_one(exchange.dict())
    created_exchange = await db["exchanges"].find_one({"_id": new_exchange.inserted_id})
    return created_exchange

@universitiesRouter.get("/universities/") # y
async def get_universities():
    universities = await db["universities"].find().to_list(1000)
    for university in universities:
        university["_id"] = str(university["_id"])
        university["country_id"] = str(university["country_id"])
    return universities

@universitiesRouter.post("/universities/", response_model=University) # y
async def create_university(university: University):
    new_university = await db["universities"].insert_one(university.dict())
    created_university = await db["universities"].find_one({"_id": new_university.inserted_id})
    return created_university

@usersRouter.get("/users/") # y
async def get_users():
    users = await db["users"].find().to_list(1000)
    print(users)
    return users

@usersRouter.post("/users/", response_model=User) # y
async def create_user(user: User):
    new_user = await db["users"].insert_one(user.dict())
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})
    return created_user