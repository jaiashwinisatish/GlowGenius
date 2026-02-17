import { useState } from 'react';
import { Calendar, Briefcase, Music, Coffee } from 'lucide-react';
import { BeautyAnalysis, Recommendations } from '../utils/recommendationEngine';

type Occasion = 'wedding' | 'office' | 'party' | 'casual';

interface OccasionModeProps {
  analysis: BeautyAnalysis;
  onRecommendationsUpdate: (recommendations: Recommendations) => void;
}

interface OccasionConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  keywords: string[];
}

const OCCASIONS: Record<Occasion, OccasionConfig> = {
  wedding: {
    name: 'Wedding',
    icon: Calendar,
    description: 'Elegant and romantic looks for special celebrations',
    keywords: ['elegant', 'romantic', 'sophisticated', 'timeless']
  },
  office: {
    name: 'Office',
    icon: Briefcase,
    description: 'Professional and polished looks for the workplace',
    keywords: ['professional', 'subtle', 'polished', 'sophisticated']
  },
  party: {
    name: 'Party',
    icon: Music,
    description: 'Bold and glamorous looks to stand out',
    keywords: ['bold', 'glamorous', 'dramatic', 'eye-catching']
  },
  casual: {
    name: 'Casual',
    icon: Coffee,
    description: 'Relaxed and natural looks for everyday wear',
    keywords: ['natural', 'subtle', 'fresh', 'effortless']
  }
};

