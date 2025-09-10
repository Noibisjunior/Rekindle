import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export interface UserProfile {
  id: string;
  name: string;
  photo?: string;
}

const mockUser: UserProfile = {
  id: "1",
  name: "John Doe",
  photo: undefined,
};

function App() {
  const handleScanQR = async () => {
    // For now, prompt user to type code (replace with real QR scanner later)
    const code = window.prompt("Enter QR code:");
    if (!code) return;

    try {
      const res = await fetch(`http://localhost:4000/v1/connect/${code}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to connect");
        return;
      }

      alert("Connection request sent!");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen onGetStarted={() => { window.location.href = "/signup"; }} />} />
        <Route path="/signup" element={<EmailSignup onContinue={() => { window.location.href = "/profile"; }} />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/connections" element={<ConnectionsPage user={mockUser} />} />
          <Route path="/my-qrcode" element={<MyQRCodePage />} />
          <Route path="/u/:code" element={<ScanQRPage />} />
        <Route path="/profile" element={<ProfileSetup onComplete={() => { window.location.href = "/home"; }} />} />
        <Route path="/home" element={
          <HomeScreen
            user={mockUser}
             onScanQR={handleScanQR}
      onViewConnections={() => (window.location.href = "/connections")}
      onEditProfile={() => (window.location.href = "/profile")}
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
