import ArrowUpIcon from '../../../assets/images/icons/arrow-up-icon.svg';
import { About } from './AboutSection';
import { Branches } from './BranchesSection';
import { lazy, Suspense } from 'react';
const Resources = lazy(() => import('./ResourcesSection').then((module) => ({ default: module.Resources })));
import { Upcoming } from './UpcomingSection';
import { Pastor } from './PastorSection';
import { Giving } from './GivingSection';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { Hero } from './Hero';
import { SectionReveal } from './SectionReveal';
import '../../../index.css';
import './HomePage.css';
import './HomePageMobile.css';

export const HomePage = () => {
  return (
    <>

      <header className="js-header">
        <Navbar />
        <Hero />
      </header>

      <main id="main-content" tabIndex={-1} className="main">
        <SectionReveal effect="about"><About /></SectionReveal>
        <SectionReveal effect="pastor"><Pastor /></SectionReveal>
        <SectionReveal effect="branches"><Branches /></SectionReveal>
        <SectionReveal effect="resources"><Suspense fallback={<div className="resources-loading" aria-busy="true" />}><Resources /></Suspense></SectionReveal>
        <SectionReveal effect="upcoming"><Upcoming /></SectionReveal>
        <SectionReveal effect="giving"><Giving /></SectionReveal>
      </main>
      <SectionReveal effect="footer"><Footer /></SectionReveal>
      <div className="scroll-to-top js-scroll-to-top hidden">
        <img decoding="async" width="16" height="16" src={ArrowUpIcon} alt="Scroll to top button" />
      </div>
    </>
  );
};
