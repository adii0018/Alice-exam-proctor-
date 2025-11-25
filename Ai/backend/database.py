from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

class Database:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

db = Database()

def get_database() -> AsyncIOMotorDatabase:
    return db.database
