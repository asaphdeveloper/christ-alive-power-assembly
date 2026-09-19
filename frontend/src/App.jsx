import { HomePage } from './pages/HomePage/HomePage';
import { PageNotFound } from './pages/PageNotFound';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/auth' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
