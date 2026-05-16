import { Fragment } from 'react';
import { useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { BranchAside } from './BranchAside';
import { BranchLocations } from '../Branch/BranchLocations';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import BranchImage01 from '../../assets/images/branch-image-01.jpg';
import './BranchPage.css';
import '../../index.css';

export const BranchPage = () => {
  const params = useParams();
  const { expression } = params;
  console.log(expression);

  return (
    <Fragment>
      <title>Bauchi Branch</title>
      <link rel="shortcut icon" href="images/capa-logo.png" type="image/x-icon" />
      <Navbar />

      <section className="branch" aria-labelledby="branch-heading">
        <div className="branch-hero-image">
          <img src={BranchImage01} alt="Bauchi Expression — church worship" />
          <div className="branch-name">Bauchi <span>Expression</span></div>
        </div>
        <div className="branch-content center-container">
          <main id="main-content" className="branch-main" role="main">
            <section className="branch-about">
              <h2>About Bauchi Branch</h2>
              <div className="branch-about-1">
                Christ Alive Power Assembly — Bauchi Expression is a vibrant
                community focused on worship, discipleship, and outreach. We
                welcome people from all backgrounds to join our services, small
                groups, and community programs. Expect warm hospitality,
                Bible-centred teaching, and practical care. As one of the church’s
                established branches in Nigeria, the Bauchi State Expression
                stands out as a growing spiritual family with five active branches
                across Bauchi main town. Each branch is committed to spreading the
                message of Christ, building believers, and serving the local
                community with love and excellence.
              </div>
              <p className="branch-about-2">
                Christ Alive Power Assembly — Bauchi Expression is a vibrant
                community focused on worship, discipleship, and outreach. We
                welcome people from all backgrounds to join our services, small
                groups, and community programs. Expect warm hospitality,
                Bible-centred teaching, and practical care. As one of the church’s
                established branches in Nigeria, the Bauchi State Expression
                stands out as a growing spiritual family with five active branches
                across Bauchi main town. Each branch is committed to spreading the
                message of Christ, building believers, and serving the local
                community with love and excellence.
              </p>
            </section>
            <section className="branch-services">
              <h3>Service Times</h3>
              <ul className="service-list">
                <li className='service-list-item'>
                  <div className='service-list-item-left'>
                    <HugeiconsIcon icon={Calendar03Icon}
                      className='service-list-item-left-icon' />
                    <strong>Sundays</strong>
                  </div>
                  <span>Sunday Service - 9:00 AM</span>
                </li>
                <li className='service-list-item'>
                  <div className='service-list-item-left'>
                    <HugeiconsIcon icon={Calendar03Icon}
                      className='service-list-item-left-icon' />
                    <strong>Mondays</strong>
                  </div>
                  <span>Prophetic Prayers - 5:00PM</span>
                </li>
                <li className='service-list-item'>
                  <div className='service-list-item-left'>
                    <HugeiconsIcon icon={Calendar03Icon}
                      className='service-list-item-left-icon' />
                    <strong>Wednesdays</strong>
                  </div>
                  <span>Bible Study - 5:00 PM </span>
                </li>
                <li className='service-list-item'>
                  <div className='service-list-item-left'>
                    <HugeiconsIcon icon={Calendar03Icon}
                      className='service-list-item-left-icon' />
                    <strong>Fridays</strong>
                  </div>
                  <span>Prayer &amp; Meeting - 5:00 PM</span>
                </li>
              </ul>
            </section>
            <BranchLocations />
          </main>
          <BranchAside />
        </div>
      </section>
      <Footer />
    </Fragment>
  );
};