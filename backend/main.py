from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import base64
import numpy as np
import cv2
import mediapipe as mp
from sklearn.cluster import KMeans
import json
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GlowGenius AI Beauty API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Lip landmarks indices for MediaPipe Face Mesh
LIP_LANDMARKS = {
    'upper_lip': [61, 84, 17, 314, 405, 291, 375, 321, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
    'lower_lip': [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
    'face_regions': {
        'left_cheek': [50, 101, 165, 234, 127, 162, 21, 54, 103, 67, 109],
        'right_cheek': [280, 351, 421, 346, 280, 330, 296, 334, 293, 300, 384],
        'forehead': [10, 9, 151, 337, 299, 333, 298, 301],
        'nose_tip': [1, 2, 5, 4, 6, 19, 20, 94, 125, 141, 235, 236, 237, 238, 239, 240, 241, 242]
    }
}

class BeautyAnalyzer:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def analyze_skin_tone(self, rgb_values):
        """Analyze skin tone from RGB values"""
        r, g, b = rgb_values
        
        # Calculate skin tone parameters
        if r > 200 and g > 180 and b > 160:
            return 'fair'
        elif r > 150 and g > 120 and b > 100:
            return 'wheatish'
        else:
            return 'dark'
    
    def analyze_undertone(self, rgb_values):
        """Analyze undertone from RGB values"""
        r, g, b = rgb_values
        
        # Calculate undertone based on color ratios
        rg_ratio = r / g if g > 0 else 1
        rb_ratio = r / b if b > 0 else 1
        
        if rg_ratio > 1.1 and rb_ratio > 1.2:
            return 'warm'
        elif rg_ratio < 0.9 and rb_ratio < 1.0:
            return 'cool'
        else:
            return 'neutral'
    
    def extract_dominant_color(self, pixels):
        """Extract dominant color using K-means clustering"""
        if len(pixels) == 0:
            return [128, 128, 128]  # Default gray
        
        pixels = np.array(pixels)
        kmeans = KMeans(n_clusters=1, random_state=42, n_init=10)
        kmeans.fit(pixels)
        dominant_color = kmeans.cluster_centers_[0].astype(int)
        
        return dominant_color.tolist()
    
    def get_region_pixels(self, image, landmarks, region_indices):
        """Extract pixels from specific face region"""
        h, w = image.shape[:2]
        pixels = []
        
        for idx in region_indices:
            if idx < len(landmarks.landmark):
                landmark = landmarks.landmark[idx]
                x, y = int(landmark.x * w), int(landmark.y * h)
                
                # Extract pixels in a small region around the landmark
                region_size = 10
                x_start = max(0, x - region_size)
                x_end = min(w, x + region_size)
                y_start = max(0, y - region_size)
                y_end = min(h, y + region_size)
                
                region_pixels = image[y_start:y_end, x_start:x_end]
                if region_pixels.size > 0:
                    pixels.extend(region_pixels.reshape(-1, 3).tolist())
        
        return pixels
    
    def analyze_face(self, image_data: str) -> Dict[str, Any]:
        """Analyze face from base64 image data"""
        try:
            # Decode base64 image
            image_data = image_data.split(',')[1] if ',' in image_data else image_data
            image_bytes = base64.b64decode(image_data)
            
            # Convert to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Process with MediaPipe
            results = self.face_mesh.process(image_rgb)
            
            if not results.multi_face_landmarks:
                raise HTTPException(status_code=400, detail="No face detected in the image")
            
            face_landmarks = results.multi_face_landmarks[0]
            
            # Extract skin pixels from different regions
            skin_pixels = []
            for region_name, region_indices in LIP_LANDMARKS['face_regions'].items():
                if region_name != 'nose_tip':  # Skip nose for skin tone analysis
                    region_pixels = self.get_region_pixels(image_rgb, face_landmarks, region_indices)
                    skin_pixels.extend(region_pixels)
            
            # Get dominant skin color
            skin_dominant_color = self.extract_dominant_color(skin_pixels)
            skin_tone = self.analyze_skin_tone(skin_dominant_color)
            undertone = self.analyze_undertone(skin_dominant_color)
            
            # Extract lip pixels
            lip_pixels = []
            lip_indices = LIP_LANDMARKS['upper_lip'] + LIP_LANDMARKS['lower_lip']
            lip_pixels = self.get_region_pixels(image_rgb, face_landmarks, lip_indices)
            
            lip_dominant_color = self.extract_dominant_color(lip_pixels)
            
            # Generate analysis result
            analysis = {
                'skin_tone': skin_tone,
                'undertone': undertone,
                'skin_tone_rgb': {
                    'r': int(skin_dominant_color[0]),
                    'g': int(skin_dominant_color[1]),
                    'b': int(skin_dominant_color[2])
                },
                'lip_color': {
                    'r': int(lip_dominant_color[0]),
                    'g': int(lip_dominant_color[1]),
                    'b': int(lip_dominant_color[2])
                },
                'face_detected': True,
                'confidence': 0.95  # Placeholder confidence score
            }
            
            return analysis
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error analyzing face: {str(e)}")

# Initialize analyzer
beauty_analyzer = BeautyAnalyzer()

@app.get("/")
async def root():
    return {"message": "GlowGenius AI Beauty API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "GlowGenius AI Beauty API"}

@app.post("/analyze-face")
async def analyze_face(image_data: dict):
    """Analyze face from uploaded image"""
    try:
        if 'image' not in image_data:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        analysis = beauty_analyzer.analyze_face(image_data['image'])
        return JSONResponse(content=analysis)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload and analyze image file"""
    try:
        # Read file content
        contents = await file.read()
        
        # Convert to base64
        image_data = base64.b64encode(contents).decode('utf-8')
        image_data_url = f"data:image/jpeg;base64,{image_data}"
        
        # Analyze the image
        analysis = beauty_analyzer.analyze_face(image_data_url)
        
        return JSONResponse(content=analysis)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/generate-recommendations")
async def generate_recommendations(analysis_data: dict):
    """Generate beauty recommendations based on analysis"""
    try:
        skin_tone = analysis_data.get('skin_tone', 'fair')
        undertone = analysis_data.get('undertone', 'neutral')
        occasion = analysis_data.get('occasion', 'casual')
        budget = analysis_data.get('budget', 'under500')
        
        # Generate recommendations (simplified version)
        recommendations = {
            'lipsticks': generate_lipstick_recommendations(undertone, occasion, budget),
            'dress_colors': generate_dress_recommendations(skin_tone, undertone, occasion),
            'makeup_styles': generate_makeup_recommendations(skin_tone, undertone, occasion),
            'accessories': generate_accessory_recommendations(undertone, occasion)
        }
        
        return JSONResponse(content=recommendations)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

def generate_lipstick_recommendations(undertone: str, occasion: str, budget: str) -> list:
    """Generate lipstick recommendations based on undertone, occasion, and budget"""
    # This is a simplified version - in production, this would query a database
    base_recommendations = {
        'warm': [
            {'name': 'Coral Bliss', 'hex': '#FF7F50', 'description': 'Vibrant coral perfect for warm undertones', 'category': 'Everyday'},
            {'name': 'Peach Dream', 'hex': '#FFDAB9', 'description': 'Soft peachy nude', 'category': 'Nude'},
            {'name': 'Warm Red', 'hex': '#DC143C', 'description': 'Classic red with orange undertones', 'category': 'Bold'}
        ],
        'cool': [
            {'name': 'Berry Crush', 'hex': '#8B008B', 'description': 'Deep berry for cool undertones', 'category': 'Bold'},
            {'name': 'Pink Mauve', 'hex': '#D8BFD8', 'description': 'Sophisticated mauve pink', 'category': 'Everyday'},
            {'name': 'Cool Red', 'hex': '#C41E3A', 'description': 'Blue-based classic red', 'category': 'Bold'}
        ],
        'neutral': [
            {'name': 'Versatile Nude', 'hex': '#C9A88E', 'description': 'Universal nude shade', 'category': 'Nude'},
            {'name': 'Mauve Rose', 'hex': '#E0B0C0', 'description': 'Balanced mauve-rose', 'category': 'Everyday'},
            {'name': 'True Red', 'hex': '#FF0000', 'description': 'Pure classic red', 'category': 'Bold'}
        ]
    }
    
    return base_recommendations.get(undertone, base_recommendations['neutral'])

def generate_dress_recommendations(skin_tone: str, undertone: str, occasion: str) -> list:
    """Generate dress color recommendations"""
    # Simplified version - in production, this would be more sophisticated
    return [
        {'name': 'Navy Blue', 'hex': '#000080', 'reason': 'Elegant and versatile', 'occasion': occasion},
        {'name:': 'Emerald Green', 'hex': '#50C878', 'reason': 'Rich and sophisticated', 'occasion': occasion},
        {'name': 'Classic Red', 'hex': '#C41E3A', 'reason': 'Timeless and bold', 'occasion': occasion}
    ]

def generate_makeup_recommendations(skin_tone: str, undertone: str, occasion: str) -> list:
    """Generate makeup style recommendations"""
    return [
        {
            'style': f'{occasion.title()} Ready',
            'description': f'Perfect makeup for {occasion} occasions',
            'tips': [
                'Start with good skincare',
                'Choose colors that complement your undertone',
                'Blend well for a natural finish'
            ]
        }
    ]

def generate_accessory_recommendations(undertone: str, occasion: str) -> list:
    """Generate accessory recommendations"""
    metal_types = {
        'warm': ['Gold', 'Rose Gold', 'Copper'],
        'cool': ['Silver', 'White Gold', 'Platinum'],
        'neutral': ['Gold', 'Silver', 'Rose Gold']
    }
    
    return [
        {
            'type': 'Jewelry',
            'colors': metal_types.get(undertone, metal_types['neutral']),
            'description': f'Metals that complement {undertone} undertones'
        }
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
