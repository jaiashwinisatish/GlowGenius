# GlowGenius Backend

This is the Python FastAPI backend for the GlowGenius AI Beauty Assistant.

## Setup Instructions

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. **Run the server:**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Face Analysis
- `POST /analyze-face` - Analyze face from base64 image data
- `POST /upload-image` - Upload and analyze image file

### Recommendations
- `POST /generate-recommendations` - Generate beauty recommendations

## Features

- **Face Detection**: Uses MediaPipe Face Mesh for accurate facial landmark detection
- **Skin Tone Analysis**: Analyzes skin tone and undertone from facial regions
- **Color Extraction**: Uses K-means clustering for dominant color extraction
- **Recommendation Engine**: Generates personalized beauty recommendations
- **CORS Support**: Configured for frontend integration

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **MediaPipe**: Google's framework for building multimodal applied machine learning pipelines
- **OpenCV**: Computer vision library for image processing
- **Scikit-Learn**: Machine learning library for color clustering
- **NumPy**: Numerical computing library

## Project Structure

```
backend/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── .env                # Environment variables (create this)
└── README.md           # This file
```
