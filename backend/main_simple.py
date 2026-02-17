from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="GlowGenius AI Beauty API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FaceAnalysisRequest(BaseModel):
    image_data: str

class BeautyAnalysis(BaseModel):
    skin_tone: str
    undertone: str
    lip_color: str

class Recommendations(BaseModel):
    lipsticks: list
    dress_colors: list
    makeup_styles: list
    accessories: list

class AnalysisResponse(BaseModel):
    analysis: BeautyAnalysis
    recommendations: Recommendations

@app.get("/")
async def root():
    return {"message": "GlowGenius AI Beauty API is running"}

@app.post("/analyze-face", response_model=AnalysisResponse)
async def analyze_face(request: FaceAnalysisRequest):
    """
    Analyze face and return beauty recommendations
    """
    try:
        # Mock analysis for now - replace with actual ML logic
        analysis = BeautyAnalysis(
            skin_tone="wheatish",
            undertone="warm",
            lip_color="#FF7F50"
        )
        
        recommendations = Recommendations(
            lipsticks=[
                {"name": "Coral Bliss", "hex": "#FF7F50", "description": "Vibrant coral shade perfect for warm undertones"},
                {"name": "Peach Dream", "hex": "#FFDAB9", "description": "Soft peachy nude for everyday wear"}
            ],
            dress_colors=[
                {"name": "Olive Green", "hex": "#6B8E23", "reason": "Complements warm skin beautifully"},
                {"name": "Burnt Orange", "hex": "#CC5500", "reason": "Creates stunning warm contrast"}
            ],
            makeup_styles=[
                {"style": "Natural Glow", "description": "Enhance your natural beauty with minimal makeup"}
            ],
            accessories=[
                {"type": "Jewelry", "colors": ["Gold", "Rose Gold"], "description": "Warm metals complement your undertone"}
            ]
        )
        
        return AnalysisResponse(analysis=analysis, recommendations=recommendations)
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "glowgenius-api"}

if __name__ == "__main__":
    print("🚀 Starting GlowGenius AI Beauty API...")
    print("📡 Server will be available at: http://localhost:8000")
    print("🔗 Frontend can connect from: http://localhost:5173")
    uvicorn.run(app, host="0.0.0.0", port=8000)
