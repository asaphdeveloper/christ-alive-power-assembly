import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileText,
  MoreVertical,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import './BranchMediaAdminPage.css';

const initialResources = [
  {
    id: 'sunday-bulletin',
    title: 'Sunday Bulletin',
    description: 'Sunday service bulletin documents.',
    documents: [
      { id: 'sunday-1', name: 'Sunday Bulletin - 9 November 2026.pdf', type: 'PDF', uploadedAt: '9 Nov 2026' },
    ],
  },
  {
    id: 'wednesday-bulletin',
    title: 'Wednesday Bulletin',
    description: 'Wednesday service bulletin documents.',
    documents: [],
  },
  {
    id: 'bible-study-guide',
    title: 'Bible Study Guide',
    description: 'Bible study guide documents.',
    documents: [
      { id: 'bible-1', name: 'Faith in Practice - Study Guide.pdf', type: 'PDF', uploadedAt: '5 Nov 2026' },
    ],
  },
  {
    id: 'friday-prayer-meeting',
    title: 'Friday Prayer Meeting',
    description: 'Friday prayer meeting documents.',
    documents: [],
  },
  {
    id: 'sunday-school-guide',
    title: 'Sunday School Guide',
    description: 'Sunday school guide documents.',
    documents: [
      { id: 'school-1', name: 'Sunday School Guide - Week 45.pdf', type: 'PDF', uploadedAt: '7 Nov 2026' },
    ],
  },
];

function getFileType(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const fileTypes = {
    doc: 'Word document',
    docx: 'Word document',
    pdf: 'PDF',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    xls: 'Excel spreadsheet',
    xlsx: 'Excel spreadsheet',
  };

  return fileTypes[extension] ?? 'Document';
}

