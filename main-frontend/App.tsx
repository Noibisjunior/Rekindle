import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/onboarding/WelcomeScreen';
import Login from './components/onboarding/Login';
import EmailSignup from './components/onboarding/EmailSignup';
import ProfileSetup from './components/onboarding/ProfileSetup';
import HomeScreen from './components/home/HomeScreen';
import QRScanner from './components/home/QRScanner';
import ProfilePreview from './components/home/ProfilePreview';
import PendingConnection from './components/home/PendingConnection';
import ConnectionsList from './components/connections/ConnectionsList';
import ConnectionDetail from './components/connections/ConnectionDetail';
import ReminderSetup from './components/reminders/ReminderSetup';
import ReminderConfirmation from './components/reminders/ReminderConfirmation';
import OfflineMode from './components/system/OfflineMode';
import ErrorScreen from './components/system/ErrorScreen';

export type Screen = 
  | 'welcome'
  | 'login'
  | 'email-signup'
  | 'profile-setup'
  | 'home'
  | 'qr-scanner'
  | 'profile-preview'
  | 'pending-connection'
  | 'connections-list'
  | 'connection-detail'
  | 'reminder-setup'
  | 'reminder-confirmation'
  | 'offline-mode'
  | 'error';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo?: string;
  linkedin?: string;
  tags: string[];
}

export interface Connection {
  id: string;
  profile: UserProfile;
  connectedAt: Date;
  event?: string;
  status: 'pending' | 'connected' | 'declined';
}

export interface Reminder {
  id: string;
  connectionId: string;
  scheduledFor: Date;
  message: string;
  completed: boolean;
}

export interface AppState {
  currentScreen: Screen;
  user: UserProfile | null;
  connections: Connection[];
  reminders: Reminder[];
  isOnline: boolean;
  error: string | null;
  selectedConnection: Connection | null;
  scannedProfile: UserProfile | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'welcome',
    user: null,
    connections: [],
    reminders: [],
    isOnline: navigator.onLine,
    error: null,
    selectedConnection: null,
    scannedProfile: null,
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigateTo = (screen: Screen) => {
    setState(prev => ({ ...prev, currentScreen: screen, error: null }));
  };

  const setUser = (user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  };

