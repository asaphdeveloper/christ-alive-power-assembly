import { lazy, Suspense } from 'react';
import { SEO } from './components/SEO';
import { RouteFocus } from './components/RouteFocus';
import { Routes, Route, Navigate } from 'react-router';
import './App.css';

const HomePage = lazy(() => import('./pages/public/HomePage/HomePage').then((module) => ({ default: module.HomePage })));
const PageNotFound = lazy(() => import('./pages/PageNotFound').then((module) => ({ default: module.PageNotFound })));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage').then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('./pages/Auth/SignupPage').then((module) => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage').then((module) => ({ default: module.ForgotPasswordPage })));

function App() {
  return (
    <>
      <SEO />
      <RouteFocus />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Suspense fallback={<main id="main-content" tabIndex={-1} aria-busy="true" className="route-loading"><span className="sr-only">Loading page…</span></main>}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='/auth' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
