import { useState } from 'react';
import { IndianRupee, DollarSign, Tag } from 'lucide-react';
import { BeautyAnalysis, Recommendations, LipstickRecommendation } from '../utils/recommendationEngine';

type BudgetRange = 'under500' | 'under1000' | 'premium';

interface BudgetModeProps {
  analysis: BeautyAnalysis;
  onRecommendationsUpdate: (recommendations: Recommendations) => void;
}

interface BudgetConfig {
  name: string;
  range: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  brands: string[];
}

const BUDGET_RANGES: Record<BudgetRange, BudgetConfig> = {
  under500: {
    name: 'Under ₹500',
    range: '0-500',
    icon: IndianRupee,
    description: 'Affordable options from budget-friendly brands',
    brands: ['ColorBar', 'Lakme', 'Faces Canada', 'Swiss Beauty', 'Blue Heaven']
  },
  under1000: {
    name: 'Under ₹1000',
    range: '500-1000',
    icon: Tag,
    description: 'Mid-range options with good quality',
    brands: ['Maybelline', 'NYX', 'Loreal', 'Mac', 'Huda Beauty']
  },
  premium: {
    name: 'Premium',
    range: '1000+',
    icon: DollarSign,
    description: 'Luxury options from high-end brands',
    brands: ['Dior', 'Chanel', 'YSL', 'Tom Ford', 'Fenty Beauty']
  }
};

const BRAND_PRODUCTS = {
  'ColorBar': [
    { name: 'ColorBar Kiss Proof Lipstick', hex: '#E74C3C', price: 399 },
    { name: 'ColorBar Matte Touch Lipstick', hex: '#C0392B', price: 450 }
  ],
  'Lakme': [
    { name: 'Lakme Absolute Matte Lipstick', hex: '#E91E63', price: 450 },
    { name: 'Lakme 9 to5 Lip Color', hex: '#AD1457', price: 380 }
  ],
  'Faces Canada': [
    { name: 'Faces Canada Ultime Pro Lipstick', hex: '#D81B60', price: 425 },
    { name: 'Faces Canada Magnet Matte Lipstick', hex: '#880E4F', price: 399 }
  ],
  'Swiss Beauty': [
    { name: 'Swiss Beauty Matte Lipstick', hex: '#C2185B', price: 299 },
    { name: 'Swiss Beauty Velvet Matte Lipstick', hex: '#AD1457', price: 349 }
  ],
  'Blue Heaven': [
    { name: 'Blue Heaven Matte Lipstick', hex: '#E91E63', price: 250 },
    { name: 'Blue Heaven HD Lipstick', hex: '#F06292', price: 275 }
  ],
  'Maybelline': [
    { name: 'Maybelline Superstay Matte Ink', hex: '#C62828', price: 650 },
    { name: 'Maybelline Color Sensational', hex: '#D32F2F', price: 550 }
  ],
  'NYX': [
    { name: 'NYX Soft Matte Lip Cream', hex: '#E91E63', price: 750 },
    { name: 'NYX Liquid Suede Lipstick', hex: '#AD1457', price: 850 }
  ],
  'Loreal': [
    { name: 'Loreal Paris Color Riche', hex: '#C62828', price: 800 },
    { name: 'Loreal Paris Infallible Lipstick', hex: '#D32F2F', price: 900 }
  ],
  'Mac': [
    { name: 'Mac Matte Lipstick', hex: '#B71C1C', price: 950 },
    { name: 'Mac Satin Lipstick', hex: '#E53935', price: 980 }
  ],
  'Huda Beauty': [
    { name: 'Huda Beauty Liquid Matte', hex: '#D32F2F', price: 950 },
    { name: 'Huda Beauty Power Bullet', hex: '#C62828', price: 980 }
  ],
  'Dior': [
    { name: 'Dior Addict Lipstick', hex: '#B71C1C', price: 1200 },
    { name: 'Dior Rouge Lipstick', hex: '#E53935', price: 1500 }
  ],
  'Chanel': [
    { name: 'Chanel Rouge Coco', hex: '#C62828', price: 1400 },
    { name: 'Chanel Rouge Allure', hex: '#D32F2F', price: 1600 }
  ],
  'YSL': [
    { name: 'YSL Rouge Pur Couture', hex: '#E91E63', price: 1300 },
    { name: 'YSL Vernis à Lèvres', hex: '#AD1457', price: 1500 }
  ],
  'Tom Ford': [
    { name: 'Tom Ford Lip Color', hex: '#C2185B', price: 1800 },
    { name: 'Tom Ford Ultra Rich Lipstick', hex: '#880E4F', price: 2000 }
  ],
  'Fenty Beauty': [
    { name: 'Fenty Stunna Lip Paint', hex: '#D81B60', price: 1100 },
    { name: 'Fenty Gloss Bomb', hex: '#F06292', price: 950 }
  ]
};

