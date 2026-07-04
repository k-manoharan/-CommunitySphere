import os
import sqlite3
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/feedback", tags=["Citizen Feedback"])

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database")
DB_PATH = os.path.join(DB_DIR, "sqlite.db")

# Ensure database directory exists
os.makedirs(DB_DIR, exist_ok=True)

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            report_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            status TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    # Insert mock entries if database is fresh
    cursor.execute("SELECT COUNT(*) FROM feedback")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO feedback (category, description, location, status, timestamp)
            VALUES 
            ('Water Leakage', 'Large water pipe burst near South Road, causing minor logging.', 'South Sector (Zone 4)', 'In Progress', '2026-07-04T10:15:00Z'),
            ('Garbage Overflow', 'Waste containers outside the school are overflowing and blocking sidewalk.', 'North Sector (Zone 1)', 'Submitted', '2026-07-04T11:45:00Z')
        """)
    conn.commit()
    conn.close()

init_db()

class FeedbackCreate(BaseModel):
    category: str
    description: str
    location: str

@router.get("")
def get_feedback():
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM feedback ORDER BY report_id DESC")
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

@router.post("")
def post_feedback(report: FeedbackCreate):
    try:
        import datetime
        timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO feedback (category, description, location, status, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (report.category, report.description, report.location, "Submitted", timestamp))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "status": "success",
            "report": {
                "report_id": new_id,
                "category": report.category,
                "description": report.description,
                "location": report.location,
                "status": "Submitted",
                "timestamp": timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database insertion error: {str(e)}")
