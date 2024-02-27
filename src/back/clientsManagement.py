import os
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, Path
from motor.motor_asyncio import AsyncIOMotorClient
from models import Student, Country, Exchange, Career, University
from pymongo.collation import Collation
import numpy as np

load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

client = AsyncIOMotorClient(MONGODB_URI)
db = client['Intercambios']

universitiesRouter = APIRouter()
exchangesRouter = APIRouter()
majorsRouter = APIRouter()
studentsRouter = APIRouter()
countriesRouter = APIRouter()
modalityRouter = APIRouter()
statusRouter = APIRouter()

@studentsRouter.get("/students/") # y
async def get_students():

    pipeline = [
        {
            "$lookup": {
                "from": "careers",
                "localField": "career_id",
                "foreignField": "_id",
                "as": "career_info"
            }
        },
        {
            "$unwind": "$career_info"
        },
        {
            "$project":{
                "_id": {"$toString": "$_id"},
                "name": "$name",
                "email": "$email",
                "career_id": {"$toString": "$career_id"},
                "career": "$career_info"
            }
        }
    ]
    students = await db["students"].aggregate(pipeline).to_list(1000)
    for student in students:
        student["_id"] = str(student["_id"])
        student["career_id"] = str(student["career_id"])
        student["career"]["_id"] = str(student["career"]["_id"])
        student["career"]["faculty"]["_id"] = str(student["career"]["faculty"]["_id"])
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
    print(student_dict)
    carnet = student_dict["carnet"]
    student_dict["_id"] = ObjectId(carnet)
    student_dict["career_id"] = ObjectId(student_dict["career_id"])

    new_student = await db["students"].insert_one(student_dict)
    return await db["students"].find_one({"_id": new_student.inserted_id})

@studentsRouter.put("/students/{student_id}")
async def update_student(student_id: str, student: Student):
    student_dict = student.dict(exclude_unset=True)
    student_dict["career_id"] = ObjectId(student_dict["career_id"])

    updated_student = await db["students"].find_one_and_update(
        {"_id": ObjectId(student_id)},
        {"$set": student_dict},
        return_document=True
    )

    if updated_student:
        updated_student["_id"] = str(updated_student["_id"])
        updated_student["career_id"] = str(updated_student["career_id"])
        return {
            "name": updated_student["name"],
            "email": updated_student["email"],
            **updated_student
        }
    else:
        return {"error": "Estudiante no encontrado"}, 404

@studentsRouter.delete("/students/{student_id}")
async def delete_student(student_id: str):
    # delete the student
    delete_result = await db["students"].delete_one({"_id": ObjectId(student_id)})
    
    if delete_result.deleted_count == 1:
        # delete the exchange record of the student
        await db["exchanges"].delete_many({"student_id": ObjectId(student_id)})
        
        return {"message": "Estudiante eliminado y registros de intercambio eliminados en cascada"}
    else:
        return {"error": "Estudiante no encontrado"}, 404

@countriesRouter.get("/countries/") # y
async def get_countries():
    countries = await db["countries"].find().sort("name").to_list(1000)
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

@countriesRouter.get("/countries/{country_id}")
async def get_country_by_id(country_id: str = Path(...)):
    country = await db["countries"].find_one({"_id": ObjectId(country_id)})
    if country:
        country["_id"] = str(country["_id"])
        if "continent" in country:
            country["continent"]["_id"] = str(country["continent"]["_id"])
        return country
    else:
        return {"error": "País no encontrado"}, 404

@countriesRouter.delete("/countries/{country_id}")
async def delete_country(country_id: str):
    delete_result = await db["countries"].delete_one({"_id": ObjectId(country_id)})
    if delete_result.deleted_count == 1:
        return {"message": "País eliminado"}
    else:
        return {"error": "País no encontrado"}, 404
    
