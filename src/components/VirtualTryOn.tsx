import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Webcam, X, Palette } from 'lucide-react';

interface VirtualTryOnProps {
  onClose: () => void;
}

const LIPSTICK_SHADES = [
  { name: 'Coral Bliss', hex: '#FF7F50' },
  { name: 'Peach Dream', hex: '#FFDAB9' },
  { name: 'Warm Red', hex: '#DC143C' },
  { name: 'Berry Crush', hex: '#8B008B' },
  { name: 'Pink Mauve', hex: '#D8BFD8' },
  { name: 'Nude Rose', hex: '#C9A88E' },
  { name: 'Plum Perfect', hex: '#8E4585' },
  { name: 'True Red', hex: '#FF0000' },
];

export function VirtualTryOn({ onClose }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#FF7F50');
  const [camera, setCamera] = useState<Camera | null>(null);

  // Add global error handler for WebAssembly errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('Module.arguments')) {
        console.warn('MediaPipe WebAssembly error handled:', event.message);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    const initializeCamera = async () => {
      if (!videoRef.current || !canvasRef.current || !overlayCanvasRef.current) return;

      try {
        // Initialize MediaPipe with TensorFlow.js runtime to avoid WASM issues
        const faceMeshInstance = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        // Set options before initializing
        faceMeshInstance.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMeshInstance.onResults(onResults);

        const cameraInstance = new Camera(videoRef.current, {
          onFrame: async () => {
            try {
              if (videoRef.current && faceMeshInstance) {
                await faceMeshInstance.send({ image: videoRef.current });
              }
            } catch (error) {
              console.warn('Face mesh processing error:', error);
            }
          },
          width: 640,
          height: 480,
        });

        await cameraInstance.start();
        
        setCamera(cameraInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing camera or face mesh:', error);
        setIsLoading(false);
        // Show user-friendly error message
        alert('Virtual try-on is currently unavailable. Please try again later.');
      }
    };

    initializeCamera();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, []);

  const onResults = (results: Results) => {
    if (!canvasRef.current || !overlayCanvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');

    if (!ctx || !overlayCtx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    overlayCanvas.width = videoRef.current.videoWidth;
    overlayCanvas.height = videoRef.current.videoHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      // Lip landmarks indices for MediaPipe Face Mesh
      const lipIndices = [
        61, 84, 17, 314, 405, 291, 375, 321, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
        78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95
      ];

      // Draw lipstick on lips
      overlayCtx.save();
      overlayCtx.globalAlpha = 0.8;
      overlayCtx.fillStyle = selectedColor;
      
      // Create lip shape
      overlayCtx.beginPath();
      lipIndices.forEach((index, i) => {
        const landmark = landmarks[index];
        const x = landmark.x * overlayCanvas.width;
        const y = landmark.y * overlayCanvas.height;
        
        if (i === 0) {
          overlayCtx.moveTo(x, y);
        } else {
          overlayCtx.lineTo(x, y);
        }
      });
      overlayCtx.closePath();
      overlayCtx.fill();
      
      // Add subtle shimmer effect
      overlayCtx.globalAlpha = 0.3;
      overlayCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      overlayCtx.beginPath();
      const shimmerLandmark = landmarks[13]; // Top lip center
      overlayCtx.arc(
        shimmerLandmark.x * overlayCanvas.width,
        shimmerLandmark.y * overlayCanvas.height,
        5,
        0,
        2 * Math.PI
      );
      overlayCtx.fill();
      
      overlayCtx.restore();
    }
  };

  const handleColorSelect = (hex: string) => {
    setSelectedColor(hex);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Webcam className="w-6 h-6 text-pink-500" />
            Virtual Lipstick Try-On
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing camera...</p>
                </div>
              </div>
            )}
            
            <div className="relative rounded-2xl overflow-hidden bg-gray-100">
              <video
                ref={videoRef}
                className="hidden"
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-2xl"
              />
              <canvas
                ref={overlayCanvasRef}
                className="absolute top-0 left-0 w-full h-auto rounded-2xl"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold text-gray-800">Choose Your Shade</h3>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {LIPSTICK_SHADES.map((shade) => (
                <button
                  key={shade.hex}
                  onClick={() => handleColorSelect(shade.hex)}
                  className={`relative group transition-all transform hover:scale-110 ${
                    selectedColor === shade.hex ? 'ring-4 ring-pink-500 ring-offset-2' : ''
                  }`}
                  title={shade.name}
                >
                  <div
                    className="w-12 h-12 rounded-full shadow-lg border-2 border-white"
                    style={{ backgroundColor: shade.hex }}
                  />
                  {selectedColor === shade.hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Current Shade:</span> {LIPSTICK_SHADES.find(s => s.hex === selectedColor)?.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-6 h-6 rounded-full shadow-md"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-xs text-gray-600">{selectedColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
