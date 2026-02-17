import { useState } from 'react';
import { ImageCapture } from './components/ImageCapture';
import { FaceAnalyzer } from './components/FaceAnalyzer';
import { ResultsDisplay } from './components/ResultsDisplay';
import { BeautyAnalysis, Recommendations } from './utils/recommendationEngine';
import { supabase } from './lib/supabase';
import { Sparkles } from 'lucide-react';

type AppState = 'capture' | 'analyzing' | 'results' | 'error';

function App() {
  const [state, setState] = useState<AppState>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<BeautyAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setState('analyzing');
  };

  const handleAnalysisComplete = async (
    analysisResult: BeautyAnalysis,
    recommendationsResult: Recommendations
  ) => {
    setAnalysis(analysisResult);
    setRecommendations(recommendationsResult);

    try {
      await supabase.from('beauty_analyses').insert({
        skin_tone: analysisResult.skinTone,
        undertone: analysisResult.undertone,
        lip_color: analysisResult.lipColor,
        skin_tone_rgb: analysisResult.skinToneRgb,
        recommendations: recommendationsResult,
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
    }

    setState('results');
  };

  const handleAnalysisError = (error: string) => {
    setErrorMessage(error);
    setState('error');
  };

  const handleStartOver = () => {
    setState('capture');
    setCapturedImage('');
    setAnalysis(null);
    setRecommendations(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                AI Beauty Assistant
              </h1>
              <p className="text-sm text-gray-600">Your 24/7 Personal Makeup Artist</p>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 px-4">
        {state === 'capture' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Discover Your Perfect Look
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your photo or use your camera, and let AI analyze your unique features to recommend
                the best lipstick shades, dress colors, makeup styles, and accessories just for you.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <ImageCapture onImageCapture={handleImageCapture} />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Scan Your Face</h3>
                <p className="text-sm text-gray-600">Use your camera or upload a photo</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">Detect skin tone, undertone, and features</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Get Recommendations</h3>
                <p className="text-sm text-gray-600">Personalized beauty suggestions</p>
              </div>
            </div>
          </div>
        )}

        {state === 'analyzing' && (
          <FaceAnalyzer
            imageData={capturedImage}
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
        )}

        {state === 'results' && analysis && recommendations && (
          <ResultsDisplay
            analysis={analysis}
            recommendations={recommendations}
            onStartOver={handleStartOver}
          />
        )}

        {state === 'error' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={handleStartOver}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>AI-powered beauty analysis for everyone. No fashion or beauty knowledge required.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