export function BranchMediaAdminPage({
  workspace = 'branch-media-admin',
  workspaceKicker = 'BRANCH MEDIA',
  showResources = false,
}) {
  const [resources, setResources] = useState(initialResources);
  const [uploadTarget, setUploadTarget] = useState(initialResources[0].id);
  const [selectedFile, setSelectedFile] = useState(null);
  const [replacement, setReplacement] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUploadsMenuOpen, setIsUploadsMenuOpen] = useState(false);
  const uploadsActionsRef = useRef(null);
  const uploadTargetResource = resources.find((resource) => resource.id === uploadTarget);

  useEffect(() => {
    if (!isUploadsMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!uploadsActionsRef.current?.contains(event.target)) {
        setIsUploadsMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsUploadsMenuOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUploadsMenuOpen]);

  function handleFileChange(event) {
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setFeedback('Choose a document before uploading.');
      return;
    }

    const document = {
      id: `document-${Date.now()}`,
      name: selectedFile.name,
      type: getFileType(selectedFile),
      uploadedAt: 'Just now',
    };

    setResources((currentResources) => currentResources.map((resource) => {
      if (resource.id !== uploadTarget) {
        return resource;
      }

      if (replacement?.resourceId === resource.id) {
        return {
          ...resource,
          documents: resource.documents.map((item) => (
            item.id === replacement.documentId ? document : item
          )),
        };
      }

      return { ...resource, documents: [...resource.documents, document] };
    }));

    setFeedback(replacement ? 'Document replaced successfully.' : 'Document added successfully.');
    setSelectedFile(null);
    setReplacement(null);
    event.target.reset();
  }

  function handleReplace(resourceId, documentId) {
    setUploadTarget(resourceId);
    setReplacement({ resourceId, documentId });
    setSelectedFile(null);
    setFeedback('Choose a replacement document below.');
  }

  function handleDelete(resourceId, documentId) {
    setResources((currentResources) => currentResources.map((resource) => (
      resource.id === resourceId
        ? { ...resource, documents: resource.documents.filter((item) => item.id !== documentId) }
        : resource
    )));
    setFeedback('Document deleted.');
  }

  function handleDeleteAll() {
    setResources((currentResources) => currentResources.map((resource) => ({
      ...resource,
      documents: [],
    })));
    setPreviewDocument(null);
    setIsUploadsMenuOpen(false);
    setFeedback('All documents deleted.');
  }

  function handleDownload(document) {
    setFeedback(`${document.name} is ready for download.`);
  }

  if (!showResources) {
    return (
      <AdminLayout workspace={workspace} pageTitle='Overview'>
        <section className='branch-media-admin-page' aria-labelledby='branch-media-admin-title'>
          <header className='branch-media-admin-heading'>
            <h1 id='branch-media-admin-title'>Branch Media Admin</h1>
          </header>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout workspace={workspace} pageTitle='Media resources'>
      <section className='branch-media-admin-page' aria-labelledby='branch-media-admin-title'>
        <header className='branch-media-admin-heading'>
          <h1 id='branch-media-admin-title'>Media resources</h1>
          <span>Manage documents for your assigned branch services and ministries.</span>
        </header>
        <div className='branch-media-admin-layout'>
          <form className='branch-media-upload-panel' onSubmit={handleUpload}>
            <div className='branch-media-upload-heading'>
              <Upload size={19} aria-hidden='true' />
              <div>
                <h2>{replacement ? 'Replace document' : 'Upload document'}</h2>
                <p>{replacement ? 'Select the new version of this document.' : 'Add a document to a resource category.'}</p>
              </div>
            </div>
            <div className='branch-media-category-control'>
              <span id='branch-media-category-label'>Resource category</span>
              <button
                className='branch-media-category-button'
                type='button'
                aria-haspopup='listbox'
                aria-expanded={isCategoryMenuOpen}
                aria-labelledby='branch-media-category-label'
                onClick={() => setIsCategoryMenuOpen((isOpen) => !isOpen)}
              >
                <span>{uploadTargetResource?.title}</span>
                <ChevronDown size={15} aria-hidden='true' />
              </button>
              {isCategoryMenuOpen && (
                <div className='branch-media-category-menu' role='listbox' aria-label='Resource category'>
                  {resources.map((resource) => (
                    <button
                      className={resource.id === uploadTarget ? 'is-selected' : ''}
                      type='button'
                      role='option'
                      aria-selected={resource.id === uploadTarget}
                      key={resource.id}
                      onClick={() => {
                        setUploadTarget(resource.id);
                        setReplacement(null);
                        setIsCategoryMenuOpen(false);
                      }}
                    >
                      <span>{resource.title}</span>
                      {resource.id === uploadTarget && <Check size={14} aria-hidden='true' />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <label className='branch-media-file-picker'>
              <input
                type='file'
                accept='.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx'
                onChange={handleFileChange}
              />
              <FileText size={20} aria-hidden='true' />
              <span>{selectedFile?.name ?? 'Choose a document'}</span>
            </label>
            <div className='branch-media-upload-actions'>
              <button type='submit'>
                <Upload size={15} aria-hidden='true' />
                {replacement ? 'Replace document' : 'Upload document'}
              </button>
              {replacement && (
                <button className='branch-media-cancel-button' type='button' onClick={() => setReplacement(null)}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          <section className='branch-media-current-uploads' aria-labelledby='branch-media-current-uploads-title'>
            <header className='branch-media-current-uploads-heading'>
              <div>
                <h2 id='branch-media-current-uploads-title'>Current uploads</h2>
                <p>Documents currently available for each service resource.</p>
              </div>
              <div className='branch-media-uploads-actions' ref={uploadsActionsRef}>
                <button
                  className='branch-media-uploads-more'
                  type='button'
                  aria-label='More actions for current uploads'
                  aria-expanded={isUploadsMenuOpen}
                  aria-controls='branch-media-uploads-menu'
                  onClick={() => setIsUploadsMenuOpen((isOpen) => !isOpen)}
                >
                  <MoreVertical size={20} aria-hidden='true' />
                </button>
                {isUploadsMenuOpen && (
                  <div className='admin-record-menu' id='branch-media-uploads-menu' role='menu' aria-label='Current uploads actions'>
                    <button className='admin-record-menu-item is-danger' type='button' role='menuitem' onClick={handleDeleteAll}>
                      <Trash2 size={16} aria-hidden='true' />
                      <span>Delete all</span>
                    </button>
                  </div>
                )}
              </div>
            </header>
            <div className='branch-media-upload-list'>
              <ul className='branch-media-document-list'>
                {resources.flatMap((resource) => resource.documents.map((document) => ({
                  ...document,
                  resourceId: resource.id,
                }))).map((document) => (
                  <li key={document.id}>
                    <FileText size={18} aria-hidden='true' />
                    <div className='branch-media-document-details'>
                      <strong>{document.name}</strong>
                      <span>
                        <em>{document.type}</em>
                        <span><CalendarDays size={12} aria-hidden='true' /> {document.uploadedAt}</span>
                      </span>
                    </div>
                    <div className='branch-media-document-actions' aria-label={`${document.name} actions`}>
                      <button type='button' onClick={() => setPreviewDocument(document)} aria-label={`View ${document.name}`} title='View'>
                        <Eye size={15} aria-hidden='true' />
                      </button>
                      <button type='button' onClick={() => handleDownload(document)} aria-label={`Download ${document.name}`} title='Download'>
                        <Download size={15} aria-hidden='true' />
                      </button>
                      <button type='button' onClick={() => handleReplace(document.resourceId, document.id)} aria-label={`Replace ${document.name}`} title='Replace'>
                        <RefreshCw size={15} aria-hidden='true' />
                      </button>
                      <button className='is-danger' type='button' onClick={() => handleDelete(document.resourceId, document.id)} aria-label={`Delete ${document.name}`} title='Delete'>
                        <Trash2 size={15} aria-hidden='true' />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          {previewDocument && (
            <aside className='branch-media-preview' aria-label='Document preview'>
              <div>
                <FileText size={18} aria-hidden='true' />
                <span>
                  <strong>{previewDocument.name}</strong>
                  <small>{previewDocument.type} document</small>
                </span>
              </div>
              <button type='button' aria-label='Close preview' onClick={() => setPreviewDocument(null)}>
                <X size={16} aria-hidden='true' />
              </button>
              <p>Document preview is available when files are connected to storage.</p>
            </aside>
          )}
        </div>
        {feedback && <p className='branch-media-feedback' role='status'>{feedback}</p>}
      </section>
    </AdminLayout>
  );
}
