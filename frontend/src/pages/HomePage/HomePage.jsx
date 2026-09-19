import { About } from './AboutSection';
import { Branches } from './BranchesSection';
import { Resources } from './ResourcesSection';
import { Upcoming } from './UpcomingSection';
import { Pastor } from './PastorSection';
import { Giving } from './GivingSection';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Hero } from './Hero';
import { SectionReveal } from './SectionReveal';
import Logo from '../../assets/images/capa-logo.png';
import '../../index.css';
import './HomePage.css';
import './HomePageMobile.css';

export const HomePage = () => {
  return (
    <>
      <title>Christ Alive Power Assembly Official Website</title>
      <link rel="shortcut icon" href={Logo} type="image/x-icon" />

      <header className="js-header">
        <Navbar />
        <Hero />
      </header>

      <main className="main">
        <SectionReveal effect="about"><About /></SectionReveal>
        <SectionReveal effect="pastor"><Pastor /></SectionReveal>
        <SectionReveal effect="branches"><Branches /></SectionReveal>
        <SectionReveal effect="resources"><Resources /></SectionReveal>
        <SectionReveal effect="upcoming"><Upcoming /></SectionReveal>
        <SectionReveal effect="giving"><Giving /></SectionReveal>
      </main>
      <SectionReveal effect="footer"><Footer /></SectionReveal>
      <div className="scroll-to-top js-scroll-to-top hidden">
        <img src="images/icons/arrow-up-icon.svg" alt="Scroll to top button" />
      </div>
    </>
  );
};
