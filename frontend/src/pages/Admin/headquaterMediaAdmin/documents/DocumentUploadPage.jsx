import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { AdminLayout } from '../../AdminLayout';
import './DocumentUploadPage.css';

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(event) {
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  return (
    <AdminLayout workspace='headquater-media-admin' pageTitle='Upload documents'>
      <section className='document-upload-page' aria-labelledby='document-upload-title'>
        <header className='document-upload-heading'>
          <p>HEADQUATER MEDIA</p>
          <h1 id='document-upload-title'>Upload documents</h1>
          <span>Choose a document to prepare it for upload.</span>
        </header>
        <label className='document-upload-dropzone'>
          <input
            type='file'
            accept='.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx'
            onChange={handleFileChange}
          />
          <Upload size={24} aria-hidden='true' />
          <strong>Choose a document</strong>
          <span>PDF, Word, PowerPoint, or Excel</span>
        </label>
        {selectedFile && (
          <div className='document-upload-selected' role='status'>
            <FileText size={20} aria-hidden='true' />
            <span>
              <strong>{selectedFile.name}</strong>
              <small>{formatFileSize(selectedFile.size)}</small>
            </span>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
