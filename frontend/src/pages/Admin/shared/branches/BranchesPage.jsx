import { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  MapPin,
  MapPinned,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import branches from '../../../../data/branches.json';
import initialAdmins from '../../../../data/admins.json';
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
  mapLocation: { longitude: null, latitude: null },
};

function BranchForm({ branch, admins, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({ ...emptyBranchForm, ...branch }));
  const [step, setStep] = useState(1);
  const [selectedAdminIds, setSelectedAdminIds] = useState(
    () =>
      branch?.adminIds ??
      admins
        .filter((admin) => admin.branch === branch?.name)
        .map((admin) => admin.id),
  );
  const [adminSearch, setAdminSearch] = useState('');
  const [error, setError] = useState('');

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function updateMapCoordinate(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      mapLocation: {
        ...emptyBranchForm.mapLocation,
        ...current.mapLocation,
        [name]: value === '' ? null : Number(value),
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!branch && step === 1) {
      const formElement = event.currentTarget;
      if (!formElement.reportValidity()) return;
      setStep(2);
      setError('');
      return;
    }
    const chosenAdmins = selectedAdminIds;
    if (chosenAdmins.length < 1) {
      setError('Assign at least one administrator to this branch.');
      return;
    }
    const primaryAdmin = admins.find((admin) => admin.id === chosenAdmins[0]);
    const longitude = form.mapLocation?.longitude ?? null;
    const latitude = form.mapLocation?.latitude ?? null;
    if ((longitude === null) !== (latitude === null)) {
      setError('Enter both map coordinates, or leave both blank.');
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      slogan: form.slogan.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      lga: form.lga.trim(),
      leadPastor: form.leadPastor.trim(),
      address: form.address.trim(),
      administrator: primaryAdmin?.name ?? '',
      adminPhone: primaryAdmin?.phone ?? '',
      adminUsername: primaryAdmin?.username ?? '',
      mapLocation: { longitude, latitude },
      adminIds: chosenAdmins,
    });
  }

  const filteredAdmins = admins.filter((admin) =>
    `${admin.name} ${admin.username}`
      .toLowerCase()
      .includes(adminSearch.trim().toLowerCase()),
  );

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
            <h2 id='branch-form-title'>
              {branch ? 'Update branch' : 'Add branch'}
            </h2>
            <p>
              {branch
                ? 'Update branch details and administrators.'
                : step === 1
                  ? 'Step 1 of 2 · Branch details'
                  : 'Create or add administrators for this branch.'}
            </p>
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
        <form
          className={`branch-form${step === 2 && !branch ? ' is-relationship-step' : ''}`}
          onSubmit={handleSubmit}
        >
          {step === 1 && (
            <>
              <label className='branch-form-field'>
                Branch name
                <input
                  name='name'
                  value={form.name}
                  onChange={updateField}
                  placeholder='e.g. Jos Branch'
                  required
                />
              </label>
              <label className='branch-form-field'>
                Slogan
                <input
                  name='slogan'
                  value={form.slogan}
                  onChange={updateField}
                  placeholder='e.g. A place of hope'
                />
              </label>
              <label className='branch-form-field'>
                State
                <input
                  name='state'
                  value={form.state}
                  onChange={updateField}
                  placeholder='e.g. Plateau State'
                  required
                />
              </label>
              <label className='branch-form-field'>
                Country
                <input
                  name='country'
                  value={form.country}
                  onChange={updateField}
                  placeholder='e.g. Nigeria'
                  required
                />
              </label>
              <label className='branch-form-field'>
                Local government area
                <input
                  name='lga'
                  value={form.lga}
                  onChange={updateField}
                  placeholder='e.g. Jos North'
                  required
                />
              </label>
              <label className='branch-form-field'>
                Lead pastor
                <input
                  name='leadPastor'
                  value={form.leadPastor}
                  onChange={updateField}
                  placeholder='e.g. Pastor David Kanti'
                  required
                />
              </label>
              <label className='branch-form-field branch-form-field-wide'>
                Address
                <input
                  name='address'
                  value={form.address}
                  onChange={updateField}
                  placeholder='Enter the branch street address'
                  required
                />
              </label>
              <label className='branch-form-field'>
                Map longitude
                <input
                  name='longitude'
                  type='number'
                  min='-180'
                  max='180'
                  step='any'
                  value={form.mapLocation?.longitude ?? ''}
                  onChange={updateMapCoordinate}
                  placeholder='e.g. 9.8965'
                />
              </label>
              <label className='branch-form-field'>
                Map latitude
                <input
                  name='latitude'
                  type='number'
                  min='-90'
                  max='90'
                  step='any'
                  value={form.mapLocation?.latitude ?? ''}
                  onChange={updateMapCoordinate}
                  placeholder='e.g. 8.8921'
                />
              </label>
            </>
          )}
          {(step === 2 || branch) && (
            <>
              <section
                className='branch-relationship-section'
                aria-label='Branch administrators'
              >
                <div className='branch-admin-picker'>
                    <label className='branch-admin-search'>
                      <span>Find administrators</span>
                      <span className='branch-admin-count'>
                        {selectedAdminIds.length} selected
                      </span>
                      <input
                        type='search'
                        value={adminSearch}
                        onChange={(event) => setAdminSearch(event.target.value)}
                        placeholder='Search name or username'
                      />
                    </label>
                    {filteredAdmins.length ? (
                      <div className='branch-admin-options'>
                        {filteredAdmins.map((admin) => {
                          const assignedElsewhere =
                            admin.branch && admin.branch !== branch?.name;
                          const checked = selectedAdminIds.includes(admin.id);
                          return (
                            <label
                              className={`branch-admin-option${checked ? ' is-selected' : ''}${assignedElsewhere ? ' is-assigned' : ''}`}
                              key={admin.id}
                            >
                              <input
                                type='checkbox'
                                checked={checked}
                                disabled={assignedElsewhere}
                                onChange={(event) =>
                                  setSelectedAdminIds((current) =>
                                    event.target.checked
                                      ? [...current, admin.id]
                                      : current.filter((id) => id !== admin.id),
                                  )
                                }
                              />
                              <span
                                className='branch-admin-option-check'
                                aria-hidden='true'
                              >
                                {checked && <Check size={13} />}
                              </span>
                              <span className='branch-admin-option-copy'>
                                <strong>{admin.name}</strong>
                                <span>{admin.username}</span>
                              </span>
                              <span
                                className={`branch-admin-assignment-status${assignedElsewhere ? ' is-assigned' : ''}`}
                              >
                                {assignedElsewhere
                                  ? `Assigned to ${admin.branch}`
                                  : admin.branch
                                    ? `This branch`
                                    : 'Available'}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className='branch-admin-empty'>
                        No administrators match your search.
                      </p>
                    )}
                    {selectedAdminIds.length > 0 && (
                      <p className='branch-admin-selection-summary'>
                        <Check size={14} aria-hidden='true' />
                        {selectedAdminIds.length} administrator
                        {selectedAdminIds.length === 1 ? '' : 's'} selected
                      </p>
                    )}
                  </div>


              </section>
              {error && (
                <p className='branch-form-error' role='alert'>
                  {error}
                </p>
              )}
            </>
          )}
          <div className='branch-form-actions'>
            {step === 1 && !branch ? (
              <>
                <button
                  className='branch-form-cancel'
                  type='button'
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button className='branch-form-submit' type='submit'>
                  Next{' '}
                  <ChevronRight
                    className='branch-step-next-icon'
                    size={16}
                    aria-hidden='true'
                  />
                </button>
              </>
            ) : (
              <>
                {!branch && (
                  <button
                    className='branch-form-cancel'
                    type='button'
                    onClick={() => {
                      setStep(1);
                      setError('');
                    }}
                  >
                    <ChevronLeft
                      className='branch-step-back-icon'
                      size={16}
                      aria-hidden='true'
                    />
                    Back
                  </button>
                )}
                <button
                  className='branch-form-cancel'
                  type='button'
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button className='branch-form-submit' type='submit'>
                  <Plus size={16} aria-hidden='true' />
                  {branch ? 'Save changes' : 'Add branch'}
                </button>
              </>
            )}
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

function BranchCard({
  branch,
  variant,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onEdit,
  onDelete,
}) {
  const actionsRef = useRef(null);
  const menuId = `branch-actions-${String(branch._id ?? branch.id ?? branch.name).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (!actionsRef.current?.contains(event.target)) onCloseMenu();
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCloseMenu();
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen, onCloseMenu]);

  const actions = [
    { label: 'Update', icon: Pencil, onClick: onEdit },
    { label: 'Delete', icon: Trash2, danger: true, onClick: onDelete },
  ];
  const assignedAdmins = branch.adminNames?.length
    ? branch.adminNames
    : branch.administrator
      ? [branch.administrator]
      : [];

  return (
    <article className={`branch-card${menuOpen ? ' has-open-menu' : ''}`}>
      <div className='branch-card-visual'>
        <BranchArtwork
          name={`${branch.name}`}
          slogan={branch.slogan}
          variant={variant}
        />
        <div className='branch-record-actions' ref={actionsRef}>
          <button
            className='branch-record-more'
            type='button'
            aria-label={`More actions for ${branch.name}`}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            onClick={onToggleMenu}
          >
            <MoreVertical size={20} aria-hidden='true' />
          </button>
          {menuOpen && (
            <div
              className='branch-record-menu'
              id={menuId}
              role='menu'
              aria-label={`${branch.name} actions`}
            >
              {actions.map(({ label, icon: Icon, danger, onClick }) => (
                <button
                  className={`branch-record-menu-item${danger ? ' is-danger' : ''}`}
                  type='button'
                  role='menuitem'
                  key={label}
                  onClick={() => {
                    onClick();
                    onCloseMenu();
                  }}
                >
                  <Icon size={16} aria-hidden='true' />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
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
          <span>
            {assignedAdmins.join(', ') || 'No administrators assigned'}
          </span>
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
  const [adminRecords, setAdminRecords] = useState(initialAdmins);
  const [formBranch, setFormBranch] = useState(undefined);
  const [openBranchMenu, setOpenBranchMenu] = useState(null);
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
            onClick={() => setFormBranch(null)}
          >
            <Plus size={16} aria-hidden='true' />
            Add branch
          </button>
        </div>
      </div>
      <div className='branches-card-grid'>
        {visibleBranches.map(({ branch, variant }) => (
          <BranchCard
            branch={branch}
            variant={variant}
            key={branch._id ?? branch.id ?? branch.name}
            menuOpen={
              openBranchMenu === (branch._id ?? branch.id ?? branch.name)
            }
            onToggleMenu={() =>
              setOpenBranchMenu((current) =>
                current === (branch._id ?? branch.id ?? branch.name)
                  ? null
                  : (branch._id ?? branch.id ?? branch.name),
              )
            }
            onCloseMenu={() => setOpenBranchMenu(null)}
            onEdit={() => setFormBranch(branch)}
            onDelete={() => {
              if (!window.confirm(`Delete ${branch.name}?`)) return;
              setBranchRecords((current) =>
                current.filter((item) => item !== branch),
              );
              setAdminRecords((current) =>
                current.map((admin) =>
                  admin.branch === branch.name
                    ? { ...admin, branch: '' }
                    : admin,
                ),
              );
              setFeedback(`${branch.name} deleted from this dashboard.`);
            }}
          />
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
      {formBranch !== undefined && (
        <BranchForm
          key={
            formBranch?._id ??
            formBranch?.id ??
            formBranch?.name ??
            'new-branch'
          }
          branch={formBranch}
          admins={adminRecords}
          onCancel={() => setFormBranch(undefined)}
          onSubmit={(branch) => {
            if (formBranch) {
              const assignedNames = branch.adminIds
                .map(
                  (id) => adminRecords.find((admin) => admin.id === id)?.name,
                )
                .filter(Boolean);
              const updatedBranch = {
                ...formBranch,
                ...branch,
                adminNames: assignedNames,
              };
              setBranchRecords((current) =>
                current.map((item) =>
                  item === formBranch ? updatedBranch : item,
                ),
              );
              setAdminRecords((current) => [
                ...current.map((admin) =>
                  branch.adminIds.includes(admin.id)
                    ? { ...admin, branch: updatedBranch.name }
                    : admin.branch === formBranch.name
                      ? { ...admin, branch: '' }
                      : admin,
                ),
              ]);
              setFeedback(`${branch.name} updated on this dashboard.`);
            } else {
              const adminNames = adminRecords
                .filter((admin) => branch.adminIds.includes(admin.id))
                .map((admin) => admin.name);
              const newBranch = { ...branch, adminNames };
              setAdminRecords((current) => [
                ...current.map((admin) =>
                  branch.adminIds.includes(admin.id)
                    ? { ...admin, branch: newBranch.name }
                    : admin,
                ),
              ]);
              setBranchRecords((current) => [...current, newBranch]);
              setSelectedState('all');
              setSelectedCountry('all');
              setFeedback(
                `${branch.name} added with ${adminNames.length} administrator${adminNames.length === 1 ? '' : 's'}.`,
              );
            }
            setFormBranch(undefined);
          }}
        />
      )}
    </section>
  );
}
