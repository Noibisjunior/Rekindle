import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Bell,
  Mail,
  Linkedin,
  Calendar,
  MapPin,
  Building,
  Github,
} from "lucide-react";

interface UserProfile {
  name: string;
  email?: string;
  photoUrl?: string;
  company?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  tags?: string[];
}

interface Connection {
  _id: string;
  createdAt: string;
  event?: string;
  profile: UserProfile;
}

interface ConnectionDetailProps {
  connection: Connection | null;
  onBack: () => void;
  onRemindMe: () => void;
  loading?: boolean;
}

export default function ConnectionDetail({
  connection,
  onBack,
  onRemindMe,
  loading = false,
}: ConnectionDetailProps) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Connection not found</p>
        <Button onClick={onBack}>Back</Button>
      </div>
    );
  }

  const { profile } = connection;

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

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

      <div className="p-6 space-y-6">
        {/* Profile */}
        <Card className="border-0 bg-primary/5">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-md">
              <AvatarImage src={profile?.photoUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile?.name?.split(" ").map((n) => n[0]).join("") || "?"}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-semibold mb-2">
              {profile?.name || "Unknown User"}
            </h1>

            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-4">
              {profile?.company && (
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="text-sm">{profile.company}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
            </div>

            {profile?.tags?.length ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No tags provided yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Connection Info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium mb-2">Connection Details</h3>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Connected on</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(connection.createdAt)}
                </p>
              </div>
            </div>

            {connection.event && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Event</p>
                  <p className="text-sm text-muted-foreground">
                    {connection.event}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium mb-2">Contact Info</h3>

            {profile?.email && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => (window.location.href = `mailto:${profile.email}`)}
              >
                <Mail className="w-4 h-4 mr-3" />
                <span>{profile.email}</span>
              </Button>
            )}

            {profile?.linkedin && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(profile.linkedin!, "_blank")}
              >
                <Linkedin className="w-4 h-4 mr-3 text-blue-600" />
                <span>LinkedIn</span>
              </Button>
            )}

            {profile?.github && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(profile.github!, "_blank")}
              >
                <Github className="w-4 h-4 mr-3" />
                <span>GitHub</span>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Reminder */}
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
              <Bell className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">Set a Follow-up Reminder</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Don’t let this connection go cold. Set a reminder to follow up.
              </p>
              <Button
                onClick={onRemindMe}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Bell className="w-4 h-4 mr-2" />
                Remind Me
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
