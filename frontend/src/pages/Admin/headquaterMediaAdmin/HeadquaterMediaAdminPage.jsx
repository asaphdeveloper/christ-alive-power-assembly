import { AdminLayout } from '../AdminLayout';
import './HeadquaterMediaAdminPage.css';

export function HeadquaterMediaAdminPage() {
  return (
    <AdminLayout workspace='headquater-media-admin' pageTitle='Overview'>
      <section className='headquater-media-admin-page' aria-labelledby='headquater-media-admin-title'>
        <header className='headquater-media-admin-heading'>
          <p>HEADQUATER WORKSPACE</p>
          <h1 id='headquater-media-admin-title'>Headquater Media Admin</h1>
        </header>
      </section>
    </AdminLayout>
  );
}
