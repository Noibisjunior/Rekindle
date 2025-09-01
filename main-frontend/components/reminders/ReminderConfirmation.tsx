import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CheckCircle, Edit, Clock } from 'lucide-react';
import { Reminder } from '../../App';

interface ReminderConfirmationProps {
  reminder: Reminder;
  onEdit: () => void;
  onDone: () => void;
}

export default function ReminderConfirmation({ 
  reminder, 
  onEdit, 
  onDone 
}: ReminderConfirmationProps) {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeUntilReminder = () => {
    const now = new Date();
    const timeDiff = reminder.scheduledFor.getTime() - now.getTime();
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-2">Reminder Set!</h2>
          
          {/* Description */}
          <p className="text-muted-foreground mb-6">
            You'll be reminded in {getTimeUntilReminder()}
          </p>

          {/* Reminder Details */}
          <Card className="border-secondary/20 bg-secondary/5 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{reminder.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(reminder.scheduledFor)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={onDone} className="w-full">
              Done
            </Button>
            <Button variant="outline" onClick={onEdit} className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit Reminder
            </Button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-muted-foreground mt-4">
            You can view and manage all reminders in your profile settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}