import RightUpGreenIcon from '../../assets/images/icons/right-up-green.png';
import RightUpBlackIcon from '../../assets/images/icons/right-up-black.png';
import './AboutSection.css';

export const About = () => {
  return (
    <section className="about-summary" id="about-section">
      <div className="about-us">
        <div className="about-us-heading">
          <h2>About Us</h2>
        </div>
        <div className="about-us-contents">
          <div className="about-us-content about-us-content-1 reveal-section">
            <div className="about-us-content-left">
              <img src={RightUpGreenIcon} alt="icon" />
            </div>
            <div className="about-us-content-right">
              <h3>Our Mission</h3>
              <p>
                At CAPA, our mission is to ignite a vibrant, Spirit-filled
                community that passionately pursues the presence of God,
                empowers believers to live out their faith boldly, and
                transforms lives through the word, and through the power of
                Jesus Christ.
              </p>

            </div>
          </div>
          <div className="about-us-content about-us-content-2 reveal-section">
            <div className="about-us-content-left">
              <img src={RightUpGreenIcon} alt="icon" />
            </div>
            <div className="about-us-content-right">
              <h3>Our Vision</h3>
              <p>
                Christ Alive Power Assembly envisions a dynamic,
                Spirit-empowered community where every believer is equipped to
                walk in the fullness of God's purpose and visionary plans. We
                are a church that transforms lives, and impacts the world
                through bold faith.
              </p>

            </div>
          </div>
          <div className="about-us-content about-us-content-3 reveal-section">
            <div className="about-us-content-left">
              <img src={RightUpGreenIcon} alt="icon" />
            </div>
            <div className="about-us-content-right">
              <h3>Our Goals</h3>
              <p>
                Christ Alive Power Assembly is dedicated to fostering a
                Spirit-filled community that glorifies Jesus Christ through
                worship, discipleship, and outreach. Our goal is to empower
                believers to live out their faith boldly, grow in spiritual
                maturity.
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};