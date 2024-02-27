from pydantic import BaseModel
from typing import List

class Career(BaseModel):
    _id: str
    name: str
    faculty: dict

class Country(BaseModel):
    _id: str
    name: str
    iso: str
    continent: dict

class ExchangeDetails(BaseModel):
    year: str
    semester: str
    modality: str
    status: str
    start_date: str
    end_date: str
    comments: List[str]
class Exchange(BaseModel):
    _id: str
    student_id: str
    university_id: str
    details: ExchangeDetails



class Student(BaseModel):
    _id: str
    name: str
    email: str
    career_id: str
    carnet: str

class University(BaseModel):
    _id: str
    country_id: str
    name: str
    acronym: str
