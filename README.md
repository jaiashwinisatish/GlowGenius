# GlowGenius AI Beauty Assistant

An advanced AI-powered beauty analysis platform that provides personalized makeup and fashion recommendations using cutting-edge computer vision and machine learning technologies.

## 🌟 New AI Features

### 1. **Live Virtual Try-On** 💄
- Real-time lipstick application using Mediapipe Face Mesh
- Canvas + WebGL overlay for seamless color blending
- 8+ lipstick shades with instant preview
- Accurate lip detection and mapping

### 2. **AI Explain Mode (ELI5)** 🧠
- Simple, human-friendly explanations of your beauty profile
- Personalized tips based on skin tone and undertone
- Educational content about color theory
- Easy-to-understand recommendations

### 3. **Occasion Mode** 📅
- Wedding: Elegant and romantic looks
- Office: Professional and polished styles
- Party: Bold and glamorous options
- Casual: Relaxed and natural choices
- Dynamic recommendations based on selected occasion

### 4. **Budget Mode** 💰
- Under ₹500: Budget-friendly brands (ColorBar, Lakme, Faces Canada)
- Under ₹1000: Mid-range options (Maybelline, NYX, Loreal, MAC)
- Premium: Luxury brands (Dior, Chanel, YSL, Tom Ford)
- Real product recommendations with pricing

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **MediaPipe Face Mesh** for face detection
- **TensorFlow.js** for ML models
- **Canvas + WebGL** for real-time rendering

### Backend
- **Python FastAPI** for REST API
- **MediaPipe** for face landmark detection
- **OpenCV** for image processing
- **Scikit-Learn** for color clustering
- **Supabase** for database

### Integration
- **Real-time camera access** for virtual try-on
- **Base64 image encoding** for API communication
- **CORS-enabled** backend for frontend integration

## 🚀 Quick Start

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

## 📁 Project Structure

```
GlowGenius/
├── src/
│   ├── components/
│   │   ├── VirtualTryOn.tsx      # Live virtual try-on with MediaPipe
│   │   ├── AIExplain.tsx         # ELI5 explanations
│   │   ├── OccasionMode.tsx      # Occasion-based recommendations
│   │   ├── BudgetMode.tsx        # Budget-based filtering
│   │   ├── FaceAnalyzer.tsx      # Face analysis with TensorFlow
│   │   ├── ImageCapture.tsx      # Camera/upload functionality
│   │   └── ResultsDisplay.tsx    # Results presentation
│   ├── utils/
│   │   ├── colorAnalysis.ts      # Color detection algorithms
│   │   └── recommendationEngine.ts # Recommendation logic
│   └── App.tsx                   # Main application component
├── backend/
│   ├── main.py                   # FastAPI server
│   ├── requirements.txt           # Python dependencies
│   └── README.md                 # Backend documentation
└── supabase/                     # Database schema
```

## 🔧 API Endpoints

### Face Analysis
- `POST /analyze-face` - Analyze face from base64 image
- `POST /upload-image` - Upload and analyze image file
- `POST /generate-recommendations` - Get personalized recommendations

### Health Check
- `GET /health` - API health status

## 🎯 How It Works

### 1. Face Detection & Analysis
- Uses MediaPipe Face Mesh for 468 facial landmarks
- Extracts skin tone from cheek, forehead, and nose regions
- Analyzes undertones using RGB color ratios
- Detects natural lip color from lip landmarks

### 2. Virtual Try-On
- Real-time face mesh detection using webcam
- Canvas overlay for lipstick application
- WebGL rendering for smooth performance
- Accurate lip region mapping

### 3. Recommendation Engine
- Undertone-based color matching
- Occasion-specific styling
- Budget-conscious product suggestions
- Machine learning for personalization

## 🎨 Features in Detail

### Virtual Try-On Technology
- **Face Detection**: MediaPipe Face Mesh with 468 landmarks
- **Lip Mapping**: Precise lip region identification
- **Color Blending**: Real-time canvas rendering with alpha blending
- **Performance**: Optimized for smooth 30fps experience

### AI Analysis
- **Skin Tone Detection**: Fair, Wheatish, Dark classification
- **Undertone Analysis**: Warm, Cool, Neutral identification
- **Color Extraction**: K-means clustering for dominant colors
- **Confidence Scoring**: Reliability metrics for analysis

### Recommendation System
- **Personalized**: Based on individual analysis
- **Contextual**: Occasion and budget aware
- **Comprehensive**: Lipstick, dress, makeup, accessories
- **Real Products**: Actual brand recommendations

## 🔮 Future Enhancements

- [ ] Custom ML model training
- [ ] AR integration for mobile
- [ ] Expanded product database
- [ ] Social sharing features
- [ ] User profiles and history
- [ ] Advanced makeup tutorials
- [ ] Hair color analysis
- [ ] Body type recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- MediaPipe for face detection technology
- TensorFlow for machine learning capabilities
- Tailwind CSS for beautiful UI components
- Supabase for backend services

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

**GlowGenius** - Your AI-powered beauty companion for personalized makeup and fashion recommendations. ✨
