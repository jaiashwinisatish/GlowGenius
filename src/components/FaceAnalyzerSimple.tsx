import { useEffect, useState, useRef } from 'react';
import {
  detectSkinTone,
  detectUndertone,
  extractPixelsFromRegion,
  getDominantColor,
  RGB,
} from '../utils/colorAnalysis';
import {
  generateRecommendations,
  BeautyAnalysis,
  Recommendations,
} from '../utils/recommendationEngine';

interface FaceAnalyzerProps {
  imageData: string;
  onAnalysisComplete: (analysis: BeautyAnalysis, recommendations: Recommendations) => void;
  onError: (error: string) => void;
}

export function FaceAnalyzer({ imageData, onAnalysisComplete, onError }: FaceAnalyzerProps) {
  const [status, setStatus] = useState<string>('Analyzing image...');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    analyzeFace();
  }, [imageData]);

  const analyzeFace = async () => {
    try {
      setStatus('Loading image...');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageData;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          img.decode().then(resolve).catch(reject);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      if (imageRef.current) {
        imageRef.current.src = imageData;
      }

      setStatus('Analyzing facial features...');

      const canvas = canvasRef.current;
      if (!canvas) {
        onError('Canvas not available for analysis');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        onError('Failed to initialize canvas for analysis');
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);

      setStatus('Analyzing skin tone...');

      // Simple face region detection (center area of image)
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const regionSize = Math.min(canvas.width, canvas.height) * 0.3; // 30% of smaller dimension

      const left = Math.max(0, centerX - regionSize / 2);
      const top = Math.max(0, centerY - regionSize / 2);
      const width = Math.min(regionSize, canvas.width - left);
      const height = Math.min(regionSize, canvas.height - top);

      const facePixels = extractPixelsFromRegion(imageDataObj, left, top, width, height);
      const dominantColor = getDominantColor(facePixels);

      const skinTone = detectSkinTone(dominantColor);
      const undertone = detectUndertone(dominantColor);

      const analysis: BeautyAnalysis = {
        skinTone,
        undertone,
        lipColor: '#FF7F50', // Default coral color
        skinToneRgb: {
          r: dominantColor.r,
          g: dominantColor.g,
          b: dominantColor.b,
        },
      };

      const recommendations = generateRecommendations(analysis);

      setStatus('Analysis complete!');

      setTimeout(() => {
        onAnalysisComplete(analysis, recommendations);
      }, 500);
    } catch (error) {
      console.error('Face analysis error details:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        imageDataLength: imageData?.length || 0
      });
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to analyze face. Please try again with a different photo.';
      
      if (error instanceof Error) {
        if (error.message.includes('Module.arguments')) {
          errorMessage = 'AI model loading failed. Please refresh the page and try again.';
        } else if (error.message.includes('WebAssembly')) {
          errorMessage = 'Face detection is not supported on this device. Please try uploading a clearer photo.';
        } else if (error.message.includes('decode')) {
          errorMessage = 'Failed to process the image. Please ensure it\'s a valid JPEG or PNG file.';
        }
      }
      
      onError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <img
          ref={imageRef}
          alt="Analyzing"
          className="max-w-md rounded-2xl shadow-2xl"
        />
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
      
      <div className="mt-6 text-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
          <span className="text-gray-600 font-medium">{status}</span>
        </div>
      </div>
    </div>
  );
}
