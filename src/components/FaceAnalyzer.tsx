import { useEffect, useState, useRef } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
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
  const [status, setStatus] = useState<string>('Initializing AI model...');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    analyzeFace();
  }, [imageData]);

  const analyzeFace = async () => {
    try {
      setStatus('Loading AI model...');

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        refineLandmarks: true,
      };

      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

      setStatus('Loading image...');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageData;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      if (imageRef.current) {
        imageRef.current.src = imageData;
      }

      setStatus('Detecting facial features...');

      const faces = await detector.estimateFaces(img);

      if (faces.length === 0) {
        onError('No face detected. Please try again with a clear photo of your face.');
        return;
      }

      const face = faces[0];
      const canvas = canvasRef.current;

      if (!canvas) {
        onError('Canvas not available');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        onError('Cannot get canvas context');
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);

      setStatus('Analyzing skin tone...');

      const keypoints = face.keypoints;

      const leftCheek = keypoints.find((kp: any) => kp.name === 'leftCheek');
      const rightCheek = keypoints.find((kp: any) => kp.name === 'rightCheek');
      const noseTip = keypoints.find((kp: any) => kp.name === 'noseTip');
      const forehead = keypoints[10];

      const cheekPixels: RGB[] = [];
      if (leftCheek) {
        cheekPixels.push(...extractPixelsFromRegion(imageDataObj, leftCheek.x - 20, leftCheek.y - 20, 40, 40));
      }
      if (rightCheek) {
        cheekPixels.push(...extractPixelsFromRegion(imageDataObj, rightCheek.x - 20, rightCheek.y - 20, 40, 40));
      }
      if (noseTip) {
        cheekPixels.push(...extractPixelsFromRegion(imageDataObj, noseTip.x - 15, noseTip.y - 30, 30, 30));
      }
      if (forehead) {
        cheekPixels.push(...extractPixelsFromRegion(imageDataObj, forehead.x - 25, forehead.y - 25, 50, 30));
      }

      const skinToneRgb = getDominantColor(cheekPixels);
      const skinTone = detectSkinTone(skinToneRgb);
      const undertone = detectUndertone(skinToneRgb);

      setStatus('Analyzing lip color...');

      const upperLip = keypoints.find((kp: any) => kp.name === 'upperLipTop');
      const lowerLip = keypoints.find((kp: any) => kp.name === 'lowerLipBottom');

      let lipPixels: RGB[] = [];
      if (upperLip && lowerLip) {
        const lipCenterX = (upperLip.x + lowerLip.x) / 2;
        const lipCenterY = (upperLip.y + lowerLip.y) / 2;
        lipPixels = extractPixelsFromRegion(imageDataObj, lipCenterX - 20, lipCenterY - 15, 40, 30);
      }

      const lipColor = lipPixels.length > 0 ? getDominantColor(lipPixels) : skinToneRgb;

      setStatus('Generating personalized recommendations...');

      const analysis: BeautyAnalysis = {
        skinTone,
        undertone,
        lipColor,
        skinToneRgb,
      };

      const recommendations = generateRecommendations(analysis);

      setStatus('Analysis complete!');

      setTimeout(() => {
        onAnalysisComplete(analysis, recommendations);
      }, 500);
    } catch (error) {
      console.error('Face analysis error:', error);
      onError('Failed to analyze face. Please try again with a different photo.');
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
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
        <p className="text-lg font-medium text-gray-700">{status}</p>
      </div>
    </div>
  );
}
