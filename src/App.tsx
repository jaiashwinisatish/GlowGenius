import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ImageCapture } from './components/ImageCapture';
import { FaceAnalyzer } from './components/FaceAnalyzerSimple';
import { ResultsDisplayEnhanced } from './components/ResultsDisplayEnhanced';
import { VirtualTryOn } from './components/VirtualTryOnWorking';
import { AIExplainEnhanced } from './components/AIExplainEnhanced';
import { OccasionMode } from './components/OccasionMode';
import { BudgetModeEnhanced } from './components/BudgetModeEnhanced';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { HeroSection } from './components/HeroSection';
import { GlowScore } from './components/GlowScore';
import { BeautyAnalysis, Recommendations } from './utils/recommendationEngine';
import { supabase } from './lib/supabase';
import { Sparkles, Webcam, Brain, Calendar, IndianRupee, X } from 'lucide-react';

type AppState = 'capture' | 'analyzing' | 'results' | 'error';
type FeatureMode = 'none' | 'virtual-tryon' | 'ai-explain' | 'occasion' | 'budget';

function AppContent() {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysis, setAnalysis] = useState<BeautyAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [featureMode, setFeatureMode] = useState<FeatureMode>('none');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleShowAuthModal = () => setShowAuthModal(true);
    window.addEventListener('showAuthModal', handleShowAuthModal);
    return () => window.removeEventListener('showAuthModal', handleShowAuthModal);
  }, []);

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

  const handleRecommendationsUpdate = (newRecommendations: Recommendations) => {
    setRecommendations(newRecommendations);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="py-8">
        {state === 'capture' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                AI Beauty Analysis
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Upload a photo to discover your perfect beauty recommendations
              </p>
            </div>
            
            {!user && (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Sign in to save your analysis history and get personalized recommendations
                </p>
              </div>
            )}
            
            <ImageCapture onImageCapture={handleImageCapture} />
          </div>
        )}

        {state === 'analyzing' && capturedImage && (
          <FaceAnalyzer
            imageData={capturedImage}
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
        )}

        {state === 'results' && analysis && recommendations && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Beauty Analysis
              </h2>
            </div>
            
            <ResultsDisplayEnhanced
              analysis={analysis}
              recommendations={recommendations}
              onStartOver={handleStartOver}
              onVirtualTryOn={handleVirtualTryOn}
              onAIExplain={handleAIExplain}
              onOccasionMode={handleOccasionMode}
              onBudgetMode={handleBudgetMode}
            />
          </div>
        )}

        {state === 'error' && (
          <div className="text-center space-y-4">
            <div className="text-red-500 text-xl font-semibold">
              Oops! Something went wrong.
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {errorMessage}
            </p>
            <button
              onClick={handleStartOver}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Feature Mode Overlays */}
      {featureMode === 'virtual-tryon' && (
        <VirtualTryOn
          onClose={handleCloseFeature}
        />
      )}
      
      {featureMode === 'ai-explain' && analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Beauty Explainer</h2>
              <button
                onClick={handleCloseFeature}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <AIExplainEnhanced analysis={analysis} />
            </div>
          </div>
        </div>
      )}
      
      {featureMode === 'occasion' && analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Occasion Mode</h2>
              <button
                onClick={handleCloseFeature}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Budget Mode</h2>
              <button
                onClick={handleCloseFeature}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <BudgetModeEnhanced
                analysis={analysis}
                onRecommendationsUpdate={handleRecommendationsUpdate}
              />
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <footer className="bg-white dark:bg-gray-800 mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>AI-powered beauty analysis for everyone. No fashion or beauty knowledge required.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
