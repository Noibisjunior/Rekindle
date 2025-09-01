import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { AlertTriangle, RefreshCw, Home, Camera, QrCode } from 'lucide-react';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
  onHome: () => void;
}

export default function ErrorScreen({ error, onRetry, onHome }: ErrorScreenProps) {
  const getErrorIcon = () => {
    if (error.includes('camera') || error.includes('Camera')) {
      return <Camera className="w-8 h-8 text-destructive" />;
    }
    if (error.includes('QR') || error.includes('code')) {
      return <QrCode className="w-8 h-8 text-destructive" />;
    }
    return <AlertTriangle className="w-8 h-8 text-destructive" />;
  };

  const getErrorTitle = () => {
    if (error.includes('camera') || error.includes('Camera')) {
      return 'Camera Access Required';
    }
    if (error.includes('QR') || error.includes('code')) {
      return 'Invalid QR Code';
    }
    if (error.includes('expired')) {
      return 'Connection Expired';
    }
    return 'Something Went Wrong';
  };

  const getErrorSolution = () => {
    if (error.includes('camera') || error.includes('Camera')) {
      return 'Please enable camera permissions in your browser settings and try again.';
    }
    if (error.includes('QR') || error.includes('code')) {
      return 'The QR code appears to be invalid or corrupted. Try scanning again or ask for a new code.';
    }
    if (error.includes('expired')) {
      return 'This connection request has expired. Please generate a new QR code.';
    }
    return 'We encountered an unexpected error. Please try again or contact support if the problem persists.';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {getErrorIcon()}
          </div>

          {/* Error Title */}
          <h2 className="text-xl font-semibold mb-2">{getErrorTitle()}</h2>
          
          {/* Error Message */}
          <p className="text-muted-foreground mb-2">{error}</p>
          
          {/* Solution */}
          <p className="text-sm text-muted-foreground mb-6">
            {getErrorSolution()}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" onClick={onHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>

          {/* Help Text */}
          {error.includes('camera') && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Need help?</strong> Go to your browser settings → Privacy & Security → Site Settings → Camera, and allow access for this site.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}