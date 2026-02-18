import { useState, useEffect } from 'react';
import { Star, ShoppingCart, ExternalLink, Filter, IndianRupee } from 'lucide-react';
import { BeautyAnalysis, Recommendations } from '../utils/recommendationEngine';

interface BudgetModeProps {
  analysis: BeautyAnalysis;
  onRecommendationsUpdate: (recommendations: Recommendations) => void;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  hex: string;
  category: string;
  buyLink: string;
  description: string;
}

type BudgetFilter = 'under500' | 'under1000' | 'premium';

export function BudgetModeEnhanced({ analysis, onRecommendationsUpdate }: BudgetModeProps) {
  const [selectedBudget, setSelectedBudget] = useState<BudgetFilter>('under500');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const mockProducts: Product[] = [
    // Under ₹500 products
    {
      id: '1',
      name: 'ColorShow Lipstick',
      brand: 'Lakmé',
      price: 299,
      rating: 4.2,
      image: '/api/placeholder/150/150',
      hex: '#FF7F50',
      category: 'Everyday',
      buyLink: 'https://www.lakmeindia.com/lipstick/colorshow',
      description: 'Vibrant color with smooth finish'
    },
    {
      id: '2',
      name: 'Mega Lasting Lip Color',
      brand: 'Maybelline',
      price: 450,
      rating: 4.5,
      image: '/api/placeholder/150/150',
      hex: '#FF6347',
      category: 'Long-lasting',
      buyLink: 'https://www.maybelline.in/lips/mega-lasting-lip-color',
      description: 'Up to 16 hours of color'
    },
    {
      id: '3',
      name: 'Matte Lipstick',
      brand: 'Sugar',
      price: 499,
      rating: 4.3,
      image: '/api/placeholder/150/150',
      hex: '#CD5C5C',
      category: 'Matte',
      buyLink: 'https://www.sugar-cosmetics.com/lipstick/matte-lipstick',
      description: 'Comfortable matte finish'
    },
    
    // Under ₹1000 products
    {
      id: '4',
      name: 'Retro Matte Lipstick',
      brand: 'MAC',
      price: 850,
      rating: 4.7,
      image: '/api/placeholder/150/150',
      hex: '#DC143C',
      category: 'Matte',
      buyLink: 'https://www.maccosmetics.in/product/retro-matte-lipstick',
      description: 'Retro-inspired matte formula'
    },
    {
      id: '5',
      name: 'Power Plump Lip Balm',
      brand: 'Nykaa',
      price: 650,
      rating: 4.4,
      image: '/api/placeholder/150/150',
      hex: '#FFB6C1',
      category: 'Gloss',
      buyLink: 'https://www.nykaa.com/nykaa-power-plump-lip-balm',
      description: 'Plumping effect with shine'
    },
    {
      id: '6',
      name: 'Velvet Matte Lipstick',
      brand: 'Faces Canada',
      price: 950,
      rating: 4.6,
      image: '/api/placeholder/150/150',
      hex: '#8B008B',
      category: 'Matte',
      buyLink: 'https://www.facescanada.com/velvet-matte-lipstick',
      description: 'Rich velvet texture'
    },
    
    // Premium products
    {
      id: '7',
      name: 'Rouge Pur Couture Lipstick',
      brand: 'Christian Dior',
      price: 3500,
      rating: 4.8,
      image: '/api/placeholder/150/150',
      hex: '#C21E56',
      category: 'Luxury',
      buyLink: 'https://www.dior.com/rouge-pur-couture-lipstick',
      description: 'Couture-inspired luxury'
    },
    {
      id: '8',
      name: 'Le Rouge Absolu',
      brand: 'YSL',
      price: 3200,
      rating: 4.9,
      image: '/api/placeholder/150/150',
      hex: '#E34234',
      category: 'Luxury',
      buyLink: 'https://www.yslbeauty.com/le-rouge-absolu',
      description: 'Absolute red luxury'
    },
    {
      id: '9',
      name: 'Lipstick Queen',
      brand: 'Huda Beauty',
      price: 2800,
      rating: 4.7,
      image: '/api/placeholder/150/150',
      hex: '#FF1493',
      category: 'Luxury',
      buyLink: 'https://www.hudabeauty.com/lipstick-queen',
      description: 'Vibrant pigments'
    }
  ];

  useEffect(() => {
    // Filter products based on budget
    let filteredProducts: Product[] = [];
    
    switch (selectedBudget) {
      case 'under500':
        filteredProducts = mockProducts.filter(p => p.price <= 500);
        break;
      case 'under1000':
        filteredProducts = mockProducts.filter(p => p.price <= 1000);
        break;
      case 'premium':
        filteredProducts = mockProducts.filter(p => p.price > 1000);
        break;
    }
    
    // Sort by rating and price relevance
    filteredProducts.sort((a, b) => {
      const scoreA = a.rating * 10 - (a.price / 100);
      const scoreB = b.rating * 10 - (b.price / 100);
      return scoreB - scoreA;
    });
    
    setProducts(filteredProducts);
    setLoading(false);
  }, [selectedBudget]);

  const handleBudgetChange = (budget: BudgetFilter) => {
    setSelectedBudget(budget);
    setLoading(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const budgetFilters = [
    {
      id: 'under500',
      label: 'Under ₹500',
      description: 'Budget-friendly options',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'under1000',
      label: 'Under ₹1000',
      description: 'Mid-range quality',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'premium',
      label: 'Premium',
      description: 'Luxury experience',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Smart Budget Recommendations
        </h2>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {products.length} products found
          </span>
        </div>
      </div>

      {/* Budget Filter Pills */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {budgetFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleBudgetChange(filter.id as BudgetFilter)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              selectedBudget === filter.id
                ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="font-bold">{filter.label}</div>
              <div className="text-xs opacity-80">{filter.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-600 shadow-lg"
                  style={{ backgroundColor: product.hex }}
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-semibold text-pink-600 dark:text-pink-400">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.brand}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({product.rating})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-lg font-bold text-green-600 dark:text-green-400">
                      <IndianRupee className="w-4 h-4" />
                      {product.price}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(product.buyLink, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                  </button>
                  
                  <button
                    onClick={() => window.open(product.buyLink, '_blank')}
                    className="p-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Products Message */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No products found in this budget range.
          </div>
          <button
            onClick={() => handleBudgetChange('under500')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            View Budget Options
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Smart Shopping Tips
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Products are sorted by rating and price relevance for best value
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {products.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Products Found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
