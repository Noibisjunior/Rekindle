// import { Button } from '../ui/button';
// import { Card, CardContent } from '../ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { WifiOff, RefreshCw, Users } from 'lucide-react';

// interface OfflineModeProps {
//   onRetry: () => void;
//   connections: Connection[];
// }

// export default function OfflineMode({ onRetry, connections }: OfflineModeProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Offline Banner */}
//       <div className="bg-destructive text-destructive-foreground p-4 text-center">
//         <div className="flex items-center justify-center space-x-2">
//           <WifiOff className="w-4 h-4" />
//           <span className="text-sm font-medium">You're offline</span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         {/* Main Message */}
//         <Card className="mb-6">
//           <CardContent className="p-8 text-center">
//             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//               <WifiOff className="w-8 h-8 text-muted-foreground" />
//             </div>
//             <h2 className="text-xl font-semibold mb-2">Limited Functionality</h2>
//             <p className="text-muted-foreground mb-6">
//               Some features are unavailable while offline. You can still view your saved connections.
//             </p>
//             <Button onClick={onRetry} className="w-full">
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Cached Connections */}
//         {connections.length > 0 && (
//           <div>
//             <div className="flex items-center space-x-2 mb-4">
//               <Users className="w-5 h-5 text-muted-foreground" />
//               <h3 className="font-medium">Cached Connections</h3>
//             </div>
            
//             <div className="space-y-3">
//               {connections.slice(0, 5).map((connection) => (
//                 <Card key={connection.id} className="opacity-75">
//                   <CardContent className="p-4">
//                     <div className="flex items-center space-x-3">
//                       <Avatar className="w-10 h-10">
//                         <AvatarImage src={connection.profile.photo} />
//                         <AvatarFallback className="text-xs">
//                           {connection.profile.name.split(' ').map(n => n[0]).join('')}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1">
//                         <p className="font-medium">{connection.profile.name}</p>
//                         <p className="text-sm text-muted-foreground">{connection.profile.email}</p>
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Cached
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
              
//               {connections.length > 5 && (
//                 <p className="text-sm text-muted-foreground text-center">
//                   +{connections.length - 5} more connections available offline
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Unavailable Features */}
//         <Card className="mt-6 border-muted">
//           <CardContent className="p-4">
//             <h3 className="font-medium mb-3">Unavailable Offline</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>• QR code scanning</li>
//               <li>• Sending connection requests</li>
//               <li>• Syncing new connections</li>
//               <li>• Push notifications</li>
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }