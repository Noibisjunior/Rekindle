import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { ArrowLeft, Camera, Flashlight, FlashlightOff, Type, X, Monitor } from 'lucide-react';
import { UserProfile } from '../../App';

interface QRScannerProps {
  onScanSuccess: (profile: UserProfile) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

export default function QRScanner({ onScanSuccess, onError, onBack }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if we're on a desktop device
    const checkDevice = () => {
      const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktop(isLargeScreen && hasCamera);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (!isDesktop) {
      startCamera();
    }

    return () => {
      window.removeEventListener('resize', checkDevice);
      stopCamera();
    };
  }, [isDesktop]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanState('scanning');
        
        // Simulate QR detection after 3 seconds
        setTimeout(() => {
          simulateQRDetection();
        }, 3000);
      }
    } catch (err) {
      if (isDesktop) {
        // On desktop, show manual entry by default if camera fails
        setShowManualEntry(true);
        setScanState('idle');
      } else {
        onError('Camera permission denied. Please enable camera access to scan QR codes.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const simulateQRDetection = () => {
    // Simulate successful QR code scan
    const mockProfile: UserProfile = {
      id: 'mock-user-' + Date.now(),
      name: 'Alexandra Chen',
      email: 'alexandra.chen@techcorp.com',
      linkedin: 'linkedin.com/in/alexandrachen',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612e775?w=200&h=200&fit=crop&crop=face',
      tags: ['Technology', 'Product', 'AI/ML']
    };

    setScanState('success');
    setTimeout(() => {
      onScanSuccess(mockProfile);
    }, 1000);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'torch' in track.getCapabilities()) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled }]
          });
          setFlashEnabled(!flashEnabled);
        } catch (err) {
          console.log('Flash not supported');
        }
      }
    }
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      // Simulate manual code processing
      simulateQRDetection();
    }
  };

  const handleCameraStart = () => {
    setShowManualEntry(false);
    startCamera();
  };

  // Desktop layout with side-by-side camera and manual entry
  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-border">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-medium lg:text-xl">Scan QR Code</h2>
          <div className="w-10" />
        </div>

        {/* Desktop Content */}
        <div className="p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Camera Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Camera Scanner</h3>
                
                {streamRef.current ? (
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full aspect-square object-cover"
                    />
                    
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
                        {/* Corner decorations */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-secondary rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-secondary rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-secondary rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-secondary rounded-br-lg" />
                        
                        {/* Scanning animation */}
                        {scanState === 'scanning' && (
                          <div className="absolute inset-0 overflow-hidden rounded-2xl">
                            <div className="w-full h-1 bg-secondary animate-pulse absolute top-1/2 transform -translate-y-1/2" />
                          </div>
                        )}

                        {/* Success state */}
                        {scanState === 'success' && (
                          <div className="absolute inset-0 bg-secondary/20 rounded-2xl flex items-center justify-center">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center">
                    <Monitor className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4 text-center">
                      Camera not available or access denied
                    </p>
                    <Button onClick={handleCameraStart} variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Try Camera
                    </Button>
                  </div>
                )}

                {/* Camera Controls */}
                {streamRef.current && (
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button variant="outline" onClick={toggleFlash}>
                      {flashEnabled ? (
                        <FlashlightOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Flashlight className="w-4 h-4 mr-2" />
                      )}
                      Flash
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-4">Manual Entry</h3>
                <p className="text-muted-foreground mb-4">
                  If the camera isn't working, you can manually enter the QR code data.
                </p>
                
                <div className="space-y-4">
                  <Input
                    placeholder="Paste or type QR code data"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="h-12"
                  />
                  <Button 
                    onClick={handleManualEntry}
                    disabled={!manualCode.trim()}
                    className="w-full h-12"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Process Code
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Desktop Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use your phone to scan QR codes</li>
                    <li>• Copy and paste QR data from other sources</li>
                    <li>• Enable camera access for real-time scanning</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout (original design)
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm text-white z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">Scan QR Code</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleFlash}
          className="text-white hover:bg-white/10"
        >
          {flashEnabled ? (
            <FlashlightOff className="w-5 h-5" />
          ) : (
            <Flashlight className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Overlay with hole */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Scanning Frame */}
          <div className="relative w-64 h-64 border-2 border-white rounded-2xl bg-transparent">
            {/* Corner decorations */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-secondary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-secondary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-secondary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-secondary rounded-br-lg" />
            
            {/* Scanning animation */}
            {scanState === 'scanning' && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="w-full h-1 bg-secondary animate-pulse absolute top-1/2 transform -translate-y-1/2" />
              </div>
            )}

            {/* Success state */}
            {scanState === 'success' && (
              <div className="absolute inset-0 bg-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 text-center text-white px-6">
          <p className="text-lg font-medium mb-2">Position QR code in the frame</p>
          <p className="text-white/70">The code will be scanned automatically</p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 bg-black/50 backdrop-blur-sm space-y-4">
        {!showManualEntry ? (
          <Button 
            variant="outline"
            onClick={() => setShowManualEntry(true)}
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <Type className="w-4 h-4 mr-2" />
            Enter code manually
          </Button>
        ) : (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium">Enter QR Code</p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowManualEntry(false)}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                placeholder="Paste or type QR code data"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
              <Button 
                onClick={handleManualEntry}
                disabled={!manualCode.trim()}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Process Code
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}