import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ArrowLeft, Bell, Mail, Linkedin, Calendar, MapPin, Building } from 'lucide-react';
import { Connection } from '../../App';

interface ConnectionDetailProps {
  connection: Connection;
  onRemindMe: () => void;
  onBack: () => void;
}

export default function ConnectionDetail({ 
  connection, 
  onRemindMe, 
  onBack 
}: ConnectionDetailProps) {
  const { profile } = connection;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">Connection Details</h2>
        <div className="w-10" />
      </div>

      {/* Profile Section */}
      <div className="p-6">
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5 mb-6">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
              <AvatarImage src={profile.photo} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-2xl font-semibold mb-2">{profile.name}</h1>
            
            <div className="flex items-center justify-center space-x-4 text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span className="text-sm">TechCorp</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {profile.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Connection Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Connected on</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(connection.connectedAt)}
                  </p>
                </div>
              </div>

              {connection.event && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Event</p>
                    <p className="text-sm text-muted-foreground">{connection.event}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Contact</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <p className="font-medium">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">Send Email</p>
                </div>
              </Button>

              {profile.linkedin && (
                <Button variant="outline" className="w-full justify-start">
                  <Linkedin className="w-4 h-4 mr-3 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">LinkedIn Profile</p>
                    <p className="text-xs text-muted-foreground">View on LinkedIn</p>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reminder CTA */}
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                <Bell className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Set a Follow-up Reminder</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Don't let this connection go cold. Set a reminder to follow up.
                </p>
                <Button onClick={onRemindMe} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Bell className="w-4 h-4 mr-2" />
                  Remind Me
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}