import { lazy, Suspense } from 'react';
import { SEO } from './components/SEO';
import { RouteFocus } from './components/RouteFocus';
import { Routes, Route } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import './App.css';

const HomePage = lazy(() =>
  import('./pages/public/HomePage/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({
    default: module.LoginPage,
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
const GeneralOverseerOverviewPage = lazy(() =>
  import('./pages/Admin/generalOverseer/GeneralOverseerOverviewPage').then(
    (module) => ({ default: module.GeneralOverseerOverviewPage }),
  ),
);
const GeneralOverseerAttendancePage = lazy(() =>
  import('./pages/Admin/shared/attendanceOverview/AttendancePage').then(
    (module) => ({ default: module.GeneralOverseerAttendancePage }),
  ),
);
const AttendanceReportsPage = lazy(() =>
  import('./pages/Admin/shared/AttendanceReportsPage').then((module) => ({
    default: module.AttendanceReportsPage,
  })),
);
const BranchMediaOverviewPage = lazy(() =>
  import('./pages/Admin/branchMediaAdmin/BranchMediaOverviewPage').then(
    (module) => ({ default: module.BranchMediaOverviewPage }),
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
const BranchFinanceSecretaryOverviewPage = lazy(() =>
  import('./pages/Admin/branchFinanceSecretary/BranchFinanceSecretaryOverviewPage').then(
    (module) => ({ default: module.BranchFinanceSecretaryOverviewPage }),
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
const AdminsPage = lazy(() =>
  import('./pages/Admin/shared/admins/AdminsPage').then((module) => ({
    default: module.AdminsPage,
  })),
);
const AdminSettingsPage = lazy(() =>
  import('./pages/Admin/AdminSettingsPage').then((module) => ({
    default: module.AdminSettingsPage,
  })),
);
const BranchesPage = lazy(() =>
  import('./pages/Admin/shared/branches/BranchesPage').then(
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
    <AuthProvider>
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
            <Route path='login' element={<LoginPage />} />
            <Route element={<RequireAuth />}>
          <Route path='admin/developer/overview' element={<AdminPortalPage />}>
            <Route index element={<DeveloperOverviewPage />} />
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
          <Route path='admin/settings' element={<AdminSettingsPage />} />
          <Route
            path='admin/general-overseer'
            element={<GeneralOverseerOverviewPage />}
          />
          <Route
            path='admin/attendance-overview'
            element={<GeneralOverseerAttendancePage />}
          />
          <Route
            path='admin/attendance-reports'
            element={<AttendanceReportsPage />}
          />
          <Route
            path='admin/branch-media-admin'
            element={<BranchMediaOverviewPage />}
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
            element={<BranchFinanceSecretaryOverviewPage />}
          />
          <Route
            path='admin/upload-resource'
            element={<HeadquaterMediaAdminPage />}
          />
          <Route
            path='admin/headquater-media-admin/overview'
            element={<HeadquaterOverviewPage />}
          />
            </Route>
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </>
    </AuthProvider>
  );
}

export default App;
