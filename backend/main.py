from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import pandas as pd
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Client Initialization
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# Load dataset once into memory
DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.xlsx")
try:
    df_approvals = pd.read_excel(DATASET_PATH)
    print(f"✅ Loaded {len(df_approvals)} approvals from dataset.")
except Exception as e:
    print(f"⚠️ Failed to load dataset: {e}")
    df_approvals = pd.DataFrame()

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

@app.post("/api/business-profile")
def create_business_profile(profile: BusinessProfileBase, supabase: Client = Depends(get_supabase)):
    """Create a new business profile and generate initial requirements using Groq LLM + Local Dataset (RAG)"""
    try:
        profile_data = profile.model_dump()
        
        # 1. Attempt to insert profile into Supabase
        try:
            response = supabase.table("business_profiles").insert(profile_data).execute()
            new_profile = response.data[0]
        except Exception as db_err:
            new_profile = profile_data
            new_profile["id"] = "mock-id-for-mvp"
        
        # 2. RAG Filtering: Extract relevant approvals from dataset
        context_str = ""
        if not df_approvals.empty:
            # Filter loosely by state or generic
            mask = df_approvals['State'].str.contains(profile.state, case=False, na=False) | df_approvals['State'].str.contains("Central", case=False, na=False)
            filtered_df = df_approvals[mask]
            
            # Convert top 20 relevant rows to JSON string to inject into prompt
            # (In production, use semantic vector search. For hackathon, strict filtering works perfectly!)
            context_records = filtered_df.head(20).to_dict(orient='records')
            context_str = json.dumps(context_records, indent=2)

        # 3. Use Groq to analyze the profile + RAG Context
        recommended_approvals = []
        if groq_client:
            prompt = f"""
            You are an expert regulatory AI. Using ONLY the provided OFFICIAL DATASET CONTEXT below, determine the top 6 most applicable industrial approvals, NOCs, and licences required for the following business.
            
            BUSINESS PROFILE:
            - Industry: {profile.industry}
            - Activity: {profile.business_activity} ({profile.activity_type})
            - Investment: Rs. {profile.investment_amount}
            - State: {profile.state}
            
            OFFICIAL DATASET CONTEXT (JSON):
            {context_str if context_str else 'No official context found, generate best guess based on Indian law.'}
            
            Respond ONLY with a JSON array of objects mapped to this schema. Do not include markdown formatting outside the JSON.
            Schema for each object:
            - "name": The name of the approval (e.g. "Consent to Establish")
            - "authority": Issuing authority
            - "stage": One of "pre-establishment", "pre-operation", or "operations"
            - "why_it_applies": A short explanation based on the profile mapping.
            """
            
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a regulatory compliance AI for India. You must respond in valid JSON format. Always wrap your array in an object: {\"approvals\": [...]}"
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model="openai/gpt-oss-120b",
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                
                content = chat_completion.choices[0].message.content
                parsed = json.loads(content)
                
                if isinstance(parsed, dict) and "approvals" in parsed:
                    recommended_approvals = parsed["approvals"]
                elif isinstance(parsed, list):
                    recommended_approvals = parsed
                elif isinstance(parsed, dict):
                    for val in parsed.values():
                        if isinstance(val, list):
                            recommended_approvals = val
                            break
                            
            except Exception as ai_err:
                print(f"AI Generation failed: {ai_err}")
        
        return {
            "status": "success", 
            "data": {
                "profile": new_profile,
                "recommended_approvals": recommended_approvals
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DocumentAnalyzeRequest(BaseModel):
    filename: str
    file_type: str
    industry: str
    state: str

@app.post("/api/analyze-document")
def analyze_document(req: DocumentAnalyzeRequest):
    """Use AI to simulate document verification"""
    if not groq_client:
        return {"status": "success", "data": {"status": "Valid", "issues": [], "feedback": "AI Not Configured"}}
        
    prompt = f"""
    You are an AI document verifier for Indian industrial compliance.
    A user uploaded a document named '{req.filename}' (Type: {req.file_type}).
    The business is in the {req.industry} sector in {req.state}.
    
    Determine if this filename looks like a standard required document (e.g., Factory Layout, MOA, PAN Card).
    Then, simulate a "Readiness Check". Find 1 or 2 plausible issues with this document that an inspector might reject (e.g. "Missing authorized signature", "Not notarized", "Blurry text", "Wrong format").
    If it sounds like a perfect document, you can return 0 issues.
    
    Respond strictly in JSON:
    {{
        "document_type_identified": "string",
        "status": "Needs Revision" or "Ready",
        "issues": ["Issue 1", "Issue 2"] // empty array if Ready
    }}
    """
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "system", "content": "Respond in valid JSON only."},{"role": "user", "content": prompt}],
            model="openai/gpt-oss-120b",
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        return {"status": "success", "data": json.loads(chat_completion.choices[0].message.content)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