export function BudgetMode({ analysis: _analysis, onRecommendationsUpdate }: BudgetModeProps) {
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange>('under500');

  const generateBudgetBasedRecommendations = (budget: BudgetRange): Recommendations => {
    const budgetConfig = BUDGET_RANGES[budget];
    
    const getBudgetLipsticks = (): LipstickRecommendation[] => {
      const brands = budgetConfig.brands;
      const lipsticks: LipstickRecommendation[] = [];
      
      brands.forEach(brand => {
        const products = BRAND_PRODUCTS[brand as keyof typeof BRAND_PRODUCTS] || [];
        products.forEach(product => {
          lipsticks.push({
            name: product.name,
            hex: product.hex,
            description: `${brand} - ₹${product.price}`,
            category: budgetConfig.name
          });
        });
      });
      
      return lipsticks.slice(0, 8);
    };

    const getBudgetDressColors = () => {
      const budgetColors = {
        under500: [
          { name: 'Cotton White', hex: '#F8F9FA', reason: 'Affordable and versatile', occasion: 'Casual' },
          { name: 'Denim Blue', hex: '#6495ED', reason: 'Budget-friendly classic', occasion: 'Casual' },
          { name: 'Basic Black', hex: '#2C3E50', reason: 'Timeless and affordable', occasion: 'Office' },
          { name: 'Gray Melange', hex: '#95A5A6', reason: 'Economical neutral', occasion: 'Casual' }
        ],
        under1000: [
          { name: 'Navy Blue', hex: '#000080', reason: 'Premium look within budget', occasion: 'Office' },
          { name: 'Burgundy', hex: '#800020', reason: 'Rich color for mid-range', occasion: 'Evening' },
          { name: 'Forest Green', hex: '#228B22', reason: 'Sophisticated mid-range option', occasion: 'Casual' },
          { name: 'Dusty Rose', hex: '#DCAE96', reason: 'Elegant affordable choice', occasion: 'Party' }
        ],
        premium: [
          { name: 'Royal Purple', hex: '#7851A9', reason: 'Luxury color statement', occasion: 'Formal' },
          { name: 'Emerald Green', hex: '#50C878', reason: 'Premium jewel tone', occasion: 'Evening' },
          { name: 'Champagne Gold', hex: '#F7E7CE', reason: 'Luxurious metallic', occasion: 'Wedding' },
          { name: 'Midnight Blue', hex: '#191970', reason: 'High-end sophisticated', occasion: 'Formal' }
        ]
      };

      return budgetColors[budget] || budgetColors.under500;
    };

    return {
      lipsticks: getBudgetLipsticks(),
      dressColors: getBudgetDressColors(),
      makeupStyles: [
        {
          style: `${budgetConfig.name} Beauty`,
          description: `Makeup looks perfect for ${budgetConfig.name.toLowerCase()} range`,
          tips: [
            `Focus on ${budgetConfig.brands[0]} products`,
            `Choose versatile shades for multiple looks`,
            `Invest in key pieces within your budget`
          ]
        }
      ],
      accessories: [
        {
          type: `${budgetConfig.name} Accessories`,
          colors: ['Gold', 'Silver', 'Rose Gold'],
          description: `Accessories that fit your ${budgetConfig.name.toLowerCase()} budget`
        }
      ]
    };
  };

  const handleBudgetSelect = (budget: BudgetRange) => {
    setSelectedBudget(budget);
    const newRecommendations = generateBudgetBasedRecommendations(budget);
    onRecommendationsUpdate(newRecommendations);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Select Your Budget Range</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(BUDGET_RANGES).map(([key, config]) => {
          const Icon = config.icon;
          const isSelected = selectedBudget === key;
          
          return (
            <button
              key={key}
              onClick={() => handleBudgetSelect(key as BudgetRange)}
              className={`p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${
                isSelected ? 'text-green-500' : 'text-gray-600'
              }`} />
              <h4 className={`font-bold text-lg mb-1 ${
                isSelected ? 'text-green-700' : 'text-gray-800'
              }`}>{config.name}</h4>
              <p className={`text-sm ${
                isSelected ? 'text-green-600' : 'text-gray-600'
              }`}>{config.description}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4">
          Recommended Brands for {BUDGET_RANGES[selectedBudget].name}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {BUDGET_RANGES[selectedBudget].brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-lg px-3 py-2 text-center shadow-sm"
            >
              <p className="text-sm font-medium text-gray-800">{brand}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 Smart Shopping Tip:</span> 
          Look for combo offers and discounts during festive seasons to get the best value for your money!
        </p>
      </div>
    </div>
  );
}