export function OccasionMode({ analysis, onRecommendationsUpdate }: OccasionModeProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('casual');

  const generateOccasionBasedRecommendations = (occasion: Occasion): Recommendations => {
    const { undertone } = analysis;
    
    const getOccasionLipsticks = () => {
      const baseColors = {
        warm: {
          wedding: [
            { name: 'Bridal Rose', hex: '#E8B4B8', description: 'Soft romantic rose perfect for weddings', category: 'Bridal' },
            { name: 'Champagne Kiss', hex: '#F7E7CE', description: 'Elegant champagne nude', category: 'Bridal' },
            { name: 'Warm Berry', hex: '#C1666B', description: 'Sophisticated berry with warm undertones', category: 'Evening' }
          ],
          office: [
            { name: 'Warm Nude', hex: '#D2A679', description: 'Professional nude with warm undertones', category: 'Office' },
            { name: 'Soft Peach', hex: '#FFCBA4', description: 'Subtle peach for everyday office wear', category: 'Office' },
            { name: 'Muted Rose', hex: '#C19A6B', description: 'Understated rose brown', category: 'Professional' }
          ],
          party: [
            { name: 'Fiery Coral', hex: '#FF6347', description: 'Bold coral that demands attention', category: 'Party' },
            { name: 'Sunset Red', hex: '#E34234', description: 'Vibrant red-orange', category: 'Bold' },
            { name: 'Golden Bronze', hex: '#B87333', description: 'Metallic bronze with shimmer', category: 'Evening' }
          ],
          casual: [
            { name: 'Everyday Peach', hex: '#FFDAB9', description: 'Natural peach for daily wear', category: 'Everyday' },
            { name: 'Soft Coral', hex: '#F08080', description: 'Gentle coral pink', category: 'Casual' },
            { name: 'Warm Pink', hex: '#FFB6C1', description: 'Natural warm pink', category: 'Natural' }
          ]
        },
        cool: {
          wedding: [
            { name: 'Cool Rose', hex: '#D8BFD8', description: 'Elegant cool-toned rose', category: 'Bridal' },
            { name: 'Mauve Dreams', hex: '#E0B0FF', description: 'Soft mauve for romantic looks', category: 'Bridal' },
            { name: 'Berry Wine', hex: '#722F37', description: 'Deep wine with cool undertones', category: 'Evening' }
          ],
          office: [
            { name: 'Cool Nude', hex: '#C8B8DB', description: 'Professional cool-toned nude', category: 'Office' },
            { name: 'Soft Mauve', hex: '#E0B0C0', description: 'Subtle mauve for office wear', category: 'Professional' },
            { name: 'Dusty Rose', hex: '#DCAE96', description: 'Muted rose brown', category: 'Office' }
          ],
          party: [
            { name: 'Electric Berry', hex: '#8B008B', description: 'Vibrant berry that pops', category: 'Party' },
            { name: 'Cool Red', hex: '#C41E3A', description: 'Blue-based red for dramatic effect', category: 'Bold' },
            { name: 'Plum Glam', hex: '#8E4585', description: 'Rich plum with cool undertones', category: 'Evening' }
          ],
          casual: [
            { name: 'Berry Nude', hex: '#B5838D', description: 'Natural berry-toned nude', category: 'Everyday' },
            { name: 'Soft Pink', hex: '#FFB6C1', description: 'Gentle cool pink', category: 'Natural' },
            { name: 'Rose Petal', hex: '#FFE4E1', description: 'Delicate rose pink', category: 'Casual' }
          ]
        },
        neutral: {
          wedding: [
            { name: 'Classic Nude', hex: '#C9A88E', description: 'Timeless nude for bridal elegance', category: 'Bridal' },
            { name: 'Soft Mauve', hex: '#E0B0C0', description: 'Balanced mauve-rose', category: 'Bridal' },
            { name: 'True Rose', hex: '#C21E56', description: 'Classic rose pink', category: 'Evening' }
          ],
          office: [
            { name: 'Versatile Nude', hex: '#C9A88E', description: 'Universal nude for office wear', category: 'Office' },
            { name: 'Muted Brown', hex: '#967117', description: 'Professional brown nude', category: 'Professional' },
            { name: 'Soft Pink', hex: '#FFB6C1', description: 'Understated pink', category: 'Office' }
          ],
          party: [
            { name: 'True Red', hex: '#FF0000', description: 'Classic red that always works', category: 'Party' },
            { name: 'Fuchsia Glam', hex: '#FF00FF', description: 'Bold fuchsia for party nights', category: 'Bold' },
            { name: 'Berry Bold', hex: '#8B008B', description: 'Rich berry that stands out', category: 'Evening' }
          ],
          casual: [
            { name: 'MLBB Nude', hex: '#C9A88E', description: 'My Lips But Better nude', category: 'Everyday' },
            { name: 'Soft Coral', hex: '#FF9999', description: 'Gentle coral-pink', category: 'Natural' },
            { name: 'Natural Pink', hex: '#FFB6C1', description: 'Everyday pink', category: 'Casual' }
          ]
        }
      };

      return baseColors[undertone][occasion] || baseColors.neutral.casual;
    };

    const getOccasionDressColors = () => {
      const occasionColors = {
        wedding: [
          { name: 'Ivory White', hex: '#FFFFF0', reason: 'Classic bridal elegance', occasion: 'Wedding' },
          { name: 'Soft Pink', hex: '#FFB6C1', reason: 'Romantic and feminine', occasion: 'Wedding' },
          { name: 'Champagne', hex: '#F7E7CE', reason: 'Elegant and sophisticated', occasion: 'Wedding' },
          { name: 'Rose Gold', hex: '#B76E79', reason: 'Modern romantic touch', occasion: 'Wedding' }
        ],
        office: [
          { name: 'Navy Blue', hex: '#000080', reason: 'Professional and authoritative', occasion: 'Office' },
          { name: 'Charcoal Gray', hex: '#36454F', reason: 'Sophisticated neutral', occasion: 'Office' },
          { name: 'White', hex: '#FFFFFF', reason: 'Clean and professional', occasion: 'Office' },
          { name: 'Beige', hex: '#F5F5DC', reason: 'Understated elegance', occasion: 'Office' }
        ],
        party: [
          { name: 'Emerald Green', hex: '#50C878', reason: 'Eye-catching jewel tone', occasion: 'Party' },
          { name: 'Royal Blue', hex: '#4169E1', reason: 'Regal and attention-grabbing', occasion: 'Party' },
          { name: 'Hot Pink', hex: '#FF69B4', reason: 'Bold and fun', occasion: 'Party' },
          { name: 'Gold', hex: '#FFD700', reason: 'Glamorous and festive', occasion: 'Party' }
        ],
        casual: [
          { name: 'Denim Blue', hex: '#6495ED', reason: 'Casual and versatile', occasion: 'Casual' },
          { name: 'Olive Green', hex: '#808000', reason: 'Relaxed earthy tone', occasion: 'Casual' },
          { name: 'Terracotta', hex: '#E2725B', reason: 'Warm and inviting', occasion: 'Casual' },
          { name: 'Mint Green', hex: '#98FF98', reason: 'Fresh and light', occasion: 'Casual' }
        ]
      };

      return occasionColors[occasion] || occasionColors.casual;
    };

    return {
      lipsticks: getOccasionLipsticks(),
      dressColors: getOccasionDressColors(),
      makeupStyles: [
        {
          style: `${OCCASIONS[occasion].name} Ready`,
          description: `Perfect makeup for ${OCCASIONS[occasion].name.toLowerCase()} occasions`,
          tips: [
            `Focus on ${OCCASIONS[occasion].keywords[0]} application`,
            `Choose ${OCCASIONS[occasion].keywords[1]} color palette`,
            `Keep it ${OCCASIONS[occasion].keywords[2]} and ${OCCASIONS[occasion].keywords[3]}`
          ]
        }
      ],
      accessories: [
        {
          type: `${OCCASIONS[occasion].name} Accessories`,
          colors: ['Gold', 'Silver', 'Rose Gold'],
          description: `Perfect accessories for ${OCCASIONS[occasion].name.toLowerCase()} events`
        }
      ]
    };
  };

  const handleOccasionSelect = (occasion: Occasion) => {
    setSelectedOccasion(occasion);
    const newRecommendations = generateOccasionBasedRecommendations(occasion);
    onRecommendationsUpdate(newRecommendations);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Occasion</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(OCCASIONS).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = selectedOccasion === key;
          
          return (
            <button
              key={key}
              onClick={() => handleOccasionSelect(key as Occasion)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${
                isSelected ? 'text-pink-500' : 'text-gray-600'
              }`} />
              <h4 className={`font-semibold text-sm ${
                isSelected ? 'text-pink-700' : 'text-gray-800'
              }`}>{config.name}</h4>
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            {(() => {
              const Icon = OCCASIONS[selectedOccasion].icon;
              return <Icon className="w-5 h-5 text-pink-500" />;
            })()}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              {OCCASIONS[selectedOccasion].name} Mode
            </h4>
            <p className="text-gray-700 text-sm mb-3">
              {OCCASIONS[selectedOccasion].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS[selectedOccasion].keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-xs font-medium text-pink-600"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
