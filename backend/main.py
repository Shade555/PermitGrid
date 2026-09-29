from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from groq import Groq

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
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

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
    state: str
    district: str
    city: str
    pin: str

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
    """Create a new business profile and generate initial requirements using Groq LLM"""
    try:
        profile_data = profile.model_dump()
        
        # 1. Attempt to insert profile into Supabase
        try:
            response = supabase.table("business_profiles").insert(profile_data).execute()
            new_profile = response.data[0]
        except Exception as db_err:
            print(f"DB Insert failed (likely RLS or missing user_id): {db_err}")
            new_profile = profile_data
            new_profile["id"] = "mock-id-for-mvp"
        
        # 2. Use Groq to analyze the profile and return recommended approvals
        recommended_approvals = []
        if groq_client:
            prompt = f"""
            Analyze the following industrial business profile and list the potential regulatory approvals, NOCs, and licences required in India (specifically {profile.state}).
            
            Business Profile:
            - Industry: {profile.industry}
            - Activity: {profile.business_activity} ({profile.activity_type})
            - Investment: Rs. {profile.investment_amount}
            - Employees: {profile.employee_count}
            
            Respond ONLY with a JSON array of objects. Each object should have:
            - "name": The name of the approval (e.g. "FSSAI State Licence")
            - "authority": Issuing authority (e.g. "FDA")
            - "stage": One of "pre-establishment", "pre-operation", or "operations"
            - "why_it_applies": A short explanation based on the profile.
            
            Keep the list to the top 4-6 most critical approvals.
            """
            
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a regulatory compliance AI for India. You must respond in valid JSON format."
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model="llama3-8b-8192",
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                
                content = chat_completion.choices[0].message.content
                print(f"Raw AI Response: {content}")
                # Safely parse JSON if Groq wrapped it in an object
                parsed = json.loads(content)
                
                if isinstance(parsed, dict) and "approvals" in parsed:
                    recommended_approvals = parsed["approvals"]
                elif isinstance(parsed, list):
                    recommended_approvals = parsed
                elif isinstance(parsed, dict):
                    # extract the first list value found
                    for val in parsed.values():
                        if isinstance(val, list):
                            recommended_approvals = val
                            break
                            
            except Exception as ai_err:
                print(f"AI Generation failed: {ai_err}")
        else:
            print("GROQ_API_KEY is not set.")
        
        return {
            "status": "success", 
            "data": {
                "profile": new_profile,
                "recommended_approvals": recommended_approvals
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
