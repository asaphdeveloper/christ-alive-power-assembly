import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Globe,
  Music2,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Toast } from '../../../components/Toast';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import EmptyIllustration from '../../../assets/images/empty.svg';
import UploadIllustration from '../../../assets/images/upload.svg';
import UploadReadyIllustration from '../../../assets/images/upload-ready.svg';
import { apiFetch, apiUrl } from '../../../utils/api';
import './BranchMediaAdminPage.css';

const initialResources = [
  {
    id: 'sunday-bulletin',
    title: 'Sunday Bulletin',
    description: 'Sunday service bulletin documents.',
    documents: [],
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
    documents: [],
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
    documents: [],
  },
];

export function BranchMediaAdminPage({ workspace = 'headquater-media-admin' }) {
  const [resources, setResources] = useState(initialResources);
  const [uploadTarget, setUploadTarget] = useState(initialResources[0].id);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hymnLyrics, setHymnLyrics] = useState('');
  const [savedHymnLyrics, setSavedHymnLyrics] = useState('');
  const [hymnNumber, setHymnNumber] = useState('');
  const [savedHymnNumber, setSavedHymnNumber] = useState('');
  const [isEditingHymnLyrics, setIsEditingHymnLyrics] = useState(false);
  const [isLoadingHymn, setIsLoadingHymn] = useState(true);
  const [isSavingHymn, setIsSavingHymn] = useState(false);
  const [isPublishingHymn, setIsPublishingHymn] = useState(false);
  const [isHymnPublished, setIsHymnPublished] = useState(false);
  const [replacement, setReplacement] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [deleteRequest, setDeleteRequest] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingUploads, setIsLoadingUploads] = useState(true);
  const [uploadLimitNotice, setUploadLimitNotice] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUploadsMenuOpen, setIsUploadsMenuOpen] = useState(false);
  const documentInputRef = useRef(null);
  const categoryControlRef = useRef(null);
  const uploadsActionsRef = useRef(null);
  const deleteCancelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const uploadLimitTimerRef = useRef(null);
  const uploadTargetResource = resources.find(
    (resource) => resource.id === uploadTarget,
  );
  const isSelectedCategoryFull = Boolean(uploadTargetResource?.documents.length);
  const areAllCategoriesFull = resources.every((resource) => resource.documents.length > 0);
  const isNewUploadBlocked = isLoadingUploads || (!replacement && (isSelectedCategoryFull || areAllCategoriesFull));
  const uploadedDocuments = resources.flatMap((resource) =>
    resource.documents.map((document) => ({
      ...document,
      resourceId: resource.id,
      resourceTitle: resource.title,
    })),
  );

  const notify = useCallback((message, type = 'success') => {
    setFeedback({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem('access_token');
    if (!token) {
      notify('Please sign in to manage resources.', 'error');
      setIsLoadingUploads(false);
      return;
    }
    apiFetch('/api/resources/manage')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to load documents.');
        return result.data;
      })
      .then(({ documents }) => {
        setResources((current) => current.map((resource) => ({
          ...resource,
          documents: documents
            .filter((document) => document.category === resource.id)
            .map((document) => ({
              ...document,
              id: document._id,
              size: document.size,
              type: 'PDF',
              uploadedAt: new Date(document.createdAt).toLocaleDateString(),
            })),
        })));
      })
      .catch((error) => notify(error.message, 'error'))
      .finally(() => setIsLoadingUploads(false));
  }, [notify]);

  useEffect(() => {
    let isActive = true;
    apiFetch('/api/resources/manage/hymn')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Unable to load hymn lyrics.');
        return result.data.hymn;
      })
      .then((hymn) => {
        if (!isActive) return;
        setHymnLyrics(hymn.draftLyrics);
        setSavedHymnLyrics(hymn.draftLyrics);
        setHymnNumber(hymn.draftNumber ? String(hymn.draftNumber) : '');
        setSavedHymnNumber(hymn.draftNumber ? String(hymn.draftNumber) : '');
        setIsEditingHymnLyrics(!hymn.draftLyrics);
        setIsHymnPublished(Boolean(hymn.publishedLyrics));
      })
      .catch((error) => {
        if (isActive) notify(error.message, 'error');
      })
      .finally(() => {
        if (isActive) setIsLoadingHymn(false);
      });
    return () => { isActive = false; };
  }, [notify]);

  useEffect(() => {
    if (!isCategoryMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!categoryControlRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsCategoryMenuOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryMenuOpen]);

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

  useEffect(() => {
    if (!deleteRequest) return undefined;
    deleteCancelRef.current?.focus();
    return () => previousFocusRef.current?.focus?.();
  }, [deleteRequest]);

  useEffect(() => () => window.clearTimeout(uploadLimitTimerRef.current), []);

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    if (file && (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))) {
      setSelectedFile(null);
      event.target.value = '';
      notify('Choose a PDF file.', 'error');
      return;
    }
    if (file && file.size > 20 * 1024 * 1024) {
      setSelectedFile(null);
      event.target.value = '';
      notify('PDF must be no larger than 20 MB.', 'error');
      return;
    }
    setSelectedFile(file);
  }

  function handleFilePickerClick(event) {
    if (!isNewUploadBlocked) return;
    event.preventDefault();
    setUploadLimitNotice(
      isLoadingUploads
        ? 'Checking existing uploads before allowing a new document.'
        : areAllCategoriesFull
          ? 'All five resource categories already have a PDF. Replace an existing document to upload an update.'
          : 'This category already has a PDF. Use Replace to update it.',
    );
    window.clearTimeout(uploadLimitTimerRef.current);
    uploadLimitTimerRef.current = window.setTimeout(() => setUploadLimitNotice(''), 4000);
  }

  function handleCancelUpload() {
    setSelectedFile(null);
    setReplacement(null);
    if (documentInputRef.current) documentInputRef.current.value = '';
  }

  async function handleSaveHymnLyrics(event) {
    event.preventDefault();
    if (!hymnLyrics.trim()) {
      notify('Paste hymn lyrics before saving.', 'error');
      return;
    }
    if (!Number.isInteger(Number(hymnNumber)) || Number(hymnNumber) < 1 || Number(hymnNumber) > 99999) {
      notify('Enter a valid hymn number between 1 and 99,999.', 'error');
      return;
    }
    setIsSavingHymn(true);
    try {
      const response = await apiFetch('/api/resources/manage/hymn', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: hymnLyrics.trim(), hymnNumber: Number(hymnNumber), publish: false }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to save hymn lyrics.');
      setHymnLyrics(result.data.hymn.draftLyrics);
      setSavedHymnLyrics(result.data.hymn.draftLyrics);
      setSavedHymnNumber(String(result.data.hymn.draftNumber));
      setIsEditingHymnLyrics(false);
      notify(result.message || 'Hymn lyrics saved.');
    } catch (error) {
      notify(error.message || 'Unable to save hymn lyrics.', 'error');
    } finally {
      setIsSavingHymn(false);
    }
  }

  async function handlePublishHymn() {
    if (!savedHymnLyrics.trim()) {
      notify('Save hymn lyrics before publishing them.', 'error');
      return;
    }

    setIsPublishingHymn(true);
    try {
      const response = await apiFetch('/api/resources/manage/hymn', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: savedHymnLyrics, hymnNumber: Number(savedHymnNumber), publish: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to publish hymn lyrics.');
      setIsHymnPublished(true);
      notify(result.message || 'Hymn lyrics published to the public website.');
    } catch (error) {
      notify(error.message || 'Unable to publish hymn lyrics.', 'error');
    } finally {
      setIsPublishingHymn(false);
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (isNewUploadBlocked) {
      notify(
        areAllCategoriesFull
          ? 'All five resource categories already have a PDF. Replace an existing document to upload an update.'
          : 'A PDF is already uploaded for this category. Use Replace to update it.',
        'error',
      );
      return;
    }

    if (!selectedFile) {
      notify('Choose a PDF before uploading.', 'error');
      return;
    }

    const token = window.localStorage.getItem('access_token');
    if (!token) {
      notify('Your session has expired. Sign in again to upload.', 'error');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', uploadTarget);
    if (replacement) formData.append('replaceId', replacement.documentId);
    try {
      const response = await apiFetch('/api/resources/manage', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to upload this PDF.');
      const saved = result.data.document;
      const document = {
        id: saved._id,
        name: saved.name,
        size: saved.size,
        type: 'PDF',
        uploadedAt: new Date(saved.createdAt).toLocaleDateString(),
      };

      setResources((currentResources) =>
        currentResources.map((resource) => {
        if (resource.id !== uploadTarget) {
          return resource;
        }

        if (replacement?.resourceId === resource.id && !result.message) {
          return {
            ...resource,
            documents: resource.documents.map((item) =>
              item.id === replacement.documentId ? document : item,
            ),
          };
        }

        return { ...resource, documents: [...resource.documents, document] };
        }),
      );

      notify(result.message || (replacement ? 'Document replaced successfully.' : 'Document added successfully.'), result.message ? 'warning' : 'success');
      setSelectedFile(null);
      setReplacement(null);
      event.target.reset();
    } catch (error) {
      notify(error.message || 'Unable to upload this PDF.', 'error');
    } finally {
      setIsUploading(false);
    }
  }

  function handleReplace(resourceId, documentId) {
    setUploadTarget(resourceId);
    setReplacement({ resourceId, documentId });
    setSelectedFile(null);
    notify('Choose a replacement document below.', 'info');
  }

  function requestDelete(resourceId, documentId, name) {
    previousFocusRef.current = document.activeElement;
    setDeleteRequest({ type: 'single', resourceId, documentId, name });
  }

  function requestDeleteAll() {
    if (uploadedDocuments.length === 0) return;
    previousFocusRef.current = uploadsActionsRef.current?.querySelector('.branch-media-uploads-more');
    setIsUploadsMenuOpen(false);
    setDeleteRequest({ type: 'all' });
  }

  async function confirmDelete() {
    if (!deleteRequest || isDeleting) return;
    setIsDeleting(true);
    try {
      const response = deleteRequest.type === 'all'
        ? await apiFetch('/api/resources/manage/all', { method: 'DELETE' })
        : await apiFetch(`/api/resources/manage/${deleteRequest.documentId}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Unable to delete the selected documents.');
      }
      if (deleteRequest.type === 'all') {
        setResources((current) => current.map((resource) => ({ ...resource, documents: [] })));
        setPreviewDocument(null);
        notify('All documents deleted.');
      } else {
        const { resourceId, documentId, name } = deleteRequest;
        setResources((currentResources) =>
          currentResources.map((resource) =>
            resource.id === resourceId
              ? { ...resource, documents: resource.documents.filter((item) => item.id !== documentId) }
              : resource,
          ),
        );
        setPreviewDocument((current) => current?.id === documentId ? null : current);
        notify(`${name} deleted.`);
      }
      setDeleteRequest(null);
    } catch (error) {
      notify(error.message || 'Unable to delete the selected documents.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout workspace={workspace} pageTitle='Media resources'>
      <section
        className='branch-media-admin-page'
        aria-labelledby='headquater-media-admin-title'
      >
        <header className='branch-media-admin-heading'>
          <h1 id='headquater-media-admin-title'>Media resources</h1>
          <span>
            Manage documents for your assigned branch services and ministries.
          </span>
        </header>
        <div className='branch-media-admin-layout'>
          <form className='branch-media-upload-panel' onSubmit={handleUpload}>
            <div className='branch-media-upload-heading'>
              <div className='branch-media-upload-heading-copy'>
                <Upload size={19} aria-hidden='true' />
                <div>
                  <h2>
                    {replacement ? 'Replace document' : 'Upload document'}
                  </h2>
                  <p>
                    {replacement
                      ? 'Select the new version of this document.'
                      : 'Add a document to a resource category.'}
                  </p>
                </div>
              </div>
              <div className='branch-media-category-control' ref={categoryControlRef}>
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
                  <div
                    className='branch-media-category-menu'
                    role='listbox'
                    aria-label='Resource category'
                  >
                    {resources.map((resource) => (
                      <button
                        className={
                          resource.id === uploadTarget ? 'is-selected' : ''
                        }
                        type='button'
                        role='option'
                        aria-selected={resource.id === uploadTarget}
                        aria-label={`${resource.title}${resource.documents.length ? ', document already uploaded' : ''}`}
                        disabled={Boolean(resource.documents.length) && replacement?.resourceId !== resource.id}
                        key={resource.id}
                        onClick={() => {
                          setUploadTarget(resource.id);
                          setReplacement(null);
                          setIsCategoryMenuOpen(false);
                        }}
                      >
                        <span>{resource.title}</span>
                        {resource.documents.length > 0 && (
                          <Check className='is-uploaded' size={14} aria-hidden='true' />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <label className='branch-media-file-picker' onClick={handleFilePickerClick}>
              <input
                ref={documentInputRef}
                type='file'
                accept='application/pdf,.pdf'
                disabled={isNewUploadBlocked}
                onChange={handleFileChange}
              />
              <img
                src={selectedFile ? UploadReadyIllustration : UploadIllustration}
                alt=''
                aria-hidden='true'
              />
              <span>
                {selectedFile?.name ?? (isNewUploadBlocked ? 'Use Replace on an existing document' : 'Choose a document')}
              </span>
            </label>
            {uploadLimitNotice && (
              <p className='branch-media-upload-limit' role='status' aria-live='polite'>
                {uploadLimitNotice}
              </p>
            )}
            <div className='branch-media-upload-actions'>
              {(selectedFile || replacement) && (
                <button
                  className='branch-media-cancel-button'
                  type='button'
                  onClick={handleCancelUpload}
                >
                  Cancel upload
                </button>
              )}
              <button type='submit' disabled={isUploading || isNewUploadBlocked} aria-busy={isUploading}>
                {isUploading ? <LoadingSpinner /> : <Upload size={15} aria-hidden='true' />}
                {isUploading ? 'Uploading…' : replacement ? 'Replace document' : 'Upload PDF'}
              </button>
            </div>
          </form>
          <form
            className='branch-media-hymn-panel'
            onSubmit={handleSaveHymnLyrics}
          >
            <header className='branch-media-hymn-heading'>
              <div className='branch-media-upload-heading-copy'>
                <Music2 size={19} aria-hidden='true' />
                <div>
                  <h2>Sunday Hymn lyrics</h2>
                  <p>Paste the hymn lyrics below.</p>
                </div>
              </div>
            </header>
            <label className='branch-media-hymn-editor'>
              <span>Hymn number</span>
              <input
                type='number'
                min='1'
                max='99999'
                step='1'
                value={hymnNumber}
                onChange={(event) => setHymnNumber(event.target.value)}
                readOnly={isLoadingHymn || (Boolean(savedHymnLyrics) && !isEditingHymnLyrics)}
                aria-label='Hymn number'
                required
              />
              <textarea
                value={hymnLyrics}
                onChange={(event) => setHymnLyrics(event.target.value)}
                readOnly={isLoadingHymn || (Boolean(savedHymnLyrics) && !isEditingHymnLyrics)}
                aria-busy={isLoadingHymn}
                placeholder={
                  isLoadingHymn
                    ? 'Loading saved hymn lyrics…'
                    : 'Paste hymn lyrics here…\n\nSeparate verses with a blank line.'
                }
                rows={10}
              />
            </label>
            <div className='branch-media-hymn-actions'>
              {savedHymnLyrics && !isEditingHymnLyrics ? (
                <button
                  className='branch-media-hymn-save'
                  type='button'
                  disabled={isSavingHymn || isPublishingHymn || isLoadingHymn}
                  onClick={() => setIsEditingHymnLyrics(true)}
                >
                  <Pencil size={14} aria-hidden='true' />
                  Edit lyrics
                </button>
              ) : (
                <button className='branch-media-hymn-save' type='submit' disabled={isSavingHymn || isLoadingHymn} aria-busy={isSavingHymn}>
                  {isSavingHymn ? <LoadingSpinner /> : null}
                  {isSavingHymn ? 'Saving…' : 'Save lyrics'}
                </button>
              )}
              <button
                className='branch-media-hymn-publish'
                type='button'
                disabled={isPublishingHymn || isSavingHymn || isLoadingHymn || !savedHymnLyrics.trim() || (isEditingHymnLyrics && (hymnLyrics.trim() !== savedHymnLyrics || hymnNumber !== savedHymnNumber))}
                aria-busy={isPublishingHymn}
                onClick={handlePublishHymn}
              >
                {isPublishingHymn ? <LoadingSpinner /> : <Globe size={14} aria-hidden='true' />}
                {isPublishingHymn ? 'Publishing…' : isHymnPublished ? 'Publish updates' : 'Publish hymn'}
              </button>
            </div>
            {savedHymnLyrics && (
              <p className='branch-media-hymn-saved' role='status'>
                {savedHymnLyrics.split(/\n\s*\n/).length} verse
                {savedHymnLyrics.split(/\n\s*\n/).length === 1 ? '' : 's'}{' '}
                saved.
                {isHymnPublished ? ' Published on the public website.' : ' Draft only.'}
              </p>
            )}
          </form>
          <section
            className='branch-media-current-uploads'
            aria-labelledby='branch-media-current-uploads-title'
          >
            <header className='branch-media-current-uploads-heading'>
              <div>
                <h2 id='branch-media-current-uploads-title'>
                  Current uploads
                  {uploadedDocuments.length > 0 && (
                    <span
                      className='branch-media-live-dot'
                      aria-hidden='true'
                    />
                  )}
                </h2>
                <p>Documents currently available for each service resource.</p>
              </div>
              <div
                className='branch-media-uploads-actions'
                ref={uploadsActionsRef}
              >
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
                  <div
                    className='admin-record-menu'
                    id='branch-media-uploads-menu'
                    role='menu'
                    aria-label='Current uploads actions'
                  >
                    <button
                      className='admin-record-menu-item is-danger'
                      type='button'
                      role='menuitem'
                      disabled={uploadedDocuments.length === 0 || isLoadingUploads}
                      onClick={requestDeleteAll}
                    >
                      <Trash2 size={16} aria-hidden='true' />
                      <span>Delete all</span>
                    </button>
                  </div>
                )}
              </div>
            </header>
            <div className='branch-media-upload-list'>
              {isLoadingUploads ? (
                <div className='branch-media-uploads-loading' role='status' aria-live='polite'>
                  <LoadingSpinner />
                  <span>Loading uploads…</span>
                </div>
              ) : uploadedDocuments.length ? (
                <ul className='branch-media-document-list'>
                  {uploadedDocuments.map((document) => (
                    <li key={document.id}>
                      <FileText size={18} aria-hidden='true' />
                      <div className='branch-media-document-details'>
                        <strong>{document.resourceTitle}</strong>
                        <span>
                          <em>{document.type}</em>
                          <span>
                            <CalendarDays size={12} aria-hidden='true' />{' '}
                            {document.uploadedAt}
                          </span>
                        </span>
                      </div>
                      <div
                        className='branch-media-document-actions'
                        aria-label={`${document.name} actions`}
                      >
                        <button
                          type='button'
                          onClick={() => setPreviewDocument(document)}
                          aria-label={`View ${document.name}`}
                          title='View'
                        >
                          <Eye size={15} aria-hidden='true' />
                        </button>
                        <a
                          href={apiUrl(`/api/resources/${document.id}/file?download=1`)}
                          aria-label={`Download ${document.name}`}
                          title='Download'
                        >
                          <Download size={15} aria-hidden='true' />
                        </a>
                        <button
                          type='button'
                          onClick={() =>
                            handleReplace(document.resourceId, document.id)
                          }
                          aria-label={`Replace ${document.name}`}
                          title='Replace'
                        >
                          <RefreshCw size={15} aria-hidden='true' />
                        </button>
                        <button
                          className='is-danger'
                          type='button'
                          onClick={() =>
                            requestDelete(document.resourceId, document.id, document.name)
                          }
                          aria-label={`Delete ${document.name}`}
                          title='Delete'
                        >
                          <Trash2 size={15} aria-hidden='true' />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='branch-media-empty-state'>
                  <img src={EmptyIllustration} alt='' aria-hidden='true' />
                  <h3>No documents yet</h3>
                  <p>Uploaded documents will appear here.</p>
                </div>
              )}
            </div>
          </section>
          {previewDocument && (
            <aside
              className='branch-media-preview'
              aria-label='Document preview'
            >
              <div>
                <FileText size={18} aria-hidden='true' />
                <span>
                  <strong>{previewDocument.name}</strong>
                  <small>{previewDocument.type} document</small>
                </span>
              </div>
              <button
                type='button'
                aria-label='Close preview'
                onClick={() => setPreviewDocument(null)}
              >
                <X size={16} aria-hidden='true' />
              </button>
              <iframe
                title={`Preview ${previewDocument.name}`}
                src={apiUrl(`/api/resources/${previewDocument.id}/file`)}
              />
            </aside>
          )}
        </div>
      </section>
      {deleteRequest && (
        <div
          className='branch-media-confirm-backdrop'
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) setDeleteRequest(null);
          }}
        >
          <section
            className='branch-media-confirm-dialog'
            role='alertdialog'
            aria-modal='true'
            aria-labelledby='branch-media-confirm-title'
            aria-describedby='branch-media-confirm-description'
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !isDeleting) setDeleteRequest(null);
              if (event.key === 'Tab') {
                const controls = event.currentTarget.querySelectorAll('button:not(:disabled)');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className='branch-media-confirm-icon'><Trash2 size={20} aria-hidden='true' /></div>
            <h2 id='branch-media-confirm-title'>
              {deleteRequest.type === 'all' ? 'Delete all uploads?' : 'Delete this upload?'}
            </h2>
            <p id='branch-media-confirm-description'>
              {deleteRequest.type === 'all'
                ? 'This will permanently delete every uploaded PDF. This action cannot be undone.'
                : `“${deleteRequest.name}” will be permanently deleted. This action cannot be undone.`}
            </p>
            <div className='branch-media-confirm-actions'>
              <button
                ref={deleteCancelRef}
                type='button'
                disabled={isDeleting}
                onClick={() => setDeleteRequest(null)}
              >Cancel</button>
              <button
                className='is-danger'
                type='button'
                disabled={isDeleting}
                aria-busy={isDeleting}
                onClick={confirmDelete}
              >
                {isDeleting ? <><LoadingSpinner /> Deleting…</> : 'Delete'}
              </button>
            </div>
          </section>
        </div>
      )}
      {feedback && <Toast key={feedback.id} message={feedback.message} type={feedback.type} />}
    </AdminLayout>
  );
}
