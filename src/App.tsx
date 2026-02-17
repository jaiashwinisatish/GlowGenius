import { useState } from 'react';
import { ImageCapture } from './components/ImageCapture';
import { FaceAnalyzer } from './components/FaceAnalyzer';
import { ResultsDisplay } from './components/ResultsDisplay';
import { VirtualTryOn } from './components/VirtualTryOn';
import { AIExplain } from './components/AIExplain';
import { OccasionMode } from './components/OccasionMode';
import { BudgetMode } from './components/BudgetMode';
import { BeautyAnalysis, Recommendations } from './utils/recommendationEngine';
import { supabase } from './lib/supabase';
import { Sparkles, Webcam, Brain, Calendar, IndianRupee, X } from 'lucide-react';

type AppState = 'capture' | 'analyzing' | 'results' | 'error';
type FeatureMode = 'none' | 'virtual-tryon' | 'ai-explain' | 'occasion' | 'budget';

function App() {
  const [state, setState] = useState<AppState>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<BeautyAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [featureMode, setFeatureMode] = useState<FeatureMode>('none');
  const [selectedLipColor, setSelectedLipColor] = useState<string>('#FF7F50');

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
    setFeatureMode('none');
  };

  const handleVirtualTryOn = () => {
    setFeatureMode('virtual-tryon');
  };

  const handleAIExplain = () => {
    setFeatureMode('ai-explain');
  };

  const handleOccasionMode = () => {
    setFeatureMode('occasion');
  };

  const handleBudgetMode = () => {
    setFeatureMode('budget');
  };

  const handleCloseFeature = () => {
    setFeatureMode('none');
  };

  const handleLipColorSelect = (color: string) => {
    setSelectedLipColor(color);
  };

  const handleRecommendationsUpdate = (newRecommendations: Recommendations) => {
    setRecommendations(newRecommendations);
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
          <>
            <div className="max-w-6xl mx-auto p-6">
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                <button
                  onClick={handleVirtualTryOn}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
                >
                  <Webcam className="w-5 h-5" />
                  Virtual Try-On
                </button>
                <button
                  onClick={handleAIExplain}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                >
                  <Brain className="w-5 h-5" />
                  AI Explain
                </button>
                <button
                  onClick={handleOccasionMode}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  Occasion Mode
                </button>
                <button
                  onClick={handleBudgetMode}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  <IndianRupee className="w-5 h-5" />
                  Budget Mode
                </button>
              </div>
            </div>
            <ResultsDisplay
              analysis={analysis}
              recommendations={recommendations}
              onStartOver={handleStartOver}
            />
          </>
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

      {/* Feature Mode Overlays */}
      {featureMode === 'virtual-tryon' && (
        <VirtualTryOn
          onClose={handleCloseFeature}
          onLipColorSelect={handleLipColorSelect}
        />
      )}
      
      {featureMode === 'ai-explain' && analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">AI Beauty Explainer</h2>
              <button
                onClick={handleCloseFeature}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <AIExplain analysis={analysis} />
            </div>
          </div>
        </div>
      )}
      
      {featureMode === 'occasion' && analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Occasion Mode</h2>
              <button
                onClick={handleCloseFeature}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <OccasionMode
                analysis={analysis}
                onRecommendationsUpdate={handleRecommendationsUpdate}
              />
            </div>
          </div>
        </div>
      )}
      
      {featureMode === 'budget' && analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Budget Mode</h2>
              <button
                onClick={handleCloseFeature}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <BudgetMode
                analysis={analysis}
                onRecommendationsUpdate={handleRecommendationsUpdate}
              />
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>AI-powered beauty analysis for everyone. No fashion or beauty knowledge required.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
