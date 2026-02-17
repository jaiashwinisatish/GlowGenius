import { RefreshCw, Sparkles } from 'lucide-react';
import { BeautyAnalysis, Recommendations } from '../utils/recommendationEngine';

interface ResultsDisplayProps {
  analysis: BeautyAnalysis;
  recommendations: Recommendations;
  onStartOver: () => void;
}

export function ResultsDisplay({ analysis, recommendations, onStartOver }: ResultsDisplayProps) {
  const getSkinToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      fair: 'Fair',
      wheatish: 'Wheatish',
      dark: 'Dark',
    };
    return labels[tone] || tone;
  };

  const getUndertoneLabel = (undertone: string) => {
    const labels: Record<string, string> = {
      warm: 'Warm',
      cool: 'Cool',
      neutral: 'Neutral',
    };
    return labels[undertone] || undertone;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-pink-500" />
            Your Beauty Profile
          </h2>
          <button
            onClick={onStartOver}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Skin Tone</h3>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full shadow-lg"
                style={{
                  backgroundColor: `rgb(${analysis.skinToneRgb.r}, ${analysis.skinToneRgb.g}, ${analysis.skinToneRgb.b})`,
                }}
              />
              <p className="text-2xl font-bold text-gray-800">{getSkinToneLabel(analysis.skinTone)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Undertone</h3>
            <p className="text-2xl font-bold text-gray-800">{getUndertoneLabel(analysis.undertone)}</p>
            <p className="text-sm text-gray-600 mt-2">
              {analysis.undertone === 'warm' && 'Yellow/peachy/golden hues'}
              {analysis.undertone === 'cool' && 'Pink/red/blue hues'}
              {analysis.undertone === 'neutral' && 'Balanced warm-cool mix'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Natural Lip Color</h3>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full shadow-lg"
                style={{
                  backgroundColor: `rgb(${analysis.lipColor.r}, ${analysis.lipColor.g}, ${analysis.lipColor.b})`,
                }}
              />
              <p className="text-sm text-gray-700">
                RGB({analysis.lipColor.r}, {analysis.lipColor.g}, {analysis.lipColor.b})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lipstick Shades for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.lipsticks.map((lipstick, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-16 h-16 rounded-full shadow-md"
                  style={{ backgroundColor: lipstick.hex }}
                />
                <div>
                  <h3 className="font-bold text-gray-800">{lipstick.name}</h3>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    {lipstick.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{lipstick.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Perfect Dress Colors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.dressColors.map((dress, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              <div
                className="w-20 h-20 rounded-lg shadow-md flex-shrink-0"
                style={{ backgroundColor: dress.hex }}
              />
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{dress.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{dress.reason}</p>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {dress.occasion}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Makeup Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.makeupStyles.map((style, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{style.style}</h3>
              <p className="text-sm text-gray-600 mb-4">{style.description}</p>
              <div className="space-y-2">
                {style.tips.map((tip, tipIndex) => (
                  <div key={tipIndex} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Accessories & Jewelry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.accessories.map((accessory, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">{accessory.type}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {accessory.colors.map((color, colorIndex) => (
                  <span
                    key={colorIndex}
                    className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">{accessory.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
