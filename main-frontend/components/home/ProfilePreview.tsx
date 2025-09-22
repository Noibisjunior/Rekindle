// import { Button } from '../ui/button';
// import { Card, CardContent } from '../ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Badge } from '../ui/badge';
// import { ArrowLeft, MapPin, Building, Linkedin, Mail, Users } from 'lucide-react';
// import { UserProfile } from '../../App';

// interface ProfilePreviewProps {
//   profile: UserProfile;
//   onConnect: () => void;
//   onBack: () => void;
// }

// export default function ProfilePreview({ profile, onConnect, onBack }: ProfilePreviewProps) {
//   const sharedTags = ['Technology', 'Product']; // Mock shared tags

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between p-6 border-b border-border">
//         <Button variant="ghost" size="icon" onClick={onBack}>
//           <ArrowLeft className="w-5 h-5" />
//         </Button>
//         <h2 className="font-medium">New Connection</h2>
//         <div className="w-10" />
//       </div>

//       {/* Profile Content */}
//       <div className="p-6 space-y-6">
//         {/* Profile Header */}
//         <Card className="border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
//           <CardContent className="p-6 text-center">
//             <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
//               <AvatarImage src={profile.photo} />
//               <AvatarFallback className="bg-primary text-primary-foreground text-xl">
//                 {profile.name.split(' ').map(n => n[0]).join('')}
//               </AvatarFallback>
//             </Avatar>
            
//             <h1 className="text-2xl font-semibold mb-2">{profile.name}</h1>
            
//             <div className="flex items-center justify-center space-x-4 text-muted-foreground mb-4">
//               <div className="flex items-center space-x-1">
//                 <Building className="w-4 h-4" />
//                 <span className="text-sm">TechCorp</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <MapPin className="w-4 h-4" />
//                 <span className="text-sm">San Francisco</span>
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="flex flex-wrap gap-2 justify-center">
//               {profile.tags.map((tag) => (
//                 <Badge
//                   key={tag}
//                   variant={sharedTags.includes(tag) ? "default" : "outline"}
//                   className={sharedTags.includes(tag) ? "bg-secondary text-secondary-foreground" : ""}
//                 >
//                   {tag}
//                   {sharedTags.includes(tag) && (
//                     <Users className="w-3 h-3 ml-1" />
//                   )}
//                 </Badge>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Shared Interests */}
//         {sharedTags.length > 0 && (
//           <Card className="border-secondary/20 bg-secondary/5">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2 mb-2">
//                 <Users className="w-4 h-4 text-secondary" />
//                 <p className="font-medium text-secondary">Shared Interests</p>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 You both are interested in {sharedTags.join(', ')}. Great conversation starters!
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Contact Info */}
//         <Card>
//           <CardContent className="p-4 space-y-3">
//             <h3 className="font-medium mb-3">Contact Information</h3>
            
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
//                 <Mail className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <p className="font-medium">{profile.email}</p>
//                 <p className="text-sm text-muted-foreground">Email</p>
//               </div>
//             </div>

//             {profile.linkedin && (
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
//                   <Linkedin className="w-5 h-5 text-blue-500" />
//                 </div>
//                 <div>
//                   <p className="font-medium">{profile.linkedin}</p>
//                   <p className="text-sm text-muted-foreground">LinkedIn</p>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Connect Button */}
//         <div className="space-y-3">
//           <Button onClick={onConnect} className="w-full h-12 bg-primary text-primary-foreground">
//             Send Connection Request
//           </Button>
//           <p className="text-xs text-muted-foreground text-center">
//             They'll receive a notification to accept your connection
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }