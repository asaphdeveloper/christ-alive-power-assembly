import { lazy, Suspense } from 'react';
import { SEO } from './components/SEO';
import { RouteFocus } from './components/RouteFocus';
import { Routes, Route } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { RequireRole } from './auth/RequireRole';
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
          <Route
            path='admin/developer/overview'
            element={
              <RequireRole roles={['developer']}>
                <AdminPortalPage />
              </RequireRole>
            }
          >
            <Route index element={<DeveloperOverviewPage />} />
          </Route>
          <Route
            path='admin/all-admins'
            element={
              <RequireRole roles={['developer']}>
                <DeveloperSubpageLayout pageTitle='Administrators'>
                  <AdminsPage />
                </DeveloperSubpageLayout>
              </RequireRole>
            }
          />
          <Route
            path='admin/branches'
            element={
              <RequireRole roles={['developer']}>
                <DeveloperSubpageLayout pageTitle='Branches'>
                  <BranchesPage />
                </DeveloperSubpageLayout>
              </RequireRole>
            }
          />
          <Route
            path='admin/settings'
            element={
              <RequireRole roles={['developer']}>
                <AdminSettingsPage />
              </RequireRole>
            }
          />
          <Route
            path='admin/general-overseer'
            element={
              <RequireRole roles={['general-overseer']}>
                <GeneralOverseerOverviewPage />
              </RequireRole>
            }
          />
          <Route
            path='admin/attendance-overview'
            element={
              <RequireRole roles={['general-overseer']}>
                <GeneralOverseerAttendancePage />
              </RequireRole>
            }
          />
          <Route
            path='admin/attendance-reports'
            element={
              <RequireRole roles={['general-overseer']}>
                <AttendanceReportsPage />
              </RequireRole>
            }
          />
          <Route
            path='admin/branch-media-admin'
            element={
              <RequireRole roles={['branch-media-admin']}>
                <BranchMediaOverviewPage />
              </RequireRole>
            }
          />
          <Route
            path='admin/branch-media-admin/attendance'
            element={
              <RequireRole roles={['branch-media-admin']}>
                <AttendancePage
                  user={{ name: 'Branch Media Admin', branch: 'Bauchi Branch' }}
                />
              </RequireRole>
            }
          />
          <Route
            path='admin/branch-media-admin/visitors'
            element={
              <RequireRole roles={['branch-media-admin']}>
                <VisitorsPage />
              </RequireRole>
            }
          />
          <Route
            path='admin/upload-resource'
            element={
              <RequireRole roles={['headquater-media-admin']}>
                <HeadquaterMediaAdminPage />
              </RequireRole>
            }
          />
          <Route
            path='admin/headquater-media-admin/overview'
            element={
              <RequireRole roles={['headquater-media-admin']}>
                <HeadquaterOverviewPage />
              </RequireRole>
            }
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
