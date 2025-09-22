// import  { useState, useEffect } from 'react';

// // Import the real component
// import WelcomeScreen from './components/onboarding/WelcomeScreen';

// export default function DebugApp() {
//   console.log('🚀 DebugApp component is rendering...');
  
//   const [currentScreen, setCurrentScreen] = useState('welcome');
  
//   useEffect(() => {
//     console.log('✅ DebugApp useEffect ran, currentScreen:', currentScreen);
//   }, [currentScreen]);

//   console.log('📱 About to render WelcomeScreen...');

//   const handleGetStarted = () => {
//     console.log('🎯 Get Started clicked!');
//     setCurrentScreen('login');
//   };

//   try {
//     return (
//       <div style={{ minHeight: '100vh' }}>
//         <div style={{ 
//           position: 'fixed', 
//           top: 0, 
//           left: 0, 
//           background: 'black', 
//           color: 'white', 
//           padding: '5px 10px',
//           fontSize: '12px',
//           zIndex: 9999 
//         }}>
//           Debug: {currentScreen} | React Working ✅
//         </div>
        
//         <WelcomeScreen onGetStarted={handleGetStarted} />
//       </div>
//     );
//   } catch (error) {
//     console.error('❌ Error rendering:', error);
//     return (
//       <div style={{ 
//         minHeight: '100vh', 
//         backgroundColor: '#8B2635',
//         color: 'white',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontFamily: 'system-ui'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>NetConnect</h1>
//           <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Error: {String(error)}</p>
//         </div>
//       </div>
//     );
//   }
// }
