import { RGB } from './colorAnalysis';

export interface BeautyAnalysis {
  skinTone: 'fair' | 'wheatish' | 'dark';
  undertone: 'warm' | 'cool' | 'neutral';
  lipColor: RGB;
  eyeColor?: string;
  skinToneRgb: RGB;
}

export interface LipstickRecommendation {
  name: string;
  hex: string;
  description: string;
  category: string;
  brand?: string;
  price?: string;
}

export interface DressColorRecommendation {
  name: string;
  hex: string;
  reason: string;
  occasion: string;
}

export interface MakeupStyleRecommendation {
  style: string;
  description: string;
  tips: string[];
}

export interface AccessoryRecommendation {
  type: string;
  colors: string[];
  description: string;
}

export interface Recommendations {
  lipsticks: LipstickRecommendation[];
  dressColors: DressColorRecommendation[];
  makeupStyles: MakeupStyleRecommendation[];
  accessories: AccessoryRecommendation[];
}

export function generateRecommendations(analysis: BeautyAnalysis): Recommendations {
  return {
    lipsticks: getLipstickRecommendations(analysis),
    dressColors: getDressColorRecommendations(analysis),
    makeupStyles: getMakeupStyleRecommendations(analysis),
    accessories: getAccessoryRecommendations(analysis),
  };
}

function getLipstickRecommendations(analysis: BeautyAnalysis): LipstickRecommendation[] {
  const { undertone } = analysis;
  const recommendations: LipstickRecommendation[] = [];

  if (undertone === 'warm') {
    recommendations.push(
      {
        name: 'Coral Bliss',
        hex: '#FF7F50',
        description: 'Vibrant coral shade perfect for warm undertones',
        category: 'Everyday',
        brand: 'MAC',
        price: '₹1,200',
      },
      {
        name: 'Peach Dream',
        hex: '#FFDAB9',
        description: 'Soft peachy nude that complements your natural warmth',
        category: 'Nude',
        brand: 'Maybelline',
        price: '₹600',
      },
      {
        name: 'Warm Red',
        hex: '#DC143C',
        description: 'Classic red with orange undertones for a bold look',
        category: 'Bold',
        brand: 'Lakmé',
        price: '₹800',
      },
      {
        name: 'Terracotta Rose',
        hex: '#CD5C5C',
        description: 'Earthy rose shade that enhances warm skin tones',
        category: 'Everyday',
        brand: 'Revlon',
        price: '₹900',
      },
      {
        name: 'Golden Bronze',
        hex: '#B87333',
        description: 'Bronzy nude with golden shimmer',
        category: 'Evening',
        brand: 'Sugar',
        price: '₹650',
      }
    );
  } else if (undertone === 'cool') {
    recommendations.push(
      {
        name: 'Berry Crush',
        hex: '#8B008B',
        description: 'Deep berry shade that complements cool undertones',
        category: 'Bold',
      },
      {
        name: 'Pink Mauve',
        hex: '#D8BFD8',
        description: 'Sophisticated mauve pink for everyday elegance',
        category: 'Everyday',
      },
      {
        name: 'Plum Perfect',
        hex: '#8E4585',
        description: 'Rich plum color for a dramatic statement',
        category: 'Evening',
      },
      {
        name: 'Cool Red',
        hex: '#C41E3A',
        description: 'Blue-based red for a classic glamorous look',
        category: 'Bold',
      },
      {
        name: 'Rose Petal',
        hex: '#FFB6C1',
        description: 'Delicate rose pink perfect for cool skin',
        category: 'Nude',
      }
    );
  } else {
    recommendations.push(
      {
        name: 'Versatile Nude',
        hex: '#C9A88E',
        description: 'Universal nude shade that works with neutral undertones',
        category: 'Nude',
      },
      {
        name: 'Mauve Rose',
        hex: '#E0B0C0',
        description: 'Balanced mauve-rose for effortless beauty',
        category: 'Everyday',
      },
      {
        name: 'True Red',
        hex: '#FF0000',
        description: 'Pure red that flatters neutral undertones',
        category: 'Bold',
      },
      {
        name: 'Soft Coral',
        hex: '#FF9999',
        description: 'Gentle coral-pink hybrid shade',
        category: 'Everyday',
      },
      {
        name: 'Berry Nude',
        hex: '#B5838D',
        description: 'Sophisticated berry-toned nude',
        category: 'Evening',
      }
    );
  }

  return recommendations;
}

