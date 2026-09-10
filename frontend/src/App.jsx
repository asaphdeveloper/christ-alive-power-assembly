import { HomePage } from './pages/HomePage/HomePage';
import { BranchPage } from './pages/Branch/BranchPage';
import { PageNotFound } from './pages/PageNotFound';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/auth' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/signup' element={<AuthPage />} />
        <Route path='/forgot-password' element={<AuthPage />} />
        <Route path='/:expression' element={<BranchPage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
