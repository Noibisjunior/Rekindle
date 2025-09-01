import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Clock, Bell } from 'lucide-react';
import { Connection, Reminder } from '../../App';

interface ReminderSetupProps {
  connection: Connection;
  onConfirm: (reminder: Reminder) => void;
  onCancel: () => void;
}

const QUICK_OPTIONS = [
  { label: '1 hour', hours: 1 },
  { label: '4 hours', hours: 4 },
  { label: '1 day', hours: 24 },
  { label: '3 days', hours: 72 },
  { label: '1 week', hours: 168 },
];

export default function ReminderSetup({ connection, onConfirm, onCancel }: ReminderSetupProps) {
  const [selectedHours, setSelectedHours] = useState(24); // Default to 1 day
  const [customDateTime, setCustomDateTime] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [isCustom, setIsCustom] = useState(false);

  const calculateReminderTime = () => {
    if (isCustom && customDateTime) {
      return new Date(customDateTime);
    }
    return new Date(Date.now() + selectedHours * 60 * 60 * 1000);
  };

  const formatReminderTime = () => {
    const time = calculateReminderTime();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(time);
  };

  const handleConfirm = () => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      connectionId: connection.id,
      scheduledFor: calculateReminderTime(),
      message: `Follow up with ${connection.profile.name}`,
      completed: false
    };
    onConfirm(reminder);
  };

  // Set default custom time to 1 hour from now
  React.useEffect(() => {
    const defaultTime = new Date(Date.now() + 60 * 60 * 1000);
    setCustomDateTime(defaultTime.toISOString().slice(0, 16));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">Set Reminder</h2>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Connection Preview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={connection.profile.photo} />
                <AvatarFallback>
                  {connection.profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{connection.profile.name}</p>
                <p className="text-sm text-muted-foreground">
                  Set a reminder to follow up
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Options */}
        <div className="space-y-3">
          <Label>Quick Options</Label>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_OPTIONS.map((option) => (
              <Button
                key={option.hours}
                variant={!isCustom && selectedHours === option.hours ? "default" : "outline"}
                onClick={() => {
                  setSelectedHours(option.hours);
                  setIsCustom(false);
                }}
                className="h-12"
              >
                <Clock className="w-4 h-4 mr-2" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Custom Time</Label>
            <Switch
              checked={isCustom}
              onCheckedChange={setIsCustom}
            />
          </div>
          
          {isCustom && (
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border border-border rounded-lg bg-input-background"
            />
          )}
        </div>

        {/* Notification Setting */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Push Notification</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified on your device
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationEnabled}
                onCheckedChange={setNotificationEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Reminder Preview</h3>
            <p className="text-sm text-muted-foreground mb-2">
              You'll be reminded to follow up with {connection.profile.name}
            </p>
            <p className="font-medium text-secondary">
              {formatReminderTime()}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Set Reminder
          </Button>
        </div>
      </div>
    </div>
  );
}