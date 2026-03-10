from core.mongodb import mongodb
from bson import ObjectId

class Counter:
    """Auto-incrementing ID generator"""
    
    @staticmethod
    def get_next_id(counter_name):
        """Get next ID for a counter"""
        counters = mongodb.get_collection('counters')
        
        result = counters.find_one_and_update(
            {'_id': counter_name},
            {'$inc': {'sequence': 1}},
            upsert=True,
            return_document=True
        )
        
        return result['sequence']
    
    @staticmethod
    def reset_counter(counter_name, start_value=1):
        """Reset a counter to a specific value"""
        counters = mongodb.get_collection('counters')
        counters.update_one(
            {'_id': counter_name},
            {'$set': {'sequence': start_value}},
            upsert=True
        )