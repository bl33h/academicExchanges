import uvicorn

def main():
    uvicorn.run("client:run", host="127.0.0.1", port=8001, reload=True)

if __name__ == '__main__':
    main()