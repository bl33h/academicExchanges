import os
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, Path
from motor.motor_asyncio import AsyncIOMotorClient
from models import Student, Country, Exchange, Career, University, User

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
    delete_result = await db["students"].delete_one({"_id": ObjectId(student_id)})
    if delete_result.deleted_count == 1:
        return {"message": "Estudiante eliminado"}
    else:
        return {"error": "Estudiante no encontrado"}, 404

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
    delete_result = await db["universities"].delete_one({"_id": ObjectId(university_id)})
    
    if delete_result.deleted_count:
        return {"message": "University successfully deleted"}
    else:
        return {"error": "University not found"}, 404

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