import hashlib
import uuid

class AuthUser:
    def __init__(self, record: dict):
        self.record = record

    def process_user(self):
        self.record['user_id'] = self.compute_uuid() 
        self.record['salt'] = uuid.uuid1().hex # passing none to arguments generates a random 14 bit sequence number
        self.record['hash'] = hashlib.md5(self.compute_hash()).hexdigest() 
        return self.record
    
    def compute_hash(self):
        return (self.record['username'] + '|' + self.record['salt']  + '|' + self.record['password'] ).encode()

    def check_password(self):
        return self.record['hash'] == self.compute_hash()

    def compute_uuid(self):
        #uuid.NAMESPACE_URL = 6ba7b811-9dad-11d1-80b4-00c04fd430c8
        return uuid.uuid3(uuid.NAMESPACE_URL, self.record['username']).hex
    
    def get_username(self):
        return self.record['username']