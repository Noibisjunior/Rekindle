import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeft, Camera, User } from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  linkedin: string;
  photo: string;
}

type Tag = string;

const AVAILABLE_TAGS: Tag[] = [
  "Software Engineer",
  "Product Manager",
  "Designer",
  "Data Scientist",
  "Marketer",
  "Sales",
  "Founder",
  "Investor",
  "Recruiter",
  "Other",
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "john@company.com", // prefetched after signup
    linkedin: "",
    photo: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPhotoPreview(result);
      setFormData((prev) => ({ ...prev, photo: result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleComplete = async () => {
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/v1/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          fullName: formData.name,
          linkedin: formData.linkedin,
          photoUrl: formData.photo,
          tags: selectedTags,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = formData.name.trim() && selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">Setup Profile</h2>
        <Button
          variant="ghost"
          onClick={handleComplete}
          disabled={!isFormValid || isSaving}
          className="text-primary"
        >
          {isSaving ? "Saving..." : "Done"}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Photo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={photoPreview} />
              <AvatarFallback className="bg-primary/10">
                <User className="w-8 h-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90">
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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={formData.email} disabled className="bg-muted" />
          </div>

          <div>
            <Label>LinkedIn (optional)</Label>
            <Input
              placeholder="linkedin.com/in/johndoe"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <Label>Professional Tags *</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          onClick={handleComplete}
          disabled={!isFormValid || isSaving}
          className="w-full h-12"
        >
          {isSaving ? "Saving..." : "Complete Profile"}
        </Button>
      </div>
    </div>
  );
}
