import React from 'react';
import { Button } from '../ui/button';
import { Users, QrCode, Bell } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex flex-col items-center justify-center px-6 text-white">
      <div className="w-full max-w-sm lg:max-w-2xl space-y-8 lg:space-y-12 text-center">
        {/* Logo and App Name */}
        <div className="space-y-4 lg:space-y-6">
          <div className="w-20 h-20 lg:w-32 lg:h-32 bg-secondary rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto">
            <QrCode className="w-10 h-10 lg:w-16 lg:h-16 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-semibold text-white">Rekindle</h1>
            <p className="text-primary-foreground/80 mt-2 lg:mt-4 lg:text-xl">
              Connect instantly. Remember forever.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6 lg:space-y-8">
          {/* Desktop: Grid layout for larger screens */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
            <div className="flex lg:flex-col items-center lg:items-center space-x-4 lg:space-x-0 lg:space-y-4 text-left lg:text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-foreground/10 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                <QrCode className="w-6 h-6 lg:w-8 lg:h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-white lg:text-lg">Quick QR Scan</h3>
                <p className="text-sm lg:text-base text-primary-foreground/70">
                  Connect instantly with a quick scan
                </p>
              </div>
            </div>

            <div className="flex lg:flex-col items-center lg:items-center space-x-4 lg:space-x-0 lg:space-y-4 text-left lg:text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-foreground/10 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 lg:w-8 lg:h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-white lg:text-lg">Manage Connections</h3>
                <p className="text-sm lg:text-base text-primary-foreground/70">
                  Organize and track your network
                </p>
              </div>
            </div>

            <div className="flex lg:flex-col items-center lg:items-center space-x-4 lg:space-x-0 lg:space-y-4 text-left lg:text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary-foreground/10 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 lg:w-8 lg:h-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-white lg:text-lg">Smart Reminders</h3>
                <p className="text-sm lg:text-base text-primary-foreground/70">
                  Never forget to follow up
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 lg:space-y-6 pt-8 lg:pt-12">
          <Button 
            onClick={onGetStarted}
            className="w-full lg:w-auto lg:px-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 lg:h-14 text-base lg:text-lg font-medium"
          >
            Get Started
          </Button>
          
          <p className="text-primary-foreground/70 text-sm lg:text-base">
            Join thousands of professionals building meaningful connections
          </p>
        </div>

        {/* Desktop: Additional content for larger screens */}
        <div className="hidden lg:block pt-8">
          <div className="bg-primary-foreground/10 rounded-2xl p-6 lg:p-8">
            <h3 className="font-medium text-white mb-2 lg:text-lg">Perfect for professionals</h3>
            <p className="text-sm lg:text-base text-primary-foreground/70">
              Networking events, conferences, business meetings - build meaningful connections wherever you go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}