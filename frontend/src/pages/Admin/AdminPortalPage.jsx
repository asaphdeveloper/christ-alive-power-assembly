import './AdminPortalPage.css';

const pageNames = {
  'general-overseer': 'General Overseer',
  'headquarters-admin': 'Headquarters',
  'jos-branch-admin': 'Jos Branch',
};

export function AdminPortalPage({ adminType }) {
  return (
    <main className="admin-simple-page" id="main-content" tabIndex={-1}>
      <h1>{pageNames[adminType]}</h1>
    </main>
  );
}
