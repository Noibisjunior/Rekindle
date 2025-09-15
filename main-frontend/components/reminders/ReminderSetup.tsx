import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeft, Clock } from "lucide-react";

interface ReminderSetupProps {
  connection: {
    _id: string;
    profile: { name: string; photoUrl?: string };
  };
  onConfirm: (reminder: any) => void;
  onCancel: () => void;
}

const QUICK_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "4 hours", hours: 4 },
  { label: "1 day", hours: 24 },
  { label: "3 days", hours: 72 },
  { label: "1 week", hours: 168 },
];

export default function ReminderSetup({
  connection,
  onConfirm,
  onCancel,
}: ReminderSetupProps) {
  const [selectedHours, setSelectedHours] = useState(24); // default: 1 day
  const [customDateTime, setCustomDateTime] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Default custom time = 1 hour from now
    const defaultTime = new Date(Date.now() + 60 * 60 * 1000);
    setCustomDateTime(defaultTime.toISOString().slice(0, 16));
  }, []);

  const calculateReminderTime = () => {
    if (isCustom && customDateTime) return new Date(customDateTime);
    return new Date(Date.now() + selectedHours * 60 * 60 * 1000);
  };

  const formatReminderTime = () => {
    const time = calculateReminderTime();
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(time);
  };

  const handleConfirm = async () => {
    const scheduledTime = calculateReminderTime();

    if (scheduledTime < new Date()) {
      alert("Please choose a future time for your reminder.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/v1/reminders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId: connection._id,
          remindAt: scheduledTime,
          channel: "email", // you can toggle push/email later if needed
          message: `Follow up with ${connection.profile.name}`,
        }),
      });

      if (!res.ok) throw new Error("Failed to set reminder");

      const reminder = await res.json();
      onConfirm(reminder);
    } catch (err) {
      console.error("Error setting reminder:", err);
      alert("Could not set reminder. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-base sm:text-lg font-medium">Set Reminder</h2>
        <div className="w-8 sm:w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-lg mx-auto w-full">
        {/* Connection Preview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={connection.profile.photoUrl} />
              <AvatarFallback>
                {connection.profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="font-medium text-sm sm:text-base">
                {connection.profile.name}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Choose when you want to be reminded
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Options */}
        {!isCustom && (
          <div>
            <Label className="text-sm sm:text-base">Quick Options</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-3">
              {QUICK_OPTIONS.map((option) => (
                <Button
                  key={option.hours}
                  variant={
                    selectedHours === option.hours ? "default" : "outline"
                  }
                  className="h-10 sm:h-12 text-xs sm:text-sm"
                  onClick={() => setSelectedHours(option.hours)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="text-right mt-2">
              <Button
                variant="ghost"
                className="text-xs sm:text-sm underline"
                onClick={() => setIsCustom(true)}
              >
                Set Custom Time
              </Button>
            </div>
          </div>
        )}

        {/* Custom Time Picker */}
        {isCustom && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm sm:text-base">Custom Time</Label>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setIsCustom(false)}
              >
                Use Quick Options
              </Button>
            </div>
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border border-border rounded-lg bg-input-background text-sm sm:text-base"
            />
          </div>
        )}

        {/* Preview */}
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="p-4">
            <h3 className="font-medium text-sm sm:text-base mb-2">
              Reminder Preview
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              You'll be reminded to follow up with {connection.profile.name}
            </p>
            <p className="font-medium text-secondary text-sm sm:text-base">
              {formatReminderTime()}
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Setting..." : "Set Reminder"}
          </Button>
        </div>
      </div>
    </div>
  );
}
