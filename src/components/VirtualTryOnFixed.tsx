import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Palette, Download, Share2, SlidersHorizontal, Eye, EyeOff } from 'lucide-react';

interface LipColor {
  name: string;
  hex: string;
  brand?: string;
  price?: string;
}

interface VirtualTryOnProps {
  onClose: () => void;
}

const lipColors: LipColor[] = [
  { name: 'Coral Bliss', hex: '#FF7F50', brand: 'MAC', price: '₹1,200' },
  { name: 'Ruby Red', hex: '#DC143C', brand: 'Lakmé', price: '₹800' },
  { name: 'Nude Pink', hex: '#FFDAB9', brand: 'Maybelline', price: '₹600' },
  { name: 'Berry Wine', hex: '#8B0000', brand: 'Revlon', price: '₹900' },
  { name: 'Peach Dream', hex: '#FFE5B4', brand: 'Nykaa', price: '₹750' },
  { name: 'Plum Purple', hex: '#8B4789', brand: 'Sugar', price: '₹650' },
];

export function VirtualTryOn({ onClose }: VirtualTryOnProps) {
  const [selectedColor, setSelectedColor] = useState<LipColor>(lipColors[0]);
  const [opacity, setOpacity] = useState(0.7);
  const [showComparison, setShowComparison] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const comparisonCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const initializeCamera = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !overlayCanvasRef.current) return;

    setIsLoading(true);
    
    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve(null);
          }
        });

        // Set canvas dimensions
        if (canvasRef.current && overlayCanvasRef.current) {
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
          overlayCanvasRef.current.width = 640;
          overlayCanvasRef.current.height = 480;
        }

        setIsCameraActive(true);
        
        // Start drawing loop
        startDrawingLoop();
      }
    } catch (error) {
      console.error('Error initializing camera:', error);
      let errorMessage = 'Failed to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please connect a camera.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application.';
        } else {
          errorMessage += 'Please check your camera settings.';
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const drawLipOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!ctx || !canvas || !showOverlay) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set transparency
    ctx.globalAlpha = opacity;
    
    // Draw simplified lip shape (centered oval)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 50; // Move down slightly for lip position
    const lipWidth = 120;
    const lipHeight = 40;

    // Create gradient for more realistic look
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, lipWidth/2);
    gradient.addColorStop(0, selectedColor.hex);
    gradient.addColorStop(0.7, selectedColor.hex);
    gradient.addColorStop(1, selectedColor.hex + '88'); // Add transparency at edges

    ctx.fillStyle = gradient;
    
    // Draw upper lip
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 10, lipWidth/2, lipHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw lower lip
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 10, lipWidth/2, lipHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Reset alpha
    ctx.globalAlpha = 1;
  }, [selectedColor, opacity, showOverlay]);

  const startDrawingLoop = () => {
    const draw = () => {
      drawLipOverlay();
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopDrawingLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const stopCamera = useCallback(() => {
    stopDrawingLoop();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  }, []);

  const captureImage = () => {
    if (!canvasRef.current || !overlayCanvasRef.current || !videoRef.current) return null;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Draw video frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Draw lip overlay on top
    ctx.drawImage(overlayCanvasRef.current, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/png');
  };

  const downloadImage = () => {
    const dataUrl = captureImage();
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = `glowgenius-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async () => {
    const dataUrl = captureImage();
    if (!dataUrl) return;
    
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.share({
        title: 'My GlowGenius Look',
        text: `Check out my ${selectedColor.name} look from GlowGenius!`,
        files: [new File([blob], 'glowgenius-look.png', { type: 'image/png' })]
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`Check out my ${selectedColor.name} look from GlowGenius!`);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    // Redraw when color or opacity changes
    if (isCameraActive) {
      drawLipOverlay();
    }
  }, [selectedColor, opacity, isCameraActive, drawLipOverlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Virtual Try-On</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Test lipstick shades in real-time</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
          {/* Camera View */}
          <div className="flex-1 relative bg-gray-900 rounded-lg m-4 overflow-hidden">
            {!isCameraActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Start Camera</h3>
                <p className="text-gray-400 mb-6 text-center px-8">
                  Enable camera access to try on lipstick shades in real-time
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initializeCamera}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Initializing...' : 'Start Camera'}
                </motion.button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover hidden"
                  width={640}
                  height={480}
                />
                
                {/* Overlay Toggle */}
                <div className="absolute top-4 left-4">
                  <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      showOverlay
          {/* Controls Panel */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-96 p-6 space-y-6 overflow-y-auto"
              >
                {/* Color Palette */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Lip Colors
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {lipColors.map((color) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
                        className={`relative p-3 rounded-xl border-2 transition-all ${
                          selectedColor.name === color.name
                            ? 'border-pink-500 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div
                          className="w-full h-12 rounded-lg mb-2"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {color.name}
                        </p>
                        {color.brand && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {color.brand}
                          </p>
                        )}
                        {color.price && (
                          <p className="text-xs text-pink-500 font-semibold">
                            {color.price}
                          </p>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Opacity Control */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Intensity
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Natural</span>
                      <span>{Math.round(opacity * 100)}%</span>
                      <span>Bold</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={downloadImage}
                      disabled={!isCameraActive}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                    
                    <button
                      onClick={shareImage}
                      disabled={!isCameraActive}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Selected Color Info */}
                {selectedColor && (
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedColor.name}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedColor.brand}
                        </p>
                        <p className="text-sm font-semibold text-pink-500">
                          {selectedColor.price}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
