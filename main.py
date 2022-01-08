from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prisma import Client
from pydantic import BaseModel

client = Client()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CreateInput(BaseModel):
    sku: str
    name: str
    description: str
    color: Optional[str]
    size: Optional[str]
    count: int

class UpdateInput(BaseModel):
    name: str
    description: str
    color: Optional[str]
    size: Optional[str]
    count: int

'''
CRUD inventory tracking web application
- Create inventory items
- Edit Them
- Delete Them
- View a list of them
'''

@app.on_event("startup")
async def startup_event():
    await client.connect()

@app.on_event('shutdown')
async def shutdown_event():
    await client.disconnect()

BASE_URL = '/api/item'

@app.post(BASE_URL)
async def create(item: CreateInput):
    assert item.sku != "list", "sku cannot be the reserved word 'list'"

    return await client.item.create(data={
        "sku": item.sku,
        "name": item.name,
        "description": item.description,
        "color": item.color,
        "size": item.size,
        "count": item.count
    })

@app.put(BASE_URL+"/{sku}")
async def edit(sku: str, item: UpdateInput):
    return await client.item.update(
        where={ "sku": sku }, 
        data={
            "name": item.name,
            "description": item.description,
            "color": item.color,
            "size": item.size,
            "count": item.count
        }
    )

@app.delete(BASE_URL+"/{sku}")
async def delete(sku: str):
    return await client.item.delete(where={ "sku": sku })

@app.get(BASE_URL+"/list")
async def getall():
    return await client.item.find_many()

@app.get(BASE_URL+"/{sku}")
async def getone(sku: str):
    return await client.item.find_unique(where={ "sku": sku })
