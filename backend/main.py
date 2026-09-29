from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(
    title="PermitGrid API",
    description="AI-powered industrial approval & compliance platform backend.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Client Initialization
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=500, detail="Database configuration missing")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

class BusinessProfileBase(BaseModel):
    business_name: str
    entity_type: str
    industry: str
    business_activity: str
    activity_type: str
    investment_amount: float
    employee_count: int
    project_stage: str

@app.get("/")
def read_root():
    return {"message": "Welcome to PermitGrid API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/approvals")
def get_approvals(supabase: Client = Depends(get_supabase)):
    """Fetch all approvals (verified ideally)"""
    try:
        response = supabase.table("approvals").select("*").execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/business-profile")
def create_business_profile(profile: BusinessProfileBase, supabase: Client = Depends(get_supabase)):
    """Create a new business profile and generate initial requirements"""
    try:
        # 1. Insert profile
        response = supabase.table("business_profiles").insert(profile.model_dump()).execute()
        new_profile = response.data[0]
        
        # 2. In a real scenario, this is where the Rules Engine & AI match approvals
        # For now, we will return the created profile.
        
        return {"status": "success", "data": new_profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
