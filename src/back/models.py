from pydantic import BaseModel
from bson import ObjectId

class Career(BaseModel):
    _id: ObjectId
    name: str
    faculty: dict

class Country(BaseModel):
    _id: ObjectId
    name: str
    iso: str
    continent: dict

class Exchange(BaseModel):
    _id: ObjectId
    student_id: ObjectId
    university_id: ObjectId
    details: dict

class Student(BaseModel):
    _id: ObjectId
    name: str
    email: str
    career_id: ObjectId

class University(BaseModel):
    _id: ObjectId
    country_id: ObjectId
    name: str
    acronym: str

# class User(BaseModel):
#     id: ObjectId
#     email: str
#     password: str