@majorsRouter.get("/careers/") # y
async def get_faculties():
    pipeline = [
    {
        "$unwind": "$faculty"
    },
    {
        "$group": {
            "_id": "$faculty._id",
            "name": {"$first": "$faculty.name"},
            "short_name": {"$first": "$faculty.short_name"}
        }
    },
    {
        "$project": {
            "_id": {"$toString": "$_id"},
            "name": "$name",
            "short_name": "$short_name"
        }
    }
]

    faculties = await db["careers"].aggregate(pipeline).to_list(1000)

    for faculty in faculties:
        faculty["_id"] = str(faculty["_id"])
    return faculties

@majorsRouter.get("/careers/{faculty_id}") # y
async def get_careers_by_faculty(faculty_id: str = Path(...)):
    careers = await db["careers"].find({"faculty._id": ObjectId(faculty_id)}).to_list(1000)
    for career in careers:
        career["_id"] = str(career["_id"])
        career["faculty"]["_id"] = str(career["faculty"]["_id"])
    return careers
    
@majorsRouter.post("/careers/", response_model=Career)   # y
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
            "$lookup": {
                "from": "universities",
                "localField": "university_id",
                "foreignField": "_id",
                "as": "uni_info"
            }
        },
        {
            "$unwind": "$uni_info"
        },
        {
            "$project":{
                "_id": {"$toString": "$_id"},
                "student_id": {"$toString": "$student_id"},
                "university_id": {"$toString": "$university_id"},
                "details": "$details",
                "student": "$student_info",
                "university": "$uni_info"
            }
        }
    ]

    exchanges = await db["exchanges"].aggregate(pipeline).to_list(1000)

    for exchange in exchanges:
        exchange["student"]["_id"] = str(exchange["student"]["_id"])
        exchange["student"]["career_id"] = str(exchange["student"]["career_id"])
        exchange["university"]["_id"] = str(exchange["university"]["_id"])
        exchange["university"]["country_id"] = str(exchange["university"]["country_id"])

    
    return exchanges

@exchangesRouter.get("/exchanges/{exchange_id}")
async def get_exchange_by_id(exchange_id: str = Path(...)):
    pipeline = [
        {
            "$match": {
                "_id": ObjectId(exchange_id)
            }
        },
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
            "$lookup": {
                "from": "universities",
                "localField": "university_id",
                "foreignField": "_id",
                "as": "uni_info"
            }
        },
        {
            "$unwind": "$uni_info"
        },
        {
            "$project": {
                "_id": {"$toString": "$_id"},
                "student_id": {"$toString": "$student_id"},
                "university_id": {"$toString": "$university_id"},
                "details": "$details",
                "student": "$student_info",
                "university": "$uni_info"
            }
        }
    ]

    exchange = await db["exchanges"].aggregate(pipeline).to_list(1)

    if exchange:
        exchange = exchange[0]  # Tomar el primer elemento de la lista
        exchange["student"]["_id"] = str(exchange["student"]["_id"])
        exchange["student"]["career_id"] = str(exchange["student"]["career_id"])
        exchange["university"]["_id"] = str(exchange["university"]["_id"])
        exchange["university"]["country_id"] = str(exchange["university"]["country_id"])

        return exchange
    else:
        return {"error": "Intercambio no encontrado"}, 404


@exchangesRouter.post("/exchanges/", response_model=Exchange)
async def create_exchange(exchange: Exchange):
    new_exchange = await db["exchanges"].insert_one(exchange.dict())
    created_exchange = await db["exchanges"].find_one({"_id": new_exchange.inserted_id})
    return created_exchange

@exchangesRouter.delete("/exchanges/{exchange_id}")
async def delete_exchange(exchange_id: str):
    delete_result = await db["exchanges"].delete_one({"_id": ObjectId(exchange_id)})
    
    if delete_result.deleted_count:
        return {"message": "Exchange successfully deleted"}
    else:
        return {"error": "Exchange not found"}, 404

