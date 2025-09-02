import pymysql
import sqlite3
import os
from datetime import datetime
import logging
from dotenv import load_dotenv
import bcrypt

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        """Initialize database manager with fallback from MySQL to SQLite"""
        self.use_mysql = True
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': int(os.getenv('DB_PORT', 3306)),
            'user': os.getenv('DB_USERNAME'),
            'password': os.getenv('DB_PASSWORD'),
            'database': os.getenv('DB_DATABASE'),
            'charset': 'utf8mb4',
            'cursorclass': pymysql.cursors.DictCursor
        }
        
        # Try MySQL connection, fallback to SQLite if it fails
        try:
            test_conn = pymysql.connect(**self.db_config)
            test_conn.close()
            logger.info("Using MySQL database")
        except Exception as e:
            logger.warning(f"MySQL connection failed: {e}")
            logger.info("Falling back to SQLite database")
            self.use_mysql = False
            self.sqlite_db_path = os.path.join(os.path.dirname(__file__), 'echoverse.db')
            self._init_sqlite()
    
    def _init_sqlite(self):
        """Initialize SQLite database with required tables"""
        conn = sqlite3.connect(self.sqlite_db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Create tables for SQLite
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                phone TEXT,
                address TEXT,
                date_of_birth DATE,
                education_level TEXT,
                field_of_study TEXT,
                preferred_voice TEXT DEFAULT 'david',
                preferred_tone TEXT DEFAULT 'neutral',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audio_history (
                history_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                original_text TEXT NOT NULL,
                rewritten_text TEXT,
                tone TEXT,
                voice TEXT,
                audio_file_path TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS downloads (
                download_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                history_id INTEGER NOT NULL,
                download_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id),
                FOREIGN KEY (history_id) REFERENCES audio_history (history_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS voices (
                voice_id TEXT PRIMARY KEY,
                voice_name TEXT NOT NULL,
                language TEXT,
                gender TEXT,
                description TEXT,
                is_available INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tones (
                tone_id TEXT PRIMARY KEY,
                tone_name TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admins (
                admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS study_materials (
                material_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                chapters TEXT,
                file_type TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        ''')
        
        conn.commit()
        
        # Insert default voices and tones if they don't exist
        self._insert_default_data(conn)
        
        conn.close()
    
    def _insert_default_data(self, conn):
        """Insert default voices and tones data"""
        cursor = conn.cursor()
        
        # Default voices
        voices = [
            ('david', 'David', 'en-US', 'Male', 'Clear American male voice'),
            ('jenny', 'Jenny', 'en-US', 'Female', 'Natural American female voice'),
            ('aria', 'Aria', 'en-US', 'Female', 'Expressive American female voice'),
            ('guy', 'Guy', 'en-US', 'Male', 'Mature American male voice'),
            ('sara', 'Sara', 'en-US', 'Female', 'Professional American female voice')
        ]
        
        for voice in voices:
            cursor.execute('''
                INSERT OR IGNORE INTO voices (voice_id, voice_name, language, gender, description)
                VALUES (?, ?, ?, ?, ?)
            ''', voice)
        
        # Default tones
        tones = [
            ('neutral', 'Neutral', 'Clear and balanced narration'),
            ('cheerful', 'Cheerful', 'Bright, happy, and energetic'),
            ('suspenseful', 'Suspenseful', 'Dramatic and engaging delivery'),
            ('inspiring', 'Inspiring', 'Uplifting and motivational tone'),
            ('sad', 'Sad', 'Soft, somber, and emotional'),
            ('angry', 'Angry', 'Intense and passionate delivery'),
            ('playful', 'Playful', 'Fun, lively, and whimsical'),
            ('calm', 'Calm', 'Relaxed and soothing narration'),
            ('confident', 'Confident', 'Assured and persuasive')
        ]
        
        for tone in tones:
            cursor.execute('''
                INSERT OR IGNORE INTO tones (tone_id, tone_name, description)
                VALUES (?, ?, ?)
            ''', tone)
        
        conn.commit()
    
    def get_connection(self):
        """Get database connection (MySQL or SQLite)"""
        if self.use_mysql:
            return pymysql.connect(**self.db_config)
        else:
            conn = sqlite3.connect(self.sqlite_db_path)
            conn.row_factory = sqlite3.Row
            return conn
    
    def execute_query(self, query, params=None, fetch=False):
        """Execute query with proper handling for both MySQL and SQLite"""
        conn = self.get_connection()
        try:
            if self.use_mysql:
                with conn.cursor() as cursor:
                    cursor.execute(query, params or ())
                    if fetch:
                        return cursor.fetchall()
                    conn.commit()
                    return cursor.lastrowid if hasattr(cursor, 'lastrowid') else None
            else:
                cursor = conn.cursor()
                cursor.execute(query, params or ())
                if fetch:
                    return [dict(row) for row in cursor.fetchall()]
                conn.commit()
                return cursor.lastrowid
        finally:
            conn.close()
    
    # User Management
    def create_user(self, name, email, password, phone=None, address=None, date_of_birth=None, 
                   education_level=None, field_of_study=None):
        """Create a new user"""
        try:
            # Hash the password
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            if self.use_mysql:
                query = '''
                    INSERT INTO users (name, email, password_hash, phone, address, date_of_birth, 
                                     education_level, field_of_study)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                '''
            else:
                query = '''
                    INSERT INTO users (name, email, password_hash, phone, address, date_of_birth, 
                                     education_level, field_of_study)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                '''
            
            params = (name, email, password_hash, phone, address, date_of_birth, 
                     education_level, field_of_study)
            
            user_id = self.execute_query(query, params)
            return user_id
            
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None
    
    def authenticate_user(self, email, password):
        """Authenticate user login"""
        try:
            if self.use_mysql:
                query = "SELECT * FROM users WHERE email = %s"
            else:
                query = "SELECT * FROM users WHERE email = ?"
            
            users = self.execute_query(query, (email,), fetch=True)
            
            if users and len(users) > 0:
                user = users[0]
                stored_hash = user['password_hash']
                if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
                    return {
                        'id': user['user_id'],
                        'name': user['name'],
                        'email': user['email'],
                        'phone': user.get('phone'),
                        'address': user.get('address'),
                        'preferred_voice': user.get('preferred_voice', 'david'),
                        'preferred_tone': user.get('preferred_tone', 'neutral')
                    }
            return None
            
        except Exception as e:
            logger.error(f"Error authenticating user: {e}")
            return None
    
    def save_audio_history(self, user_id, original_text, rewritten_text, tone, voice, audio_file_path=None):
        """Save audio generation to history"""
        try:
            if self.use_mysql:
                query = '''
                    INSERT INTO audio_history (user_id, original_text, rewritten_text, tone, voice, audio_file_path)
                    VALUES (%s, %s, %s, %s, %s, %s)
                '''
            else:
                query = '''
                    INSERT INTO audio_history (user_id, original_text, rewritten_text, tone, voice, audio_file_path)
                    VALUES (?, ?, ?, ?, ?, ?)
                '''
            
            params = (user_id, original_text, rewritten_text, tone, voice, audio_file_path)
            history_id = self.execute_query(query, params)
            return history_id
            
        except Exception as e:
            logger.error(f"Error saving audio history: {e}")
            return None
    
    def get_user_history(self, user_id):
        """Get user's audio history"""
        try:
            if self.use_mysql:
                query = '''
                    SELECT history_id, original_text, rewritten_text, tone, voice, 
                           audio_file_path, created_at 
                    FROM audio_history 
                    WHERE user_id = %s 
                    ORDER BY created_at DESC
                '''
            else:
                query = '''
                    SELECT history_id, original_text, rewritten_text, tone, voice, 
                           audio_file_path, created_at 
                    FROM audio_history 
                    WHERE user_id = ? 
                    ORDER BY created_at DESC
                '''
            
            return self.execute_query(query, (user_id,), fetch=True)
            
        except Exception as e:
            logger.error(f"Error getting user history: {e}")
            return []
    
    def get_voices(self):
        """Get available voices"""
        try:
            query = "SELECT * FROM voices WHERE is_available = 1 ORDER BY voice_name" if self.use_mysql else "SELECT * FROM voices WHERE is_available = 1 ORDER BY voice_name"
            return self.execute_query(query, fetch=True)
        except Exception as e:
            logger.error(f"Error getting voices: {e}")
            return []
    
    def get_tones(self):
        """Get available tones"""
        try:
            query = "SELECT * FROM tones ORDER BY tone_name"
            return self.execute_query(query, fetch=True)
        except Exception as e:
            logger.error(f"Error getting tones: {e}")
            return []
    
    def save_study_material(self, user_id, title, content, chapters, file_type=None):
        """Save study material"""
        try:
            if self.use_mysql:
                query = '''
                    INSERT INTO study_materials (user_id, title, content, chapters, file_type)
                    VALUES (%s, %s, %s, %s, %s)
                '''
            else:
                query = '''
                    INSERT INTO study_materials (user_id, title, content, chapters, file_type)
                    VALUES (?, ?, ?, ?, ?)
                '''
            
            params = (user_id, title, content, chapters, file_type)
            return self.execute_query(query, params)
            
        except Exception as e:
            logger.error(f"Error saving study material: {e}")
            return None

# Initialize the database when module is imported
try:
    db_manager = DatabaseManager()
    logger.info("Database manager initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database manager: {e}")
    raise e
