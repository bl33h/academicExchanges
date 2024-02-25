from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from clientsManagement import studentsRouter, countriesRouter, majorsRouter, exchangesRouter, universitiesRouter, usersRouter

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(studentsRouter)
app.include_router(majorsRouter)
app.include_router(countriesRouter)
app.include_router(exchangesRouter)
app.include_router(universitiesRouter)
app.include_router(usersRouter)

def run():
    return app