function getDressColorRecommendations(analysis: BeautyAnalysis): DressColorRecommendation[] {
  const { skinTone, undertone } = analysis;
  const recommendations: DressColorRecommendation[] = [];

  if (skinTone === 'fair') {
    if (undertone === 'warm') {
      recommendations.push(
        { name: 'Olive Green', hex: '#6B8E23', reason: 'Complements warm fair skin beautifully', occasion: 'Casual' },
        { name: 'Burnt Orange', hex: '#CC5500', reason: 'Creates stunning warm contrast', occasion: 'Evening' },
        { name: 'Golden Yellow', hex: '#FFD700', reason: 'Enhances your warm glow', occasion: 'Day' },
        { name: 'Rich Brown', hex: '#8B4513', reason: 'Earthy tone that harmonizes perfectly', occasion: 'Professional' }
      );
    } else if (undertone === 'cool') {
      recommendations.push(
        { name: 'Navy Blue', hex: '#000080', reason: 'Creates elegant contrast with cool fair skin', occasion: 'Professional' },
        { name: 'Emerald Green', hex: '#50C878', reason: 'Jewel tone that makes you glow', occasion: 'Evening' },
        { name: 'Burgundy', hex: '#800020', reason: 'Rich color perfect for cool undertones', occasion: 'Evening' },
        { name: 'Royal Purple', hex: '#7851A9', reason: 'Regal shade that complements your coloring', occasion: 'Formal' }
      );
    } else {
      recommendations.push(
        { name: 'Teal', hex: '#008080', reason: 'Versatile color for neutral undertones', occasion: 'Casual' },
        { name: 'Dusty Rose', hex: '#DCAE96', reason: 'Soft elegant shade', occasion: 'Day' },
        { name: 'Classic Red', hex: '#C41E3A', reason: 'Timeless choice for all occasions', occasion: 'Evening' },
        { name: 'Sage Green', hex: '#9DC183', reason: 'Natural tone that flatters', occasion: 'Casual' }
      );
    }
  } else if (skinTone === 'wheatish') {
    if (undertone === 'warm') {
      recommendations.push(
        { name: 'Mustard Yellow', hex: '#FFDB58', reason: 'Vibrant warm color that enhances your glow', occasion: 'Day' },
        { name: 'Terracotta', hex: '#E2725B', reason: 'Earthy tone perfect for warm wheatish skin', occasion: 'Casual' },
        { name: 'Rust Orange', hex: '#B7410E', reason: 'Rich warm shade that creates depth', occasion: 'Evening' },
        { name: 'Warm Beige', hex: '#D2B48C', reason: 'Elegant neutral with warm notes', occasion: 'Professional' }
      );
    } else if (undertone === 'cool') {
      recommendations.push(
        { name: 'Cobalt Blue', hex: '#0047AB', reason: 'Striking contrast with cool wheatish skin', occasion: 'Evening' },
        { name: 'Magenta', hex: '#FF00FF', reason: 'Bold jewel tone that pops', occasion: 'Party' },
        { name: 'Forest Green', hex: '#228B22', reason: 'Deep green that enhances your complexion', occasion: 'Casual' },
        { name: 'Cool Gray', hex: '#808080', reason: 'Sophisticated modern shade', occasion: 'Professional' }
      );
    } else {
      recommendations.push(
        { name: 'Coral', hex: '#FF7F50', reason: 'Universally flattering warm-cool balance', occasion: 'Day' },
        { name: 'Peacock Blue', hex: '#33A1C9', reason: 'Stunning color for neutral undertones', occasion: 'Evening' },
        { name: 'Olive', hex: '#808000', reason: 'Versatile earthy shade', occasion: 'Casual' },
        { name: 'Mauve', hex: '#E0B0FF', reason: 'Soft sophisticated option', occasion: 'Formal' }
      );
    }
  } else {
    if (undertone === 'warm') {
      recommendations.push(
        { name: 'Bright Orange', hex: '#FF8C00', reason: 'Vibrant warm color that glows on dark skin', occasion: 'Day' },
        { name: 'Golden Yellow', hex: '#FFD700', reason: 'Radiant shade that creates stunning contrast', occasion: 'Party' },
        { name: 'Hot Pink', hex: '#FF69B4', reason: 'Bold vibrant choice for warm dark skin', occasion: 'Evening' },
        { name: 'Copper', hex: '#B87333', reason: 'Metallic warm tone that enhances richness', occasion: 'Formal' }
      );
    } else if (undertone === 'cool') {
      recommendations.push(
        { name: 'Electric Blue', hex: '#7DF9FF', reason: 'Striking contrast with cool dark skin', occasion: 'Evening' },
        { name: 'Fuchsia', hex: '#FF00FF', reason: 'Bold jewel tone that dazzles', occasion: 'Party' },
        { name: 'Emerald', hex: '#50C878', reason: 'Luxurious green that complements beautifully', occasion: 'Formal' },
        { name: 'True White', hex: '#FFFFFF', reason: 'Classic crisp contrast', occasion: 'Day' }
      );
    } else {
      recommendations.push(
        { name: 'Bright Red', hex: '#FF0000', reason: 'Powerful color for neutral dark skin', occasion: 'Evening' },
        { name: 'Turquoise', hex: '#40E0D0', reason: 'Tropical vibrant shade', occasion: 'Casual' },
        { name: 'Royal Blue', hex: '#4169E1', reason: 'Regal shade that enhances depth', occasion: 'Formal' },
        { name: 'Lime Green', hex: '#32CD32', reason: 'Fresh bold choice', occasion: 'Day' }
      );
    }
  }

  return recommendations;
}

