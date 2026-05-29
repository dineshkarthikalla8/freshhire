import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { PaymentProvider } from './context/PaymentContext';
import { AuthProvider } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import { MarketingLayout } from './components/layout/MarketingLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

const Home = lazy(() => import('./pages/Home.tsx'));
const DashboardHome = lazy(() => import('./pages/DashboardHome.tsx'));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Practice = lazy(() => import('./pages/Practice').then((module) => ({ default: module.Practice })));
const Admin = lazy(() => import('./pages/Admin').then((module) => ({ default: module.Admin })));
const ResumeScan = lazy(() => import('./pages/ResumeScan').then((module) => ({ default: module.ResumeScan })));
const Aptitude = lazy(() => import('./pages/Aptitude').then((module) => ({ default: module.Aptitude })));
const Reasoning = lazy(() => import('./pages/Reasoning').then((module) => ({ default: module.Reasoning })));
const Verbal = lazy(() => import('./pages/Verbal').then((module) => ({ default: module.Verbal })));
const InterviewExperiences = lazy(() => import('./pages/InterviewExperiences').then((module) => ({ default: module.InterviewExperiences })));
const TopicStudy = lazy(() => import('./pages/TopicStudy').then((module) => ({ default: module.default })));
const TopicDetail = lazy(() => import('./pages/TopicDetail').then((module) => ({ default: module.default })));
const DsaPreparation = lazy(() => import('./pages/DsaPreparation').then((module) => ({ default: module.DsaPreparation })));

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

const Router = import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <PaymentProvider>
          <Router>
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
              <AnalyticsTracker />
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center">
                    <LoadingSpinner size={56} />
                  </div>
                }
              >
                <Routes>
                  <Route element={<MarketingLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/experiences" element={<InterviewExperiences />} />
                    <Route path="/forgot-password" element={<Navigate to="/login" replace />} />
                  </Route>

                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/dashboard/topic/:topic" element={<TopicStudy />} />
                    <Route path="/dsa" element={<Practice />} />
                    <Route path="/dsa/:topicId" element={<DsaPreparation />} />
                    <Route path="/aptitude" element={<Aptitude />} />
                    <Route path="/reasoning" element={<Reasoning />} />
                    <Route path="/verbal" element={<Verbal />} />
                    <Route path="/resume-scan" element={<ResumeScan />} />
                    <Route path="/study/:topicId" element={<TopicDetail />} />
                  </Route>

                  <Route path="/practice" element={<Navigate to="/dsa" replace />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Suspense>
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </Router>
        </PaymentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
