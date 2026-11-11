const LeadPastor = '/images/lead-pastor-1280.webp';
import RightUpBlackIcon from '../../../assets/images/icons/right-up-black.png';
import './PastorSection.css';

export const Pastor = () => {
  return (
    <section className="pastor-summary" id="lead-pastor-section">
      <div className="pastor-image">
        <img srcSet="/images/lead-pastor-640.webp 640w, /images/lead-pastor-1280.webp 1280w, /images/lead-pastor-2048.webp 2048w" sizes="(max-width: 750px) 100vw, 430px" loading="lazy" fetchPriority="low" decoding="async" width="2048" height="1365" src={LeadPastor} alt="Lead pastor" />
      </div>
      <div className="pastor-details reveal-section">
        <div className="pastor-heading">
          <h2>Our Lead <span>Pastor</span></h2>
        </div>
        <div className="pastor-body">
          <div className="pastor-body-row">
            <div className="pastor-body-row-icon">
              <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" src={RightUpBlackIcon} alt="" />
            </div>
            <div>
              <h3>Spiritual Leader & Founding Pastor</h3>
              <p className="limit-to-4-lines">
                He is the visionary founder of Christ Alive Power Assembly,
                dedicated to building a Spirit-filled church that empowers
                believers, transforms lives, and impacts communities through
                faith, leadership, and service.
              </p>
            </div>
          </div>
          <div className="pastor-body-row">
            <div className="pastor-body-row-icon">
              <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" src={RightUpBlackIcon} alt="" />
            </div>
            <div>
              <h3>Passionate Spiritual Leader.</h3>
              <p className="limit-to-4-lines">
                Our lead pastor is deeply committed to guiding the church with
                wisdom, compassion, and unwavering faith. He inspires the
                congregation to grow spiritually and live out the teachings of
                Christ in everyday life.
              </p>
            </div>
          </div>
          <div className="pastor-body-row">
            <div className="pastor-body-row-icon">
              <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" src={RightUpBlackIcon} alt="" />
            </div>
            <div>
              <h3>Executive Director.</h3>
              <p className="limit-to-4-lines">
                He is the Executive Director and founder of Save Africa
                Initiative, a non-governmental organization dedicated to
                empowering communities and driving positive change across
                Africa through education, outreach, and humanitarian projects.
              </p>
            </div>
          </div>
        </div>
        <a href="#" className="btn-primary pastor-btn">
          <span>Learn More</span>
          <div className="btn-primary-icon center">
            <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" alt="" src={RightUpBlackIcon} />
          </div>
        </a>
      </div>
    </section>
  );
};