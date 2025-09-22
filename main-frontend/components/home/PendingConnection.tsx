import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Clock, CheckCircle, X } from 'lucide-react';
import { UserProfile } from '../../App';

interface PendingConnectionProps {
  profile: UserProfile;
  onCancel: () => void;
  onConnectionAccepted: () => void;
}

export default function PendingConnection({ 
  profile, 
  onCancel, 
  onConnectionAccepted 
}: PendingConnectionProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Simulate acceptance after 5 seconds
    const acceptTimer = setTimeout(() => {
      setIsAccepted(true);
      setTimeout(() => {
        onConnectionAccepted();
      }, 2000);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(acceptTimer);
    };
  }, [onConnectionAccepted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connection Accepted!</h2>
            <p className="text-muted-foreground mb-4">
              {profile.name} has accepted your connection request
            </p>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile.photo} />
                <AvatarFallback className="text-xs">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-2xl">🤝</span>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  You
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting to your connections...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">Connection Pending</h2>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="p-8 text-center">
            {/* Status Icon */}
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-secondary animate-pulse" />
            </div>

            {/* Status */}
            <h2 className="text-xl font-semibold mb-2">Request Sent</h2>
            <p className="text-muted-foreground mb-6">
              Waiting for {profile.name} to accept your connection request
            </p>

            {/* Profile Preview */}
            <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-accent/50 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile.photo} />
                <AvatarFallback>
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium">{profile.name}</p>
              </div>
            </div>

            {/* Timer */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Time elapsed</p>
              <p className="text-lg font-mono text-primary">{formatTime(timeElapsed)}</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="outline" onClick={onCancel} className="w-full">
                Cancel Request
              </Button>
              <p className="text-xs text-muted-foreground">
                We'll notify you when they respond
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}