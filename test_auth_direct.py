#!/usr/bin/env python3
"""
Direct test script for authentication system
"""

import sys
import os
import logging
from database_manager_sqlite import DatabaseManager

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def test_authentication():
    """Test the authentication system directly"""
    # Initialize database manager
    db = DatabaseManager()
    
    # Test user credentials
    test_email = "test@echoverse.com"
    test_password = "test123"
    
    print("\n=== Testing Authentication ===")
    print(f"Test Email: {test_email}")
    print(f"Test Password: {test_password}")
    
    # Try to authenticate
    print("\n[1] Attempting authentication...")
    user, message = db.authenticate_user(test_email, test_password)
    
    if user:
        print(f"✅ Authentication SUCCESSFUL!")
        print(f"User ID: {user.get('id')}")
        print(f"Name: {user.get('name')}")
    else:
        print(f"❌ Authentication FAILED: {message}")
        
        # Check if user exists
        print("\n[2] Checking if user exists in database...")
        user_data = db.get_user_by_email_with_password(test_email)
        if user_data:
            print("✅ User found in database:")
            print(f"User ID: {user_data.get('id')}")
            print(f"Name: {user_data.get('name')}")
            print(f"Stored password: {user_data.get('password')}")
            print(f"Stored password length: {len(user_data.get('password', ''))}")
        else:
            print("❌ User not found in database")
            
            # Try to create test user
            print("\n[3] Attempting to create test user...")
            try:
                user_id = db.create_user({
                    'name': 'Test User',
                    'email': test_email,
                    'password': test_password,
                    'phone': '+1234567890',
                    'university': 'Test University'
                })
                print(f"✅ Test user created with ID: {user_id}")
                
                # Try authenticating again
                print("\n[4] Attempting authentication with new user...")
                user, message = db.authenticate_user(test_email, test_password)
                if user:
                    print(f"✅ Authentication SUCCESSFUL with new user!")
                else:
                    print(f"❌ Authentication still failing: {message}")
                    
            except Exception as e:
                print(f"❌ Error creating test user: {str(e)}")

if __name__ == "__main__":
    print("=== EchoVerse Authentication Test ===\n")
    test_authentication()
