import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { QrCode, Users, Settings, Scan, Zap, User } from 'lucide-react';
import { UserProfile } from '../../App';

interface HomeScreenProps {
  user: UserProfile | null;
  onScanQR: () => void;
  onViewConnections: () => void;
  onEditProfile: () => void;
}

export default function HomeScreen({ 
  user, 
  onScanQR, 
  onViewConnections, 
  onEditProfile 
}: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 xl:py-12">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Avatar className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 border-2 border-white/20">
                <AvatarImage src={user?.photo} />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {user?.name?.split(' ').map(n => n[0]).join('') || <User className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-medium text-lg lg:text-xl xl:text-2xl">Welcome back!</h1>
                <p className="text-primary-foreground/80 text-sm lg:text-base xl:text-lg">
                  {user?.name || 'User'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onEditProfile}
              className="text-white hover:bg-white/10 w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14"
            >
              <Settings className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
            <div className="bg-white/10 rounded-xl p-4 lg:p-6 xl:p-8 text-center">
              <div className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white">12</div>
              <div className="text-primary-foreground/80 text-sm lg:text-base xl:text-lg">Connections</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 lg:p-6 xl:p-8 text-center">
              <div className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white">3</div>
              <div className="text-primary-foreground/80 text-sm lg:text-base xl:text-lg">This Week</div>
            </div>
            <div className="hidden lg:block bg-white/10 rounded-xl p-6 xl:p-8 text-center">
              <div className="text-3xl xl:text-4xl font-semibold text-white">8</div>
              <div className="text-primary-foreground/80 text-base xl:text-lg">This Month</div>
            </div>
            <div className="hidden lg:block bg-white/10 rounded-xl p-6 xl:p-8 text-center">
              <div className="text-3xl xl:text-4xl font-semibold text-white">5</div>
              <div className="text-primary-foreground/80 text-base xl:text-lg">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 -mt-8 lg:-mt-12 xl:-mt-16 space-y-6 lg:space-y-8 xl:space-y-12 pb-8 lg:pb-12">
        {/* Primary Scan Button */}
        <Card className="bg-gradient-to-r from-secondary to-secondary/80 border-0 shadow-lg">
          <CardContent className="p-6 lg:p-8 xl:p-12">
            <Button 
              onClick={onScanQR}
              className="w-full h-16 lg:h-20 xl:h-24 bg-white/20 hover:bg-white/30 border border-white/30 text-secondary-foreground backdrop-blur-sm"
              size="lg"
            >
              <div className="flex flex-col items-center space-y-2 lg:space-y-3">
                <QrCode className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
                <span className="font-medium text-base lg:text-lg xl:text-xl">Scan QR Code</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Desktop: Multi-column layout for larger screens */}
        <div className="grid gap-6 lg:gap-8 xl:gap-12 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* NFC Option */}
          <div className="lg:col-span-1 xl:col-span-1">
            <Card className="border border-border/50 h-full">
              <CardContent className="p-4 lg:p-6 xl:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-accent rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-base lg:text-lg xl:text-xl">NFC Tap to Connect</p>
                      <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">Hold phones together</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="lg:px-6 xl:px-8 lg:text-base">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 xl:col-span-2 2xl:col-span-2">
            <div className="grid grid-cols-2 gap-4 lg:gap-6 xl:gap-8 h-full">
              <Card className="border border-border/50 hover:shadow-md transition-shadow cursor-pointer h-full" onClick={onViewConnections}>
                <CardContent className="p-4 lg:p-6 xl:p-8 text-center h-full flex flex-col justify-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-primary" />
                  </div>
                  <p className="font-medium text-base lg:text-lg xl:text-xl">Connections</p>
                  <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">View your network</p>
                </CardContent>
              </Card>

              <Card className="border border-border/50 hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 lg:p-6 xl:p-8 text-center h-full flex flex-col justify-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
                    <Scan className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-secondary" />
                  </div>
                  <p className="font-medium text-base lg:text-lg xl:text-xl">My QR</p>
                  <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">Share your profile</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 xl:col-span-3 2xl:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6 lg:p-8 xl:p-10">
                <h3 className="font-medium text-lg lg:text-xl xl:text-2xl mb-4 lg:mb-6 xl:mb-8">Recent Activity</h3>
                <div className="space-y-4 lg:space-y-6 xl:space-y-8">
                  <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
                    <Avatar className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs lg:text-sm xl:text-base">SA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm lg:text-base xl:text-lg">Connected with Sarah Adams</p>
                      <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">2 hours ago • Tech Conference</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
                    <Avatar className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                      <AvatarFallback className="bg-secondary/10 text-secondary text-xs lg:text-sm xl:text-base">MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm lg:text-base xl:text-lg">Connected with Mike Johnson</p>
                      <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">Yesterday • Startup Meetup</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
                    <Avatar className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14">
                      <AvatarFallback className="bg-accent/30 text-primary text-xs lg:text-sm xl:text-base">EC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm lg:text-base xl:text-lg">Connected with Emily Chen</p>
                      <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">3 days ago • Design Workshop</p>
                    </div>
                  </div>
                </div>
                
                {/* View All Button */}
                <div className="mt-6 lg:mt-8 xl:mt-10">
                  <Button variant="outline" onClick={onViewConnections} className="w-full text-sm lg:text-base xl:text-lg">
                    View All Connections
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}