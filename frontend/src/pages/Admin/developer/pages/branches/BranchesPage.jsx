import { Church, Clock3, MapPin, MapPinned, ShieldCheck, UsersRound } from 'lucide-react';
import './BranchesPage.css';

const branches = [
  { name: 'Jos Branch', location: 'Jos, Plateau State', type: 'Standard', details: 'Central expression', members: '450 members', administrator: 'Grace James', color: 'violet', nodes: ['Central', 'North', 'South', 'East'] },
  { name: 'Wukari Branch', location: 'Wukari, Taraba State', type: 'Complex', details: 'Regional expression', members: '320 members', administrator: 'Peter Daniel', color: 'green', nodes: ['Wukari', 'Takum', 'Ibi', 'Donga'] },
  { name: 'Bauchi Branch', location: 'Bauchi, Bauchi State', type: 'Standard', details: 'Regional expression', members: '280 members', administrator: 'Esther Musa', color: 'blue', nodes: ['Bauchi', 'Dass', 'Tafawa', 'Alkaleri'] },
  { name: 'Abuja Branch', location: 'Abuja, FCT', type: 'Standard', details: 'Capital expression', members: '360 members', administrator: 'Samuel John', color: 'green', nodes: ['Central', 'Garki', 'Kubwa', 'Lugbe'] },
  { name: 'Kaduna Branch', location: 'Kaduna, Kaduna State', type: 'Complex', details: 'Regional expression', members: '310 members', administrator: 'Ruth David', color: 'violet', nodes: ['Kaduna', 'Zaria', 'Kafanchan', 'Saminaka'] },
  { name: 'Yola Branch', location: 'Yola, Adamawa State', type: 'Standard', details: 'Regional expression', members: '240 members', administrator: 'Joseph Mark', color: 'blue', nodes: ['Yola', 'Mubi', 'Numan', 'Ganye'] },
];

function BranchDiagram({ branch }) {
  return (
    <div className={`branch-diagram ${branch.color}`} aria-hidden='true'>
      <span className={`branch-type-pill ${branch.type.toLowerCase()}`}>{branch.type}</span>
      <span className='branch-connector connector-main' />
      <span className='branch-connector connector-left' />
      <span className='branch-connector connector-right' />
      {branch.nodes.map((node, index) => (
        <span className={`branch-node node-${index + 1}`} key={node}><i />{node}</span>
      ))}
      <span className='branch-diagram-footer'><Church size={12} /> Branch network</span>
    </div>
  );
}

function BranchCard({ branch }) {
  return (
    <article className='branch-card'>
      <BranchDiagram branch={branch} />
      <h2>{branch.name}</h2>
      <p className='branch-location'><MapPin size={13} aria-hidden='true' /> {branch.location}</p>
      <div className='branch-meta'>
        <span><UsersRound size={13} /> {branch.members}</span>
        <span><Clock3 size={13} /> {branch.details}</span>
      </div>
      <p className='branch-admin-assigned'><ShieldCheck size={15} aria-hidden='true' /><span><small>BRANCH ADMIN</small>{branch.administrator}</span></p>
      <div className='branch-card-footer'>
        <span className='branch-services' aria-label='Church branch and location'><i><Church size={14} /></i><i><MapPinned size={14} /></i></span>
        <button className='branch-preview-button' type='button'>See Preview <span aria-hidden='true'>↗</span></button>
      </div>
    </article>
  );
}

export function BranchesPage() {
  return (
    <section className='branches-page' aria-labelledby='branches-title'>
      <div className='branches-page-heading'>
        <div>
          <p className='branches-eyebrow'>ORGANIZATION</p>
          <h1 id='branches-title'>Branches</h1>
          <p className='branches-description'>Explore your church branches and their expression networks.</p>
        </div>
      </div>
      <div className='branches-card-grid'>
        {branches.map((branch) => <BranchCard branch={branch} key={branch.name} />)}
      </div>
    </section>
  );
}