  const handleLogin = () => {
    // Create a mock user profile for login
    const mockUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      tags: ['Technology', 'Networking', 'Business']
    };
    setUser(mockUser);
    navigateTo('home');
  };

  const addConnection = (connection: Connection) => {
    setState(prev => ({
      ...prev,
      connections: [...prev.connections, connection]
    }));
  };

  const updateConnection = (connectionId: string, updates: Partial<Connection>) => {
    setState(prev => ({
      ...prev,
      connections: prev.connections.map(conn =>
        conn.id === connectionId ? { ...conn, ...updates } : conn
      )
    }));
  };

  const setSelectedConnection = (connection: Connection | null) => {
    setState(prev => ({ ...prev, selectedConnection: connection }));
  };

  const setScannedProfile = (profile: UserProfile | null) => {
    setState(prev => ({ ...prev, scannedProfile: profile }));
  };

  const addReminder = (reminder: Reminder) => {
    setState(prev => ({
      ...prev,
      reminders: [...prev.reminders, reminder]
    }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  // Show offline mode if not online
  if (!state.isOnline && state.currentScreen !== 'offline-mode') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <OfflineMode 
            onRetry={() => navigateTo(state.currentScreen)}
            connections={state.connections}
          />
        </div>
      </div>
    );
  }

  // Show error screen if there's an error
  if (state.error && state.currentScreen !== 'error') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorScreen 
            error={state.error}
            onRetry={() => setError(null)}
            onHome={() => navigateTo('home')}
          />
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => navigateTo('login')} />;
      
      case 'login':
        return <Login 
          onLogin={handleLogin}
          onSignUp={() => navigateTo('email-signup')}
          onBack={() => navigateTo('welcome')}
        />;
      
      case 'email-signup':
        return <EmailSignup onContinue={() => navigateTo('profile-setup')} />;
      
      case 'profile-setup':
        return <ProfileSetup onComplete={(user) => {
          setUser(user);
          navigateTo('home');
        }} />;
      
      case 'home':
        return <HomeScreen 
          user={state.user}
          onScanQR={() => navigateTo('qr-scanner')}
          onViewConnections={() => navigateTo('connections-list')}
          onEditProfile={() => navigateTo('profile-setup')}
        />;
      
      case 'qr-scanner':
        return <QRScanner 
          onScanSuccess={(profile) => {
            setScannedProfile(profile);
            navigateTo('profile-preview');
          }}
          onError={(error) => setError(error)}
          onBack={() => navigateTo('home')}
        />;
      
      case 'profile-preview':
        return <ProfilePreview 
          profile={state.scannedProfile!}
          onConnect={() => navigateTo('pending-connection')}
          onBack={() => navigateTo('qr-scanner')}
        />;
      
      case 'pending-connection':
        return <PendingConnection 
          profile={state.scannedProfile!}
          onCancel={() => navigateTo('home')}
          onConnectionAccepted={() => {
            if (state.scannedProfile) {
              const connection: Connection = {
                id: Date.now().toString(),
                profile: state.scannedProfile,
                connectedAt: new Date(),
                status: 'connected'
              };
              addConnection(connection);
              navigateTo('connections-list');
            }
          }}
        />;
      
      case 'connections-list':
        return <ConnectionsList 
          connections={state.connections}
          onSelectConnection={(connection) => {
            setSelectedConnection(connection);
            navigateTo('connection-detail');
          }}
          onBack={() => navigateTo('home')}
        />;
      
      case 'connection-detail':
        return <ConnectionDetail 
          connection={state.selectedConnection!}
          onRemindMe={() => navigateTo('reminder-setup')}
          onBack={() => navigateTo('connections-list')}
        />;
      
      case 'reminder-setup':
        return <ReminderSetup 
          connection={state.selectedConnection!}
          onConfirm={(reminder) => {
            addReminder(reminder);
            navigateTo('reminder-confirmation');
          }}
          onCancel={() => navigateTo('connection-detail')}
        />;
      
      case 'reminder-confirmation':
        return <ReminderConfirmation 
          reminder={state.reminders[state.reminders.length - 1]}
          onEdit={() => navigateTo('reminder-setup')}
          onDone={() => navigateTo('connection-detail')}
        />;
      
      case 'offline-mode':
        return <OfflineMode 
          onRetry={() => navigateTo('home')}
          connections={state.connections}
        />;
      
      case 'error':
        return <ErrorScreen 
          error={state.error!}
          onRetry={() => setError(null)}
          onHome={() => navigateTo('home')}
        />;
      
      default:
        return <WelcomeScreen onGetStarted={() => navigateTo('login')} />;
    }
  };

  // Mobile-first layout for onboarding screens
  if (['welcome', 'login', 'email-signup', 'profile-setup'].includes(state.currentScreen)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-md px-4 sm:px-6">
          {renderScreen()}
        </div>
      </div>
    );
  }

  // Desktop layout with sidebar for authenticated screens
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - only show for authenticated users */}
        {state.user && (
          <div className="hidden lg:block w-64 xl:w-72 2xl:w-80 border-r border-border bg-card">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg xl:text-xl">NetConnect</h2>
            </div>
            <nav className="p-4 xl:p-6 space-y-2">
              <button
                onClick={() => navigateTo('home')}
                className={`w-full text-left px-3 py-2 xl:px-4 xl:py-3 rounded-lg transition-colors text-sm xl:text-base ${
                  state.currentScreen === 'home' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('connections-list')}
                className={`w-full text-left px-3 py-2 xl:px-4 xl:py-3 rounded-lg transition-colors text-sm xl:text-base ${
                  ['connections-list', 'connection-detail'].includes(state.currentScreen) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
              >
                Connections
              </button>
              <button
                onClick={() => navigateTo('qr-scanner')}
                className={`w-full text-left px-3 py-2 xl:px-4 xl:py-3 rounded-lg transition-colors text-sm xl:text-base ${
                  ['qr-scanner', 'profile-preview', 'pending-connection'].includes(state.currentScreen) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
              >
                Scan QR
              </button>
            </nav>
          </div>
        )}
        
        {/* Main content area - responsive width */}
        <div className="flex-1 min-w-0">
          <div className="h-full">
            {/* Mobile/tablet: constrained width, Desktop: full width */}
            <div className="lg:h-full">
              {renderScreen()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}