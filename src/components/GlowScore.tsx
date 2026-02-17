import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface GlowScoreProps {
  score: number;
  confidence: number;
  factors: {
    name: string;
    status: 'excellent' | 'good' | 'needs-improvement';
    description: string;
  }[];
}

export function GlowScore({ score, confidence, factors }: GlowScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '✨';
    if (score >= 60) return '💫';
    return '🌟';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'needs-improvement':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
        
        <div className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-4"
            >
              {getScoreEmoji(score)}
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Glow Score
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {score}%
              </span>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Confidence: {confidence}% match
            </p>
          </div>

          {/* Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Analysis Factors
            </h3>
            
            {factors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(factor.status)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {factor.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {factor.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {score >= 80 
                ? "Excellent! Your skin is glowing with natural beauty." 
                : score >= 60 
                ? "Good! With the right products, you can enhance your natural glow."
                : "Let's work together to bring out your best glow!"
              }
            </p>
            
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              View Recommendations
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