function getMakeupStyleRecommendations(analysis: BeautyAnalysis): MakeupStyleRecommendation[] {
  const { skinTone, undertone } = analysis;
  const recommendations: MakeupStyleRecommendation[] = [];

  recommendations.push({
    style: 'Natural Glow',
    description: 'Enhance your natural beauty with minimal, fresh makeup',
    tips: [
      'Use a light, dewy foundation or BB cream',
      undertone === 'warm' ? 'Apply peachy blush on the apples of cheeks' : 'Apply pink blush on the apples of cheeks',
      'Soft brown eyeshadow in the crease',
      'Mascara and a nude lip gloss',
      'Highlight on cheekbones and bridge of nose',
    ],
  });

  recommendations.push({
    style: 'Evening Glamour',
    description: 'Sophisticated and dramatic look for special occasions',
    tips: [
      'Full coverage foundation with matte finish',
      'Contour and highlight to sculpt features',
      undertone === 'warm' ? 'Bronze or copper eyeshadow with eyeliner' : 'Plum or silver eyeshadow with eyeliner',
      'False lashes or volumizing mascara',
      'Bold lip color matching your undertone',
    ],
  });

  recommendations.push({
    style: 'Soft Romantic',
    description: 'Feminine and delicate makeup for a dreamy look',
    tips: [
      'Light foundation with luminous finish',
      undertone === 'warm' ? 'Peach or coral blush' : 'Rose or mauve blush',
      'Soft pink or champagne eyeshadow',
      'Thin eyeliner and curled lashes',
      'MLBB (My Lips But Better) lipstick shade',
    ],
  });

  if (skinTone === 'dark') {
    recommendations.push({
      style: 'Bold & Beautiful',
      description: 'Vibrant colors that pop on deeper skin tones',
      tips: [
        'Rich, full coverage foundation',
        'Bright blush in coral, fuchsia, or orange',
        'Vibrant eyeshadow colors like purple, blue, or gold',
        'Dramatic winged eyeliner',
        'Bright or dark bold lip colors',
      ],
    });
  }

  return recommendations;
}

function getAccessoryRecommendations(analysis: BeautyAnalysis): AccessoryRecommendation[] {
  const { undertone } = analysis;
  const recommendations: AccessoryRecommendation[] = [];

  if (undertone === 'warm') {
    recommendations.push(
      {
        type: 'Jewelry Metals',
        colors: ['Gold', 'Rose Gold', 'Copper', 'Bronze'],
        description: 'Warm metals complement your undertone beautifully',
      },
      {
        type: 'Gemstone Colors',
        colors: ['Amber', 'Topaz', 'Citrine', 'Coral', 'Turquoise'],
        description: 'Warm-toned gemstones that enhance your natural glow',
      },
      {
        type: 'Scarf & Accessory Colors',
        colors: ['Camel', 'Rust', 'Olive', 'Burnt Orange', 'Warm Brown'],
        description: 'Earthy warm tones for accessories',
      }
    );
  } else if (undertone === 'cool') {
    recommendations.push(
      {
        type: 'Jewelry Metals',
        colors: ['Silver', 'White Gold', 'Platinum'],
        description: 'Cool metals that harmonize with your undertone',
      },
      {
        type: 'Gemstone Colors',
        colors: ['Sapphire', 'Emerald', 'Amethyst', 'Diamond', 'Aquamarine'],
        description: 'Cool-toned gemstones that complement your coloring',
      },
      {
        type: 'Scarf & Accessory Colors',
        colors: ['Navy', 'Burgundy', 'Emerald', 'Royal Purple', 'Cool Gray'],
        description: 'Rich cool tones for accessories',
      }
    );
  } else {
    recommendations.push(
      {
        type: 'Jewelry Metals',
        colors: ['Gold', 'Silver', 'Rose Gold', 'Mixed Metals'],
        description: 'All metals work beautifully with neutral undertones',
      },
      {
        type: 'Gemstone Colors',
        colors: ['Ruby', 'Jade', 'Pearl', 'Opal', 'Garnet'],
        description: 'Versatile gemstone options',
      },
      {
        type: 'Scarf & Accessory Colors',
        colors: ['Teal', 'Coral', 'Mauve', 'Jade Green', 'Classic Red'],
        description: 'Balanced colors that work with your neutral undertone',
      }
    );
  }

  return recommendations;
}
