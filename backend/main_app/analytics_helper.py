import os
import datetime
from pymongo import MongoClient

MONGO_URI = os.environ.get('MONGO_URI', '')

def get_mongo_db():
    if not MONGO_URI:
        return None
    try:
        # Fail fast if MongoDB is not responding (2 seconds timeout)
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        # Ping the server to verify connection
        client.admin.command('ping')
        return client['college_erp_analytics']
    except Exception as e:
        print(f"[MONGODB] Connection error: {str(e)}")
        return None

def log_analytics_event(event_type, data):
    """
    Logs an event to MongoDB. Falls back to console printing if MongoDB is offline.
    """
    timestamp = datetime.datetime.now(datetime.timezone.utc)
    event_doc = {
        'event_type': event_type,
        'timestamp': timestamp,
        'data': data
    }
    
    db = get_mongo_db()
    if db is not None:
        try:
            db['events'].insert_one(event_doc)
            print(f"[MONGODB ANALYTICS] Logged: {event_type}")
            return True
        except Exception as e:
            print(f"[MONGODB ANALYTICS] Error: {str(e)}")
            
    # Fallback logger
    print(f"[LOCAL ANALYTICS] {timestamp} | {event_type} | {data}")
    return False
