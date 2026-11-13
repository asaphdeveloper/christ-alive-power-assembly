import { lazy, Suspense } from 'react';
import { SEO } from './components/SEO';
import { RouteFocus } from './components/RouteFocus';
import { Routes, Route } from 'react-router';
import './App.css';

const HomePage = lazy(() => import('./pages/public/HomePage/HomePage').then((module) => ({ default: module.HomePage })));
const AdminPortalPage = lazy(() => import('./pages/Admin/AdminPortalPage').then((module) => ({ default: module.AdminPortalPage })));
const GeneralOverseerPage = lazy(() => import('./pages/Admin/generalOverseer/GeneralOverseerPage').then((module) => ({ default: module.GeneralOverseerPage })));
const GeneralOverseerAttendancePage = lazy(() => import('./pages/Admin/generalOverseer/attendance/AttendancePage').then((module) => ({ default: module.GeneralOverseerAttendancePage })));
const GeneralOverseerFinancePage = lazy(() => import('./pages/Admin/generalOverseer/finance/FinancePage').then((module) => ({ default: module.GeneralOverseerFinancePage })));
const BranchMediaAdminPage = lazy(() => import('./pages/Admin/branchMediaAdmin/BranchMediaAdminPage').then((module) => ({ default: module.BranchMediaAdminPage })));
const AttendancePage = lazy(() => import('./pages/Admin/branchMediaAdmin/attendancePage').then((module) => ({ default: module.AttendancePage })));
const BranchFinanceSecretaryPage = lazy(() => import('./pages/Admin/branchFinanceSecretary/BranchFinanceSecretaryPage').then((module) => ({ default: module.BranchFinanceSecretaryPage })));
const HeadquaterMediaAdminPage = lazy(() => import('./pages/Admin/headquaterMediaAdmin/HeadquaterMediaAdminPage').then((module) => ({ default: module.HeadquaterMediaAdminPage })));
const DocumentUploadPage = lazy(() => import('./pages/Admin/headquaterMediaAdmin/documents/DocumentUploadPage').then((module) => ({ default: module.DocumentUploadPage })));
const AdminsPage = lazy(() => import('./pages/Admin/developer/pages/admins/AdminsPage').then((module) => ({ default: module.AdminsPage })));
const BranchesPage = lazy(() => import('./pages/Admin/developer/pages/branches/BranchesPage').then((module) => ({ default: module.BranchesPage })));
const PageNotFound = lazy(() => import('./pages/PageNotFound').then((module) => ({ default: module.PageNotFound })));

function App() {
  return (
    <>
      <SEO />
      <RouteFocus />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Suspense fallback={<main id="main-content" tabIndex={-1} aria-busy="true" className="route-loading"><span className="sr-only">Loading page…</span></main>}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="admin/developer" element={<AdminPortalPage />}>
            <Route index element={<AdminsPage />} />
            <Route path="admins" element={<AdminsPage />} />
            <Route path="branches" element={<BranchesPage />} />
          </Route>
          <Route path="admin/general-overseer" element={<GeneralOverseerPage />} />
          <Route path="admin/general-overseer/attendance" element={<GeneralOverseerAttendancePage />} />
          <Route path="admin/general-overseer/finance" element={<GeneralOverseerFinancePage />} />
          <Route path="admin/branch-media-admin" element={<BranchMediaAdminPage />} />
          <Route path="admin/branch-media-admin/attendance" element={<AttendancePage user={{ name: 'Branch Media Admin', branch: 'Bauchi Branch' }} />} />
          <Route path="admin/branch-finance-secretary" element={<BranchFinanceSecretaryPage />} />
          <Route path="admin/headquater-media-admin" element={<HeadquaterMediaAdminPage />} />
          <Route path="admin/headquater-media-admin/documents" element={<DocumentUploadPage />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
