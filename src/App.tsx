import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { PaymentProvider } from './context/PaymentContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { DsaPreparation } from './pages/DsaPreparation';
import { Payment } from './pages/Payment';
import { Admin } from './pages/Admin';
import { ForgotPassword } from './pages/ForgotPassword';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <PaymentProvider>
        <Router>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-300">
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dsa" element={<DsaPreparation />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </main>
          </div>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }
            }}
          />
        </Router>
      </PaymentProvider>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
