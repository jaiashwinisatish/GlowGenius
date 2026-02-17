import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Palette, 
  ShoppingBag, 
  Download,
  Share2,
  Heart,
  Star
} from 'lucide-react';
import { BeautyAnalysis, Recommendations } from '../utils/recommendationEngine';

interface ResultsDisplayProps {
  analysis: BeautyAnalysis;
  recommendations: Recommendations;
  onStartOver: () => void;
  onVirtualTryOn: () => void;
  onAIExplain: () => void;
  onOccasionMode: () => void;
  onBudgetMode: () => void;
}

export function ResultsDisplayEnhanced({
  analysis,
  recommendations,
  onStartOver,
  onVirtualTryOn,
  onAIExplain,
  onOccasionMode,
  onBudgetMode,
}: ResultsDisplayProps) {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'lipsticks' | 'dresses' | 'makeup' | 'accessories'>('overview');

  const handleSave = () => {
    setSaved(!saved);
    // Save to user profile logic here
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My GlowGenius Analysis',
        text: `My skin tone is ${analysis.skinTone} with ${analysis.undertone} undertones!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    // Download analysis as PDF/image
    console.log('Downloading analysis...');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'lipsticks', label: 'Lipsticks', icon: Palette },
    { id: 'dresses', label: 'Dresses', icon: ShoppingBag },
    { id: 'makeup', label: 'Makeup', icon: Star },
    { id: 'accessories', label: 'Accessories', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Your Beauty Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Personalized recommendations based on your unique features
          </p>
        </motion.div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Skin Analysis Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skin Analysis</h2>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Skin Tone</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {analysis.skinTone}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Undertone</span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full capitalize">
                      {analysis.undertone}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {analysis.undertone === 'warm' 
                      ? 'Warm undertones look best with earthy, golden shades'
                      : analysis.undertone === 'cool'
                      ? 'Cool undertones pair beautifully with blue-based colors'
                      : 'Neutral undertones can wear both warm and cool shades'
                    }
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Glow Score</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">85%</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Excellent skin health and radiance
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommendations Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h3>
                        <div className="space-y-2">
                          <button
                            onClick={onVirtualTryOn}
                            className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
                          >
                            Virtual Try-On
                          </button>
                          <button
                            onClick={onAIExplain}
                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all"
                          >
                            AI Explain
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Advanced Modes</h3>
                        <div className="space-y-2">
                          <button
                            onClick={onOccasionMode}
                            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition-all"
                          >
                            Occasion Mode
                          </button>
                          <button
                            onClick={onBudgetMode}
                            className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
                          >
                            Budget Mode
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'lipsticks' && (
                    <motion.div
                      key="lipsticks"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {recommendations.lipsticks.map((lipstick, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                            <div
                              className="w-full h-16 rounded-lg mb-3 group-hover:scale-105 transition-transform"
                              style={{ backgroundColor: lipstick.hex }}
                            />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {lipstick.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {lipstick.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-pink-500">
                                {lipstick.brand || 'Premium'}
                              </span>
                              <button className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors">
                                <Heart className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'dresses' && (
                    <motion.div
                      key="dresses"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {recommendations.dressColors.map((dress, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all">
                            <div
                              className="w-full h-16 rounded-lg mb-3 group-hover:scale-105 transition-transform"
                              style={{ backgroundColor: dress.hex }}
                            />
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {dress.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {dress.reason}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'makeup' && (
                    <motion.div
                      key="makeup"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {recommendations.makeupStyles.map((style, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {style.style}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {style.description}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'accessories' && (
                    <motion.div
                      key="accessories"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {recommendations.accessories.map((accessory, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {accessory.type}
                            </h4>
                            <div className="flex gap-2">
                              {accessory.colors.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {accessory.description}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  saved
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                {saved ? 'Saved' : 'Save Look'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            
            <button
              onClick={onStartOver}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg"
            >
              New Analysis
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
