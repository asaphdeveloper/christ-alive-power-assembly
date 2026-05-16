import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon } from '@hugeicons/core-free-icons';
import './BranchLocations.css';

export const BranchLocations = () => {
  const branches = [
    {
      id: 'olive-camp',
      name: 'Olive Camp',
      address: `Christ alive power assembly has it's headquater located
          Opposite CAN Sacretariat, Behind foursquare church, Rafin
          Zurfi Yelwa, Bauchi state.`,
      description: 'Church Headquater',
    },
    {
      id: 'house-of-joy',
      name: 'House of Joy',
      address: `Christ alive power assembly has a branch located Behind
          Federal Low-cost, Opposite gidan kaji zango, Bauchi state.`,
      description: 'Zango Branch',
    },
    {
      id: 'sabon-kaura',
      name: 'Sabon Kaura',
      address: `Christ alive power assembly has a branch located at Anguwan
          Dutse, Near gidan kaji, behind transformer Bauchi state.`,
      description: 'Sabon Kaura Branch',
    },
    {
      id: 'wuntin-dada',
      name: 'Wuntin Dada',
      address: `Christ alive power assembly has a branch located at Wuntin
          dada Bauchi state.`,
      description: 'Wuntin Dada Branch',
    },
    {
      id: 'gudum-sayawa',
      name: 'Gudum Sayawa',
      address: `Christ alive power assembly has a branch located at Life and
          power hall, near primary school, Gudum Sayawa, Bauchi state.`,
      description: 'Gudum Sayawa Branch',
    },
  ];

  return (
    <section className="branch-locations">
      <h3 className="branch-locations-heading">Bauchi Branches</h3>
      <p className="branch-locations-paragraph">
        Explore our Bauchi expressions and their contact details.
      </p>
      <ul className="branch-locations-cards">
        {branches.map((branch) => {
          return (
            <li key={branch.id} className="branch-locations-card">
              <div className="branch-card-details">
                <div className="branch-card-heading">
                  <div className='branch-card-heading-icon-container' >
                    <HugeiconsIcon icon={Location01Icon} className='branch-card-heading-icon' />
                  </div>
                  <span>{branch.name}</span>
                </div>
                <span className="branch-card-description">
                  {branch.description}
                </span>
                <p className="branch-card-address">
                  {branch.address}
                </p>
              </div>
              <div className="branch-card-map">
                <iframe
                  src="https://www.google.com/maps?q=Joy%20Street%2C%20Bauchi&output=embed"
                  loading="lazy"
                  title={`Map for ${branch.name}`}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  );
};