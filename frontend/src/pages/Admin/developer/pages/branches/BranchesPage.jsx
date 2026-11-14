import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  Globe,
  MapPin,
  MapPinned,
  Phone,
  Plus,
  UserRound,
  X,
} from 'lucide-react';
import branches from '../../../../../data/branches.json';
import './BranchesPage.css';

function getFilterOptions(records, field, allLabel) {
  const values = [
    ...new Set(records.map((branch) => branch[field]).filter(Boolean)),
  ].sort((first, second) => first.localeCompare(second));

  return [
    { label: allLabel, value: 'all' },
    ...values.map((value) => ({ label: value, value })),
  ];
}

const emptyBranchForm = {
  name: '',
  slogan: '',
  state: '',
  country: 'Nigeria',
  lga: '',
  leadPastor: '',
  address: '',
  adminPhone: '',
  adminUsername: '',
};

function BranchForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyBranchForm);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      name: form.name.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      lga: form.lga.trim(),
      leadPastor: form.leadPastor.trim(),
      address: form.address.trim(),
      adminPhone: form.adminPhone.trim(),
      adminUsername: form.adminUsername.trim().toLowerCase(),
    });
  }

  return (
    <div
      className='branch-form-backdrop'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className='branch-form-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='branch-form-title'
      >
        <header className='branch-form-heading'>
          <div className='branch-form-title-icon'>
            <Building2 size={20} aria-hidden='true' />
          </div>
          <div>
            <h2 id='branch-form-title'>Add branch</h2>
            <p>Enter the branch location and contact details.</p>
          </div>
          <button
            className='branch-form-close'
            type='button'
            onClick={onCancel}
            aria-label='Close form'
          >
            <X size={19} aria-hidden='true' />
          </button>
        </header>
        <form className='branch-form' onSubmit={handleSubmit}>
          <label className='branch-form-field'>
            Branch name
            <input
              name='name'
              value={form.name}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field'>
            Slogan
            <input name='slogan' value={form.slogan} onChange={updateField} />
          </label>
          <label className='branch-form-field'>
            State
            <input
              name='state'
              value={form.state}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field'>
            Country
            <input
              name='country'
              value={form.country}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field'>
            Local government area
            <input
              name='lga'
              value={form.lga}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field'>
            Lead pastor
            <input
              name='leadPastor'
              value={form.leadPastor}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field branch-form-field-wide'>
            Address
            <input
              name='address'
              value={form.address}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field'>
            Admin phone
            <input
              name='adminPhone'
              type='tel'
              value={form.adminPhone}
              onChange={updateField}
              required
            />
          </label>
          <label className='branch-form-field'>
            Admin Username
            <input
              name='adminUsername'
              type='text'
              value={form.adminUsername}
              onChange={updateField}
              autoComplete='username'
              minLength={3}
              maxLength={32}
              pattern='[A-Za-z0-9._@-]+'
            />
          </label>
          <div className='branch-form-actions'>
            <button
              className='branch-form-cancel'
              type='button'
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className='branch-form-submit' type='submit'>
              <Plus size={16} aria-hidden='true' />
              Add branch
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function BranchFilterDropdown({
  name,
  label,
  options,
  value,
  isOpen,
  onToggle,
  onSelect,
}) {
  const isFiltered = value !== 'all';

  return (
    <div className='branches-filter-control'>
      <button
        className='branches-filter-button'
        type='button'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={isOpen ? `branch-filter-${name}` : undefined}
        onClick={onToggle}
      >
        <span>{label}</span>
        {isFiltered && <span className='branches-filter-count'>1</span>}
        <ChevronDown size={15} aria-hidden='true' />
      </button>
      {isOpen && (
        <div
          className='branches-filter-menu'
          id={`branch-filter-${name}`}
          role='menu'
          aria-label={`${label} options`}
        >
          {options.map((option) => (
            <button
              className={`branches-filter-option${value === option.value ? ' is-selected' : ''}`}
              type='button'
              role='menuitemradio'
              aria-checked={value === option.value}
              key={option.value}
              onClick={() => onSelect(option.value)}
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={15} aria-hidden='true' />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BranchArtwork({ name, slogan, variant }) {
  return (
    <div className={`branch-artwork branch-artwork--${variant}`}>
      <div className='branch-artwork-copy'>
        <h2 className='branch-artwork-title'>{name}</h2>
        <p className='branch-artwork-slogan'>{slogan}</p>
      </div>
    </div>
  );
}

function BranchCard({ branch, variant }) {
  return (
    <article className='branch-card'>
      <BranchArtwork
        name={`${branch.name}`}
        slogan={branch.slogan}
        variant={variant}
      />
      <dl className='branch-details-grid'>
        <div className='branch-detail-item'>
          <dt>
            <MapPinned size={14} aria-hidden='true' />
            State
          </dt>
          <dd>{branch.state}</dd>
        </div>
        <div className='branch-detail-item'>
          <dt>
            <UserRound size={14} aria-hidden='true' />
            Lead pastor
          </dt>
          <dd>{branch.leadPastor}</dd>
        </div>
        <div className='branch-detail-item'>
          <dt>
            <Globe size={14} aria-hidden='true' />
            Country
          </dt>
          <dd>{branch.country}</dd>
        </div>
        <div className='branch-detail-item'>
          <dt>
            <Building2 size={14} aria-hidden='true' />
            LGA
          </dt>
          <dd>{branch.lga || branch.localGovernmentArea}</dd>
        </div>
      </dl>
      <div className='branch-admin-contact'>
        <p>
          <Phone size={14} aria-hidden='true' />
          <span>{branch.adminPhone || branch.phoneNumber}</span>
        </p>
        <p>
          <UserRound size={14} aria-hidden='true' />
          <span>{branch.adminUsername}</span>
        </p>
      </div>
      <div className='branch-card-footer'>
        <p className='branch-location'>
          <MapPin size={13} aria-hidden='true' />
          <span>{branch.address}</span>
        </p>
        <button
          className='branch-preview-button'
          type='button'
          aria-label={`View ${branch.name} on map`}
        >
          <MapPin size={13} aria-hidden='true' />
          View on map
        </button>
      </div>
    </article>
  );
}

export function BranchesPage() {
  const [branchRecords, setBranchRecords] = useState(branches);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [openFilter, setOpenFilter] = useState(null);
  const filtersRef = useRef(null);
  const stateOptions = getFilterOptions(branchRecords, 'state', 'All states');
  const countryOptions = getFilterOptions(
    branchRecords,
    'country',
    'All countries',
  );

  useEffect(() => {
    if (!openFilter) return undefined;

    function handlePointerDown(event) {
      if (!filtersRef.current?.contains(event.target)) setOpenFilter(null);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenFilter(null);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openFilter]);

  const visibleBranches = branchRecords
    .map((branch, index) => ({ branch, variant: index + 1 }))
    .filter(
      ({ branch }) =>
        (selectedState === 'all' || branch.state === selectedState) &&
        (selectedCountry === 'all' || branch.country === selectedCountry),
    );

  return (
    <section className='branches-page' aria-labelledby='branches-title'>
      <div className='branches-page-heading'>
        <div>
          <h1 id='branches-title'>Branches</h1>
          <p className='branches-description'>
            Explore your church branches and their expression networks.
          </p>
        </div>
        <div className='branches-heading-actions'>
          <div className='branches-filter-controls' ref={filtersRef}>
            <BranchFilterDropdown
              name='state'
              label='State'
              options={stateOptions}
              value={selectedState}
              isOpen={openFilter === 'state'}
              onToggle={() =>
                setOpenFilter((current) =>
                  current === 'state' ? null : 'state',
                )
              }
              onSelect={(value) => {
                setSelectedState(value);
                setOpenFilter(null);
              }}
            />
            <BranchFilterDropdown
              name='country'
              label='Country'
              options={countryOptions}
              value={selectedCountry}
              isOpen={openFilter === 'country'}
              onToggle={() =>
                setOpenFilter((current) =>
                  current === 'country' ? null : 'country',
                )
              }
              onSelect={(value) => {
                setSelectedCountry(value);
                setOpenFilter(null);
              }}
            />
          </div>
          <button
            className='branches-add-button'
            type='button'
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} aria-hidden='true' />
            Add branch
          </button>
        </div>
      </div>
      <div className='branches-card-grid'>
        {visibleBranches.map(({ branch, variant }) => (
          <BranchCard branch={branch} variant={variant} key={branch.name} />
        ))}
      </div>
      {visibleBranches.length === 0 && (
        <p className='branches-empty-state'>
          No branches match the selected filters.
        </p>
      )}
      {feedback && (
        <p className='branches-feedback' role='status'>
          {feedback}
        </p>
      )}
      {isAddModalOpen && (
        <BranchForm
          onCancel={() => setIsAddModalOpen(false)}
          onSubmit={(branch) => {
            setBranchRecords((current) => [...current, branch]);
            setSelectedState('all');
            setSelectedCountry('all');
            setIsAddModalOpen(false);
            setFeedback(`${branch.name} added to this dashboard.`);
          }}
        />
      )}
    </section>
  );
}