@universitiesRouter.get("/universities/{university_id}") # y
async def get_universities_by_id(university_id: str = Path(...)):
    pipeline = [
        {
            "$match": {
                "_id": ObjectId(university_id)
            }
        },
        {
            "$lookup": {
                "from": "countries",
                "localField": "country_id",
                "foreignField": "_id",
                "as": "country_info"
            }
        },
        {
            "$unwind": "$country_info"
        },
        {
            "$project":{
                "_id": {"$toString": "$_id"},
                "name": "$name",
                "acronym": "$acronym",
                "country_id": {"$toString": "$country_id"},
                "country": "$country_info"  
            }
        }
    ]
    universities = await db["universities"].aggregate(pipeline).to_list(1)
    if universities:
        university = universities[0]
        university["_id"] = str(university["_id"])
        university["country_id"] = str(university["country_id"])
        university["country"]["_id"] = str(university["country"]["_id"])
        university["country"]["continent"]["_id"] = str(university["country"]["continent"]["_id"])
        return university
    else:
        return {"error": "Universidad no encontrado"}, 404
    
@universitiesRouter.get("/universities/by_name/{name}") # y
async def get_universities_by_id(name: str = Path(...)):
    collation = Collation(locale='en', strength=2)
    universities = await db["universities"].find({"name": name}).collation(collation).to_list(1)
    if universities:
        university = universities[0]
        university["_id"] = str(university["_id"])
        university["country_id"] = str(university["country_id"])
        return university
    else:
        return {"error": "Universidad no encontrado"}, 404

@universitiesRouter.get("/universities/") # y
async def get_universities():
    pipeline = [
        {
            "$lookup": {
                "from": "countries",
                "localField": "country_id",
                "foreignField": "_id",
                "as": "country_info"
            }
        },
        {
            "$unwind": "$country_info"
        },
        {
            "$project":{
                "_id": {"$toString": "$_id"},
                "name": "$name",
                "acronym": "$acronym",
                "country_id": {"$toString": "$country_id"},
                "country": "$country_info"
            }
        }
    ]
    universities = await db["universities"].aggregate(pipeline).to_list(1000)
    for university in universities:
        university["_id"] = str(university["_id"])
        university["country_id"] = str(university["country_id"])
        university["country"]["_id"] = str(university["country"]["_id"])
        university["country"]["continent"]["_id"] = str(university["country"]["continent"]["_id"])
    return universities

@universitiesRouter.post("/universities/", response_model=University) # y
async def create_university(university: University):
    university_dict = university.dict(by_alias=True)
    university_dict["country_id"] = ObjectId(university_dict["country_id"])
    new_university = await db["universities"].insert_one(university_dict)
    created_university = await db["universities"].find_one({"_id": new_university.inserted_id})
    return created_university

@universitiesRouter.put("/universities/{university_id}")
async def update_university(university_id: str, university: University):
    university_data = university.dict(by_alias=True, exclude_unset=True)
    
    # if the country_id is included, convert it to ObjectId
    if 'country_id' in university_data:
        university_data['country_id'] = ObjectId(university_data['country_id'])

    updated_university = await db["universities"].find_one_and_update(
        {"_id": ObjectId(university_id)},
        {"$set": university_data},
        {"returnNewDocument": True}
    )
    
    if updated_university:
        # converts the _id and country_id back to string
        updated_university['_id'] = str(updated_university['_id'])
        if 'country_id' in updated_university:
            updated_university['country_id'] = str(updated_university['country_id'])
        return updated_university
    else:
        return {"error": "University not found"}, 404

@universitiesRouter.delete("/universities/{university_id}")
async def delete_university(university_id: str):
    # delete the university
    delete_result = await db["universities"].delete_one({"_id": ObjectId(university_id)})
    
    if delete_result.deleted_count:
        # delete all related exchanges
        await db["exchanges"].delete_many({"university_id": ObjectId(university_id)})
        return {"message": "University and related data successfully deleted"}
    else:
        return {"error": "University not found"}, 404

@modalityRouter.get("/modalities/") # y
async def get_modalities():
    modalities = await db["exchanges"].distinct("details.modality")
    return modalities

@statusRouter.get("/status/") # y
async def get_status():
    modalities = await db["exchanges"].distinct("details.status")
    return modalities