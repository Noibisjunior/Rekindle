import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Camera, User, Briefcase, MapPin } from 'lucide-react';
import { UserProfile } from '../../App';

interface ProfileSetupProps {
  onComplete: (user: UserProfile) => void;
}

const AVAILABLE_TAGS = [
  'Technology', 'Marketing', 'Sales', 'Design', 'Finance', 'HR',
  'Consulting', 'Healthcare', 'Education', 'Startup', 'Enterprise',
  'Product', 'Engineering', 'Data Science', 'AI/ML', 'Blockchain'
];

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: 'john@company.com', // Pre-filled from previous step
    linkedin: '',
    photo: '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleComplete = () => {
    const user: UserProfile = {
      id: Date.now().toString(),
      name: formData.name || 'John Doe',
      email: formData.email,
      linkedin: formData.linkedin,
      photo: formData.photo,
      tags: selectedTags,
    };
    onComplete(user);
  };

  const isFormValid = formData.name.trim() && selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">Setup Profile</h2>
        <Button 
          variant="ghost" 
          onClick={handleComplete}
          disabled={!isFormValid}
          className="text-primary"
        >
          Done
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Photo Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoPreview} />
                <AvatarFallback className="bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4 text-primary-foreground" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="hidden" 
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">Add a professional photo</p>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (optional)</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/johndoe"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              />
            </div>
          </div>

          {/* Tags Selection */}
          <div className="space-y-4">
            <div>
              <Label>Professional Tags *</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select areas that represent your expertise (choose at least 1)
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedTags.includes(tag) 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Complete Button */}
          <Button 
            onClick={handleComplete}
            disabled={!isFormValid}
            className="w-full h-12"
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}