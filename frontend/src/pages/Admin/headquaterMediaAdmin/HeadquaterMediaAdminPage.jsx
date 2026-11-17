import { ResourceUploadPage } from '../shared/ResourceUploadPage';
import { useAuth } from '../../../auth/useAuth';

export function HeadquaterMediaAdminPage() {
  const { admin } = useAuth();
  const workspace = admin?.role === 'general-overseer'
    ? 'general-overseer'
    : 'headquater-media-admin';
  return <ResourceUploadPage workspace={workspace} />;
}
