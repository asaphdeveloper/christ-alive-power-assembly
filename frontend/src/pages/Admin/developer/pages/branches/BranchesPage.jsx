import { Church, Mail, MapPin, Phone, Plus, ShieldCheck } from 'lucide-react';
import './BranchesPage.css';

const branches = [
  { name: 'Jos Branch', location: 'Jos, Plateau State', type: 'Standard', administrator: 'Grace James', adminPhone: '+234 803 555 0101', adminEmail: 'grace.james@capa.org', color: 'violet', nodes: ['Central', 'North', 'South', 'East'] },
  { name: 'Wukari Branch', location: 'Wukari, Taraba State', type: 'Complex', administrator: 'Peter Daniel', adminPhone: '+234 803 555 0102', adminEmail: 'peter.daniel@capa.org', color: 'green', nodes: ['Wukari', 'Takum', 'Ibi', 'Donga'] },
  { name: 'Bauchi Branch', location: 'Bauchi, Bauchi State', type: 'Standard', administrator: 'Esther Musa', adminPhone: '+234 803 555 0103', adminEmail: 'esther.musa@capa.org', color: 'blue', nodes: ['Bauchi', 'Dass', 'Tafawa', 'Alkaleri'] },
  { name: 'Abuja Branch', location: 'Abuja, FCT', type: 'Standard', administrator: 'Samuel John', adminPhone: '+234 803 555 0104', adminEmail: 'samuel.john@capa.org', color: 'green', nodes: ['Central', 'Garki', 'Kubwa', 'Lugbe'] },
  { name: 'Kaduna Branch', location: 'Kaduna, Kaduna State', type: 'Complex', administrator: 'Ruth David', adminPhone: '+234 803 555 0105', adminEmail: 'ruth.david@capa.org', color: 'violet', nodes: ['Kaduna', 'Zaria', 'Kafanchan', 'Saminaka'] },
  { name: 'Yola Branch', location: 'Yola, Adamawa State', type: 'Standard', administrator: 'Joseph Mark', adminPhone: '+234 803 555 0106', adminEmail: 'joseph.mark@capa.org', color: 'blue', nodes: ['Yola', 'Mubi', 'Numan', 'Ganye'] },
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
      <div className='branch-admin-information'>
        <p className='branch-admin-assigned'><ShieldCheck size={15} aria-hidden='true' /><span><small>BRANCH ADMIN</small>{branch.administrator}</span></p>
        <div className='branch-admin-contact'>
          <p><Phone size={14} aria-hidden='true' /><span>{branch.adminPhone}</span></p>
          <p><Mail size={14} aria-hidden='true' /><span>{branch.adminEmail}</span></p>
        </div>
      </div>
      <div className='branch-card-footer'>
        <p className='branch-location'><MapPin size={13} aria-hidden='true' /><span>{branch.location}</span></p>
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
          <h1 id='branches-title'>Branches</h1>
          <p className='branches-description'>Explore your church branches and their expression networks.</p>
        </div>
        <button className='branches-add-button' type='button'>
          <Plus size={16} aria-hidden='true' />
          Add branch
        </button>
      </div>
      <div className='branches-card-grid'>
        {branches.map((branch) => <BranchCard branch={branch} key={branch.name} />)}
      </div>
    </section>
  );
}
