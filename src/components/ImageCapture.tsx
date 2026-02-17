import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export function ImageCapture({ onImageCapture }: ImageCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        onImageCapture(imageData);
        stopCamera();
      }
    }
  }, [onImageCapture, stopCamera]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          alert('Please upload a JPEG or PNG image file.');
          return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imageData = e.target?.result as string;
            if (imageData && imageData.startsWith('data:image')) {
              onImageCapture(imageData);
            } else {
              throw new Error('Invalid image data');
            }
          } catch (error) {
            console.error('Error processing uploaded image:', error);
            alert('Failed to process the uploaded image. Please try a different file.');
          }
        };
        reader.onerror = () => {
          alert('Failed to read the uploaded file. Please try again.');
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageCapture]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isCameraActive ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Camera className="w-5 h-5" />
              Start Camera
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Upload className="w-5 h-5" />
              Upload Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="text-center text-sm text-gray-600">
            <p>Choose your preferred method to analyze your face</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-2xl shadow-2xl"
          />

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="px-8 py-3 bg-white text-pink-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Capture Photo
            </button>

            <button
              onClick={stopCamera}
              className="px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
