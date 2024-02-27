from pydantic import BaseModel

class Career(BaseModel):
    _id: str
    name: str
    faculty: dict

class Country(BaseModel):
    _id: str
    name: str
    iso: str
    continent: dict

class Exchange(BaseModel):
    _id: str
    student_id: str
    university_id: str
    details: dict

class Student(BaseModel):
    _id: str
    name: str
    email: str
    career_id: str

class University(BaseModel):
    _id: str
    country_id: str
    name: str
    acronym: str
