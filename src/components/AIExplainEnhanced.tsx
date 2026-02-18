import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { BeautyAnalysis } from '../utils/recommendationEngine';

interface AIExplainProps {
  analysis: BeautyAnalysis;
}

export function AIExplainEnhanced({ analysis }: AIExplainProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [speechRate, setSpeechRate] = useState(1);

  const generateExplanation = () => {
    const explanations = {
      en: {
        warm: {
          title: "Your Warm Beauty Profile ✨",
          content: `You have beautiful warm undertones with ${analysis.skinTone} skin! This means you look amazing in earthy, golden, and peachy shades. Your natural warmth gives you a gorgeous glow that's perfect for coral lipsticks, bronze accessories, and warm-toned makeup. Think sunset colors, golden highlights, and peachy blushes to enhance your natural radiance!`,
          tips: [
            "Best lipstick shades: Coral, peach, terracotta, warm reds",
            "Perfect dress colors: Ivory, peach, olive, warm browns",
            "Ideal accessories: Gold, bronze, copper tones"
          ]
        },
        cool: {
          title: "Your Cool Beauty Profile ❄️",
          content: `You have stunning cool undertones with ${analysis.skinTone} skin! Blue-based colors are your best friends - think berry lipsticks, silver jewelry, and cool-toned makeup. Your natural coolness creates a beautiful, elegant look that's perfect for rose, pink, and blue-based shades. You'll look incredible in jewel tones and cool pastels!`,
          tips: [
            "Best lipstick shades: Berry, cool pinks, blue-reds, plum",
            "Perfect dress colors: Navy, royal blue, cool grays, white",
            "Ideal accessories: Silver, platinum, cool metals"
          ]
        },
        neutral: {
          title: "Your Versatile Beauty Profile 🌟",
          content: `You have perfectly balanced neutral undertones with ${analysis.skinTone} skin! This is amazing because you can wear both warm and cool shades beautifully. You have the flexibility to experiment with almost any color palette. From soft nudes to bold berries, most colors will complement your natural beauty perfectly!`,
          tips: [
            "Best lipstick shades: Nude pinks, mauve, soft corals, berry",
            "Perfect dress colors: Most colors work! Try navy, burgundy, olive",
            "Ideal accessories: Both gold and silver work beautifully"
          ]
        }
      },
      hi: {
        warm: {
          title: "आपकी गरम ब्यूटी प्रोफाइल ✨",
          content: `आपके ${analysis.skinTone} स्किन टोन के साथ सुंदर गर्म अंडरटोन हैं! इसका मतलब है कि आप धरती, सुनहरी, और पीच रंगों में बहुत अच्छे लगते हैं। कोरल लिपस्टिक, ब्रॉन्ज एक्सेसरीज, और गर्म-टोन मेकअप आपकी प्राकृतिक चमक को बढ़ाएंगे!`,
          tips: [
            "सर्वोत्तम लिपस्टिक शेड्स: कोरल, पीच, टेराकोटा, गर्म लाल",
            "उपयुक्त ड्रेस रंग: आइवरी, पीच, ओलिव, गर्म भूरे",
            "आदर्श एक्सेसरीज: सोना, कांस्या, कॉपर टोन"
          ]
        },
        cool: {
          title: "आपकी ठंडी ब्यूटी प्रोफाइल ❄️",
          content: `आपके ${analysis.skinTone} स्किन टोन के साथ शानदार ठंडी अंडरटोन हैं! ब्लू-आधारित रंग आपके सबसे अच्छे दोस्त हैं - बेरी लिपस्टिक, चांदी ज्वेलरी, और ठंडी-टोन मेकअप सोचें। ज्वेल टोन और ठंडी पेस्टल आपको एक खूबसूरत लुक देंगे!`,
          tips: [
            "सर्वोत्तम लिपस्टिक शेड्स: बेरी, ठंडी गुलाबी, ब्लू-लाल, प्लम",
            "उपयुक्त ड्रेस रंग: नेवी, रॉयल ब्लू, ठंडी ग्रे, सफेद",
            "आदर्श एक्सेसरीज: चांदी, प्लैटिनम, ठंडी धातु"
          ]
        },
        neutral: {
          title: "आपकी बहुमुखी ब्यूटी प्रोफाइल 🌟",
          content: `आपके ${analysis.skinTone} स्किन टोन के साथ बिल्कुल संतुलित तटस्व अंडरटोन हैं! यह शानदार है क्योंकि आप गर्म और ठंडी दोनों रंगों को सुंदर ढंग से पहन सकते हैं। आपके पास लगभग किसी भी रंग पैलेट के साथ प्रयोग करने की लची है!`,
          tips: [
            "सर्वोत्तम लिपस्टिक शेड्स: न्यूड गुलाबी, मौव, सॉफ्ट कोरल, बेरी",
            "उपयुक्त ड्रेस रंग: ज्यादातर रंग काम करते हैं! नेवी, बर्गंडी, ओलिव ट्राई करें",
            "आदर्श एक्सेसरीज: सोना और चांदी दोनों सुंदर काम करते हैं"
          ]
        }
      }
    };

    return explanations[selectedLanguage][analysis.undertone] || explanations.en.neutral;
  };

  const speakExplanation = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const explanation = generateExplanation();
      const text = `${explanation.title}. ${explanation.content}. ${explanation.tips.join('. ')}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = speechRate;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        console.error('Speech synthesis error');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const explanation = generateExplanation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Beauty Explainer
        </h2>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'hi')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>

          {/* Speech Rate Control */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Speed:</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {explanation.title}
        </h3>
        
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
          {explanation.content}
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            {selectedLanguage === 'hi' ? 'विशेष टिप्स:' : 'Quick Tips:'}
          </h4>
          {explanation.tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={isSpeaking ? stopSpeaking : speakExplanation}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            isSpeaking
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5" />
              Stop Listening
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              {selectedLanguage === 'hi' ? 'सुनें व्याख्या' : 'Listen to Explanation'}
            </>
          )}
        </button>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Pause className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {selectedLanguage === 'hi' 
          ? 'ध्यान दें: वॉइस सपोर्ट केवल ब्राउज़र पर उपलब्ध हो सकता है।'
          : 'Note: Voice support may vary by browser.'
        }
      </div>
    </div>
  );
}
