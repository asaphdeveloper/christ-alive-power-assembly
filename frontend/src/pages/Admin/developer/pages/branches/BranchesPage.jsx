import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  Globe,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Plus,
  UserRound,
} from 'lucide-react';
import branches from '../../../../../data/branches.json';
import './BranchesPage.css';

function getFilterOptions(field, allLabel) {
  const values = [
    ...new Set(branches.map((branch) => branch[field]).filter(Boolean)),
  ].sort((first, second) => first.localeCompare(second));

  return [
    { label: allLabel, value: 'all' },
    ...values.map((value) => ({ label: value, value })),
  ];
}

const stateOptions = getFilterOptions('state', 'All states');
const countryOptions = getFilterOptions('country', 'All countries');

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
          <dd>{branch.lga}</dd>
        </div>
      </dl>
      <div className='branch-admin-contact'>
        <p>
          <Phone size={14} aria-hidden='true' />
          <span>{branch.adminPhone}</span>
        </p>
        <p>
          <Mail size={14} aria-hidden='true' />
          <span>{branch.adminEmail}</span>
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
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [openFilter, setOpenFilter] = useState(null);
  const filtersRef = useRef(null);

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

  const visibleBranches = branches
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
          <button className='branches-add-button' type='button'>
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
    </section>
  );
}
