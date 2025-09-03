import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmailSignup from "./components/onboarding/EmailSignup";
import Login from "./components/onboarding/Login";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import ProfileSetup from "./components/onboarding/ProfileSetup";
import HomeScreen from "./components/home/HomeScreen";

// Example user profile type and placeholder user
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<EmailSignup onContinue={() => { window.location.href = "/profile"; }} />} />
        <Route path="/profile" element={<ProfileSetup onComplete={() => { window.location.href = "/home"; }} />} />
        <Route path="/home" element={
          <HomeScreen
            user={mockUser}
            onScanQR={() => alert("Scan QR clicked")}
            onViewConnections={() => alert("View Connections clicked")}
            onEditProfile={() => alert("Edit Profile clicked")}
          />
        } /> 
      </Routes>
    </Router>
  );
}

export default App;
