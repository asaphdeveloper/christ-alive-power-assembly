import { HomePage } from './pages/HomePage/HomePage';
import { BranchPage } from './pages/Branch/BranchPage';
import { PageNotFound } from './pages/PageNotFound';
import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/:expression' element={<BranchPage />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
