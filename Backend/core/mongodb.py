from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance

    def connect(self):
        if self._client is None:
            try:
                mongo_uri = os.getenv('MONGO_URI')
                db_name = os.getenv('MONGO_DB_NAME', 'Jitwealth')
                
                if not mongo_uri:
                    raise ValueError("MONGO_URI not set in environment")
                
                self._client = MongoClient(
                    mongo_uri,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                )
                
                # Test connection
                self._client.admin.command('ping')
                
                self._db = self._client[db_name]
                logger.info(f"✓ Connected to MongoDB: {db_name}")
                
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                logger.error(f"✗ MongoDB connection failed: {str(e)}")
                raise Exception("Database connection failed")
        
        return self._db

    def get_collection(self, collection_name):
        if self._db is None:
            self.connect()
        return self._db[collection_name]

    def close(self):
        if self._client:
            self._client.close()
            self._client = None
            self._db = None
            logger.info("MongoDB connection closed")

# Singleton instance
mongodb = MongoDB()