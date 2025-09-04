import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmailSignup from "./components/onboarding/EmailSignup";
import VerifyEmail from "./components/onboarding/verify-email";
import Login from "./components/onboarding/Login";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import ProfileSetup from "./components/onboarding/ProfileSetup";
import HomeScreen from "./components/home/HomeScreen";
import ForgotPassword from "./components/onboarding/forgotPassword";
import ResetPassword from "./components/onboarding/resetPassword";


export interface UserProfile {
  name: string;
  photo?: string;
}

const mockUser: UserProfile = {
  name: "John Doe",
  photo: undefined,
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen onGetStarted={() => { window.location.href = "/signup"; }} />} />
        <Route path="/signup" element={<EmailSignup onContinue={() => { window.location.href = "/profile"; }} />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<ProfileSetup onComplete={() => { window.location.href = "/home"; }} />} />
        <Route path="/home" element={
          <HomeScreen
            user={mockUser}
            onScanQR={() => alert("Scan QR clicked")}
            onViewConnections={() => alert("View Connections clicked")}
            onEditProfile={() => alert("Edit Profile clicked")}
          />
        } /> 
        <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
