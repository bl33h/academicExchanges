from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from clientsManagement import studentsRouter, countriesRouter, majorsRouter, exchangesRouter, universitiesRouter, modalityRouter, statusRouter

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
app.include_router(modalityRouter)
app.include_router(statusRouter)

def run():
    return app