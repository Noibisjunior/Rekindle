import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ArrowLeft, Search, Filter, Users, Calendar } from 'lucide-react';
import { Connection } from '../../App';

interface ConnectionsListProps {
  connections: Connection[];
  onSelectConnection: (connection: Connection) => void;
  onBack: () => void;
}

const FILTER_OPTIONS = ['All', 'Recent', 'Events', 'Technology', 'Marketing'];

export default function ConnectionsList({ 
  connections, 
  onSelectConnection, 
  onBack 
}: ConnectionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Mock connections if empty
  const mockConnections: Connection[] = connections.length === 0 ? [
    {
      id: '1',
      profile: {
        id: '1',
        name: 'Sarah Adams',
        email: 'sarah.adams@techstart.io',
        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612e775?w=100&h=100&fit=crop&crop=face',
        tags: ['Technology', 'Startup'],
      },
      connectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      event: 'Tech Conference 2024',
      status: 'connected'
    },
    {
      id: '2',
      profile: {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike.j@innovate.com',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        tags: ['Marketing', 'Growth'],
      },
      connectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      event: 'Startup Meetup',
      status: 'connected'
    },
    {
      id: '3',
      profile: {
        id: '3',
        name: 'Emily Chen',
        email: 'emily.chen@designco.com',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        tags: ['Design', 'Product'],
      },
      connectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'connected'
    },
    {
      id: '4',
      profile: {
        id: '4',
        name: 'Alex Rodriguez',
        email: 'alex.r@fintech.com',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        tags: ['Finance', 'Technology'],
      },
      connectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      event: 'FinTech Summit',
      status: 'connected'
    },
    {
      id: '5',
      profile: {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.wang@healthtech.io',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        tags: ['Healthcare', 'AI/ML'],
      },
      connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: 'connected'
    },
    {
      id: '6',
      profile: {
        id: '6',
        name: 'David Kim',
        email: 'david.kim@consulting.co',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
        tags: ['Consulting', 'Strategy'],
      },
      connectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      event: 'Business Forum',
      status: 'connected'
    }
  ] : connections;

  const filteredConnections = mockConnections.filter(connection => {
    const matchesSearch = connection.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.profile.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Recent') {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      return matchesSearch && connection.connectedAt > twoDaysAgo;
    }
    if (selectedFilter === 'Events') {
      return matchesSearch && connection.event;
    }
    
    return matchesSearch && connection.profile.tags.includes(selectedFilter);
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between py-4 lg:py-6 xl:py-8">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-medium text-lg lg:text-xl xl:text-2xl">Connections</h2>
            </div>
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Users className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-muted-foreground" />
              <span className="text-sm lg:text-base xl:text-lg text-muted-foreground">{mockConnections.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 lg:py-6 xl:py-8 space-y-4 lg:space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 lg:pl-12 xl:pl-14 h-10 lg:h-12 xl:h-14 text-sm lg:text-base xl:text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2 lg:space-x-3 xl:space-x-4 overflow-x-auto lg:overflow-visible lg:flex-wrap">
            {FILTER_OPTIONS.map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap px-3 py-1 lg:px-4 lg:py-2 xl:px-6 xl:py-3 text-xs lg:text-sm xl:text-base ${
                  selectedFilter === filter 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Connections Grid/List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8 xl:py-12">
        {filteredConnections.length === 0 ? (
          <Card>
            <CardContent className="p-8 lg:p-12 xl:p-16 text-center">
              <Users className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-muted-foreground mx-auto mb-4 lg:mb-6" />
              <h3 className="font-medium text-base lg:text-lg xl:text-xl mb-2 lg:mb-4">No connections found</h3>
              <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms' : 'Start scanning QR codes to build your network'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredConnections.map((connection) => (
              <Card 
                key={connection.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectConnection(connection)}
              >
                <CardContent className="p-4 lg:p-6 xl:p-8">
                  <div className="flex items-start space-x-3 lg:space-x-4 xl:space-x-6">
                    <Avatar className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex-shrink-0">
                      <AvatarImage src={connection.profile.photo} />
                      <AvatarFallback className="text-xs lg:text-sm xl:text-base">
                        {connection.profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 lg:mb-2 xl:mb-3">
                        <h4 className="font-medium truncate text-sm lg:text-base xl:text-lg">{connection.profile.name}</h4>
                        <span className="text-xs lg:text-sm xl:text-base text-muted-foreground whitespace-nowrap ml-2">
                          {formatDate(connection.connectedAt)}
                        </span>
                      </div>
                      
                      <p className="text-xs lg:text-sm xl:text-base text-muted-foreground truncate mb-2 lg:mb-3 xl:mb-4">
                        {connection.profile.email}
                      </p>
                      
                      {connection.event && (
                        <div className="flex items-center space-x-1 lg:space-x-2 mb-2 lg:mb-3 xl:mb-4">
                          <Calendar className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-muted-foreground" />
                          <span className="text-xs lg:text-sm xl:text-base text-muted-foreground truncate">{connection.event}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 lg:gap-2 xl:gap-3">
                        {connection.profile.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs lg:text-sm xl:text-base">
                            {tag}
                          </Badge>
                        ))}
                        {connection.profile.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs lg:text-sm xl:text-base">
                            +{connection.profile.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}