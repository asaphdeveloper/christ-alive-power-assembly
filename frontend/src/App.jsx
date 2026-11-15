import { lazy, Suspense } from 'react';
import { SEO } from './components/SEO';
import { RouteFocus } from './components/RouteFocus';
import { Routes, Route } from 'react-router';
import './App.css';

const HomePage = lazy(() =>
  import('./pages/public/HomePage/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);
const AdminPortalPage = lazy(() =>
  import('./pages/Admin/AdminPortalPage').then((module) => ({
    default: module.AdminPortalPage,
  })),
);
const DeveloperSubpageLayout = lazy(() =>
  import('./pages/Admin/AdminPortalPage').then((module) => ({
    default: module.DeveloperSubpageLayout,
  })),
);
const DeveloperOverviewPage = lazy(() =>
  import('./pages/Admin/developer/DeveloperOverviewPage').then((module) => ({
    default: module.DeveloperOverviewPage,
  })),
);
const GeneralOverseerPage = lazy(() =>
  import('./pages/Admin/generalOverseer/GeneralOverseerPage').then(
    (module) => ({ default: module.GeneralOverseerPage }),
  ),
);
const GeneralOverseerAttendancePage = lazy(() =>
  import('./pages/Admin/generalOverseer/attendance/AttendancePage').then(
    (module) => ({ default: module.GeneralOverseerAttendancePage }),
  ),
);
const GeneralOverseerFinancePage = lazy(() =>
  import('./pages/Admin/generalOverseer/finance/FinancePage').then(
    (module) => ({ default: module.GeneralOverseerFinancePage }),
  ),
);
const BranchMediaAdminPage = lazy(() =>
  import('./pages/Admin/branchMediaAdmin/BranchMediaAdminPage').then(
    (module) => ({ default: module.BranchMediaAdminPage }),
  ),
);
const AttendancePage = lazy(() =>
  import('./pages/Admin/branchMediaAdmin/attendancePage').then((module) => ({
    default: module.AttendancePage,
  })),
);
const VisitorsPage = lazy(() =>
  import('./pages/Admin/branchMediaAdmin/VisitorsPage').then((module) => ({
    default: module.VisitorsPage,
  })),
);
const BranchFinanceSecretaryPage = lazy(() =>
  import('./pages/Admin/branchFinanceSecretary/BranchFinanceSecretaryPage').then(
    (module) => ({ default: module.BranchFinanceSecretaryPage }),
  ),
);
const HeadquaterMediaAdminPage = lazy(() =>
  import('./pages/Admin/headquaterMediaAdmin/HeadquaterMediaAdminPage').then(
    (module) => ({ default: module.HeadquaterMediaAdminPage }),
  ),
);
const HeadquaterOverviewPage = lazy(() =>
  import('./pages/Admin/headquaterMediaAdmin/HeadquaterOverviewPage').then(
    (module) => ({ default: module.HeadquaterOverviewPage }),
  ),
);
const DocumentUploadPage = lazy(() =>
  import('./pages/Admin/headquaterMediaAdmin/documents/DocumentUploadPage').then(
    (module) => ({ default: module.DocumentUploadPage }),
  ),
);
const AdminsPage = lazy(() =>
  import('./pages/Admin/developer/pages/admins/AdminsPage').then((module) => ({
    default: module.AdminsPage,
  })),
);
const BranchesPage = lazy(() =>
  import('./pages/Admin/developer/pages/branches/BranchesPage').then(
    (module) => ({ default: module.BranchesPage }),
  ),
);
const PageNotFound = lazy(() =>
  import('./pages/PageNotFound').then((module) => ({
    default: module.PageNotFound,
  })),
);

function App() {
  return (
    <>
      <SEO />
      <RouteFocus />
      <a className='skip-link' href='#main-content'>
        Skip to main content
      </a>
      <Suspense
        fallback={
          <main
            id='main-content'
            tabIndex={-1}
            aria-busy='true'
            className='route-loading'
          >
            <span className='sr-only'>Loading page…</span>
          </main>
        }
      >
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='admin/developer' element={<AdminPortalPage />}>
            <Route index element={<DeveloperOverviewPage />} />
            <Route path='overview' element={<DeveloperOverviewPage />} />
          </Route>
          <Route
            path='admin/all-admins'
            element={
              <DeveloperSubpageLayout pageTitle='Administrators'>
                <AdminsPage />
              </DeveloperSubpageLayout>
            }
          />
          <Route
            path='admin/branches'
            element={
              <DeveloperSubpageLayout pageTitle='Branches'>
                <BranchesPage />
              </DeveloperSubpageLayout>
            }
          />
          <Route
            path='admin/general-overseer'
            element={<GeneralOverseerPage />}
          />
          <Route
            path='admin/general-overseer/attendance'
            element={<GeneralOverseerAttendancePage />}
          />
          <Route
            path='admin/general-overseer/finance'
            element={<GeneralOverseerFinancePage />}
          />
          <Route
            path='admin/branch-media-admin'
            element={<BranchMediaAdminPage />}
          />
          <Route
            path='admin/branch-media-admin/attendance'
            element={
              <AttendancePage
                user={{ name: 'Branch Media Admin', branch: 'Bauchi Branch' }}
              />
            }
          />
          <Route
            path='admin/branch-media-admin/visitors'
            element={<VisitorsPage />}
          />
          <Route
            path='admin/branch-finance-secretary'
            element={<BranchFinanceSecretaryPage />}
          />
          <Route
            path='admin/upload-resource'
            element={<HeadquaterMediaAdminPage />}
          />
          <Route
            path='admin/headquater-media-admin/overview'
            element={<HeadquaterOverviewPage />}
          />
          <Route
            path='admin/headquater-media-admin/documents'
            element={<DocumentUploadPage />}
          />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
