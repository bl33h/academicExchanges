from pydantic import BaseModel

class Career(BaseModel):
    id: str
    name: str
    faculty: dict

class Country(BaseModel):
    id: str
    name: str
    iso: str
    continent: dict

class Exchange(BaseModel):
    id: str
    student_id: str
    university_id: str
    details: dict

class Student(BaseModel):
    id: str
    name: str
    email: str
    career_id: str

class University(BaseModel):
    id: str
    country_id: str
    name: str
    acronym: str

class User(BaseModel):
    id: str
    email: str
    password: str