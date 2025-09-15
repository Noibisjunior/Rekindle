import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import EmailSignup from "./components/onboarding/EmailSignup";
import VerifyEmail from "./components/onboarding/verify-email";
import Login from "./components/onboarding/Login";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import ProfileSetup from "./components/onboarding/ProfileSetup";
import HomeScreen from "./components/home/HomeScreen";
import ForgotPassword from "./components/onboarding/forgotPassword";
import ResetPassword from "./components/onboarding/resetPassword";

import ConnectionsPage from "./components/connections/ConnectionsPage";
import MyQRCodePage from "./components/connections/MyQRCodePage";
import ScanQRPage from "./components/connections/ScanQRPage";
import ConnectionDetailPage from "./components/connections/ConnectionDetailPage";

import ReminderSetup from "./components/reminders/ReminderSetup";
import ReminderConfirmation from "./components/reminders/ReminderConfirmation";

export interface UserProfile {
  id: string;
  name: string;
  photo?: string;
}

function App() {
  const [user, setUser] = useState<UserProfile | null>({
    id: "1",
    name: "John Doe",
    photo: undefined,
  });

  return (
    <Router>
      <Routes>
        {/* ONBOARDING */}
        <Route path="/" element={<WelcomeScreenWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROFILE & HOME */}
        <Route path="/profile" element={<ProfileSetupWrapper />} />
        <Route
          path="/home"
          element={
            <HomeScreen
              onViewConnections={() => navigateTo("/connections")}
              onEditProfile={() => navigateTo("/profile")}
            />
          }
        />

        {/* CONNECTIONS */}
        <Route path="/connections" element={<ConnectionsPage user={user!} />} />
        <Route path="/my-qrcode" element={<MyQRCodePage />} />
        <Route path="/connections/:id" element={<ConnectionDetailPage />} />
        <Route path="/u/:code" element={<ScanQRPage />} />

        {/* REMINDERS */}
        <Route path="/reminder" element={<ReminderSetupWrapper />} />
        <Route path="/confirm-reminder" element={<ReminderConfirmationWrapper />} />
      </Routes>
    </Router>
  );
}


function WelcomeScreenWrapper() {
  const navigate = useNavigate();
  return <WelcomeScreen onGetStarted={() => navigate("/signup")} />;
}

function SignupWrapper() {
  const navigate = useNavigate();
  return <EmailSignup onContinue={() => navigate("/profile")} />;
}

function ProfileSetupWrapper() {
  const navigate = useNavigate();
  return <ProfileSetup onComplete={() => navigate("/home")} />;
}

function ReminderSetupWrapper() {
  const navigate = useNavigate();
  // retrieve connection from navigation state
  const { state } = useLocation();
  const connection = state?.connection;
  
  if (!connection) {
    // No connection was passed, redirect user back
    navigate("/connections");
    return null;
  }

  return (
    <ReminderSetup
      connection={connection}
      onConfirm={(reminder) => navigate("/confirm-reminder", { state: { reminder } })}
      onCancel={() => navigate(-1)}
    />
  );
}

function ReminderConfirmationWrapper() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reminder = state?.reminder;

  return (
    <ReminderConfirmation
      reminder={reminder}
      onDone={() => navigate("/connections")}
      onEdit={() => navigate(-1)}
    />
  );
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default App;
