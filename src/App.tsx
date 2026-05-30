import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { StudyContentProvider } from './context/StudyContentContext';
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

type SeoConfig = {
  match: (pathname: string) => boolean;
  title: string;
  description: string;
  keywords: string;
};

const seoConfigs: SeoConfig[] = [
  {
    match: (pathname) => pathname === '/',
    title: 'FreshHire | Fresh Hire DSA, Aptitude, Resume Scanner & Interview Experiences',
    description: 'FreshHire is a free student placement prep platform for fresh hire DSA practice, aptitude, reasoning, ATS resume scoring, verbal ability, and interview experiences.',
    keywords: 'fresh hire, freshhire, FreshHire, DSA practice, aptitude practice, resume scanner, ATS resume scoring, interview experiences, reasoning practice, verbal ability, placement preparation',
  },
  {
    match: (pathname) => pathname === '/login',
    title: 'FreshHire Login | DSA, Aptitude, Resume & Interview Prep',
    description: 'Sign in to FreshHire with Google to track your DSA, aptitude, resume scan, reasoning, and interview prep progress.',
    keywords: 'FreshHire login, fresh hire login, Google sign in, student placement login, interview prep account, campus placement dashboard',
  },
  {
    match: (pathname) => pathname === '/dashboard' || pathname.startsWith('/dashboard/topic/'),
    title: 'FreshHire Dashboard | DSA, Aptitude, Resume Score & Interview Prep',
    description: 'View your placement preparation dashboard with DSA progress, aptitude mastery, reasoning practice, resume score tracking, and interview prep.',
    keywords: 'placement dashboard, DSA progress tracker, aptitude mastery, resume score, reasoning practice, interview prep, student dashboard',
  },
  {
    match: (pathname) => pathname === '/dsa' || pathname.startsWith('/dsa/'),
    title: 'DSA Practice | FreshHire - Fresh Hire Coding Questions',
    description: 'Practice data structures and algorithms for fresh hire and service-based company interviews with topic-wise roadmaps and progress tracking.',
    keywords: 'DSA practice, fresh hire coding questions, coding interview prep, arrays, strings, trees, graphs, dynamic programming, service based company interview questions',
  },
  {
    match: (pathname) => pathname === '/aptitude',
    title: 'Aptitude Practice | FreshHire - Placement Maths and Reasoning',
    description: 'Learn aptitude topics for campus placements with topic-wise practice, formulas, shortcuts, and quick revision notes.',
    keywords: 'aptitude practice, quantitative aptitude, placement aptitude, fresh hire aptitude, formulas, shortcuts, campus interview',
  },
  {
    match: (pathname) => pathname === '/reasoning',
    title: 'Reasoning Practice | FreshHire - Placement Logic Questions',
    description: 'Sharpen logical reasoning for interviews and placement exams with structured topic cards and clear explanations.',
    keywords: 'reasoning practice, logical reasoning, placement reasoning, fresh hire reasoning, puzzles, coding-decoding, syllogism, direction sense',
  },
  {
    match: (pathname) => pathname === '/verbal',
    title: 'Verbal Ability Practice | FreshHire - English for Placements',
    description: 'Improve verbal ability for company interviews and placement tests with grammar, vocabulary, and reading practice.',
    keywords: 'verbal ability, English practice, grammar questions, vocabulary, reading comprehension, placement verbal, fresh hire English',
  },
  {
    match: (pathname) => pathname === '/resume-scan',
    title: 'ATS Resume Scanner | FreshHire - Resume Score for Placements',
    description: 'Scan your resume for ATS keywords, improve formatting, and get actionable suggestions for better placement results.',
    keywords: 'ATS resume scanner, resume keyword checker, resume score, job resume analysis, placement resume tips, fresh hire resume score',
  },
  {
    match: (pathname) => pathname === '/experiences',
    title: 'Interview Experiences | FreshHire - Fresh Hire Interview Stories',
    description: 'Read interview experiences from students for service-based companies and product companies, including rounds, questions, and tips.',
    keywords: 'interview experiences, fresh hire interview stories, company interview rounds, TCS interview experience, Infosys interview experience, Wipro interview experience, Tech Mahindra interview experience',
  },
  {
    match: (pathname) => pathname === '/admin',
    title: 'Admin Portal | FreshHire',
    description: 'Manage FreshHire content, interview experiences, and platform records from the admin portal.',
    keywords: 'admin portal, content management, placement platform admin, FreshHire admin, freshhire admin',
  },
  {
    match: (pathname) => pathname === '/forgot-password',
    title: 'Reset Password | FreshHire',
    description: 'Reset your FreshHire account password and get back to your placement preparation dashboard.',
    keywords: 'reset password, forgot password, FreshHire account recovery, fresh hire password reset',
  },
  {
    match: (pathname) => pathname === '/practice',
    title: 'DSA Practice | FreshHire - Fresh Hire Coding Prep',
    description: 'Practice DSA topics and interview-style problems for placement preparation.',
    keywords: 'DSA practice, coding interview prep, placement coding, fresh hire coding prep',
  },
  {
    match: (pathname) => pathname === '/study' || pathname.startsWith('/study/'),
    title: 'Study Topic Guide | FreshHire',
    description: 'Explore topic-wise formulas, tips, and examples for aptitude and reasoning preparation.',
    keywords: 'study topic guide, aptitude formulas, reasoning tips, placement preparation topics, fresh hire study guide',
  },
];

const applyMeta = (selector: string, value: string, attribute = 'content') => {
  const element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (element) {
    element.setAttribute(attribute, value);
    return;
  }

  if (selector.startsWith('link')) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', value);
    document.head.appendChild(link);
    return;
  }

  const meta = document.createElement('meta');
  const match = selector.match(/(name|property)="([^"]+)"/);
  if (match) {
    meta.setAttribute(match[1], match[2]);
  }
  meta.setAttribute(attribute, value);
  document.head.appendChild(meta);
};

const getSeoConfig = (pathname: string) => seoConfigs.find((entry) => entry.match(pathname)) ?? seoConfigs[0];

const RouteSeoTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoConfig(location.pathname);
    document.title = seo.title;
    applyMeta('meta[name="description"]', seo.description);
    applyMeta('meta[name="keywords"]', seo.keywords);
    applyMeta('meta[property="og:title"]', seo.title);
    applyMeta('meta[property="og:description"]', seo.description);
    applyMeta('meta[name="twitter:title"]', seo.title);
    applyMeta('meta[name="twitter:description"]', seo.description);
    applyMeta('meta[name="author"]', 'FreshHire');
    applyMeta('meta[name="robots"]', 'index, follow');
    applyMeta('link[rel="canonical"]', `https://freshhire.tech${location.pathname}` , 'href');
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <StudyContentProvider>
          <Router>
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
              <RouteSeoTracker />
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
                  <Route path="/experiences/:experienceId" element={<InterviewExperiences />} />
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
        </StudyContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
