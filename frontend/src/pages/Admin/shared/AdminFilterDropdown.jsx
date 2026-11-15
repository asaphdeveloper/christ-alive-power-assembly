import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import './AdminFilterDropdown.css';

export function AdminFilterDropdown({
  name,
  label,
  options,
  value,
  isOpen: controlledOpen,
  onToggle,
  onSelect,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const isFiltered = value !== 'all';
  const menuId = `admin-filter-${name}`;

  function toggle() {
    if (onToggle) onToggle();
    else setInternalOpen((open) => !open);
  }

  function selectOption(optionValue) {
    onSelect(optionValue);
    if (!isControlled) setInternalOpen(false);
  }

  return (
    <div className='admin-filter-control'>
      <button
        className='admin-filter-button'
        type='button'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={toggle}
      >
        <span>{label}</span>
        {isFiltered && <span className='admin-filter-count'>1</span>}
        <ChevronDown size={15} aria-hidden='true' />
      </button>
      {isOpen && (
        <div
          className='admin-filter-menu'
          id={menuId}
          role='menu'
          aria-label={`${label} options`}
        >
          {options.map((option) => (
            <button
              className={`admin-filter-option${value === option.value ? ' is-selected' : ''}`}
              type='button'
              role='menuitemradio'
              aria-checked={value === option.value}
              key={option.value}
              onClick={() => selectOption(option.value)}
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
