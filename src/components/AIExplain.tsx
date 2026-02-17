import { Brain, Sparkles, Lightbulb } from 'lucide-react';
import { BeautyAnalysis } from '../utils/recommendationEngine';

interface AIExplainProps {
  analysis: BeautyAnalysis;
}

export function AIExplain({ analysis }: AIExplainProps) {
  const generateExplanation = () => {
    const { skinTone, undertone } = analysis;
    
    const explanations = {
      warm: {
        fair: {
          simple: "Your skin has warm golden undertones like sunshine! 🌞 Coral and peach shades will make you glow naturally.",
          detailed: "Your fair skin with warm undertones has yellow/golden hints. Warm colors like coral, peach, and golden browns complement your natural warmth, while cool colors might look harsh.",
          tips: [
            "Think sunset colors - corals, peaches, warm pinks",
            "Gold jewelry looks amazing on you",
            "Avoid icy blues and purples that can wash you out"
          ]
        },
        wheatish: {
          simple: "Your beautiful warm skin glows like honey! 🍯 Earthy tones and warm colors will enhance your natural radiance.",
          detailed: "Your wheatish skin with warm undertones has rich golden-peachy notes. You can pull off both vibrant warm colors and deeper earthy shades beautifully.",
          tips: [
            "Terracotta, rust, and olive green are your best friends",
            "Bronze and copper jewelry enhances your warmth",
            "Mustard yellow and warm reds look stunning"
          ]
        },
        dark: {
          simple: "Your rich warm skin has beautiful golden undertones! ✨ Bright warm colors will make you shine brilliantly.",
          detailed: "Your dark skin with warm undertones has deep golden or reddish notes. You can rock vibrant warm colors that might overwhelm others, creating stunning contrast.",
          tips: [
            "Go bold with bright oranges, hot pinks, and golden yellows",
            "Copper and bronze metals pop against your skin",
            "Don't shy away from rich, saturated warm colors"
          ]
        }
      },
      cool: {
        fair: {
          simple: "Your skin has cool rosy undertones like fresh flowers! 🌸 Berry and pink shades will look gorgeous on you.",
          detailed: "Your fair skin with cool undertones has pink or bluish hints. Cool colors like berry, mauve, and jewel tones enhance your natural freshness.",
          tips: [
            "Think jewel tones - sapphire blue, emerald green, amethyst",
            "Silver and white gold jewelry complement you perfectly",
            "Cool pinks and berries are your go-to lip colors"
          ]
        },
        wheatish: {
          simple: "Your skin has elegant cool undertones like moonlight! 🌙 Jewel tones and cool colors will enhance your beauty.",
          detailed: "Your wheatish skin with cool undertones has pink or blue notes. You can wear both soft cool colors and rich jewel tones beautifully.",
          tips: [
            "Cobalt blue, magenta, and forest green are stunning",
            "Silver jewelry highlights your cool elegance",
            "Cool grays and navy blues look sophisticated"
          ]
        },
        dark: {
          simple: "Your gorgeous cool skin has rich blue-red undertones! 💎 Bold jewel colors will make you dazzle.",
          detailed: "Your dark skin with cool undertones has deep blue or reddish notes. Vibrant jewel tones create striking contrast and make your skin appear luminous.",
          tips: [
            "Electric blues, fuchsias, and emeralds are your power colors",
            "Platinum and silver metals create gorgeous contrast",
            "True white and icy pastels look fresh and modern"
          ]
        }
      },
      neutral: {
        fair: {
          simple: "Your skin has perfectly balanced undertones! 🎨 You can wear almost any color beautifully.",
          detailed: "Your fair skin has neutral undertones, meaning it has equal warm and cool notes. This gives you amazing versatility with colors.",
          tips: [
            "You can wear both warm and cool shades",
            "Mixed metals (gold and silver) look great",
            "Most colors will complement your skin tone"
          ]
        },
        wheatish: {
          simple: "Your skin has wonderfully balanced undertones! 🌈 You have the freedom to experiment with many colors.",
          detailed: "Your wheatish skin has neutral undertones, giving you the best of both worlds. You can pull off both warm and cool colors effectively.",
          tips: [
            "Experiment with both warm and cool palettes",
            "All jewelry metals work well with your skin",
            "Teal, coral, and mauve are particularly flattering"
          ]
        },
        dark: {
          simple: "Your skin has beautiful balanced undertones! ✨ You can rock both warm and cool colors with confidence.",
          detailed: "Your dark skin has neutral undertones, making it incredibly versatile. You can wear the full spectrum of colors beautifully.",
          tips: [
            "Don't be afraid to try any color that catches your eye",
            "Both gold and silver jewelry complement you",
            "Bright reds, turquoises, and purples all look amazing"
          ]
        }
      }
    };

    return explanations[undertone][skinTone];
  };

  const explanation = generateExplanation();

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">AI Beauty Explainer</h3>
          <p className="text-sm text-gray-600">Understanding your unique beauty profile</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Simple Explanation</h4>
              <p className="text-gray-700 leading-relaxed">{explanation.simple}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Detailed Analysis</h4>
              <p className="text-gray-700 leading-relaxed">{explanation.detailed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Quick Tips 💡</h4>
          <div className="space-y-3">
            {explanation.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold">Remember:</span> These are guidelines, not rules! 
            The most important thing is to wear what makes you feel confident and beautiful. 
            Your personal preference always comes first! 💕
          </p>
        </div>
      </div>
    </div>
  );
}
