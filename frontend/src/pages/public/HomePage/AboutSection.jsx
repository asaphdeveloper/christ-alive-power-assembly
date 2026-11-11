const CongregationImage = '/images/slide-02-1280.webp';
import './AboutSection.css';

export const About = () => {
  return (
    <section className="church-about" id="about-section" aria-labelledby="about-title">
      <div className="church-about-inner">
        <figure className="church-about-photo">
          <img srcSet="/images/slide-02-640.webp 640w, /images/slide-02-1280.webp 1280w, /images/slide-02-2048.webp 2048w" sizes="(max-width: 750px) 100vw, 50vw" decoding="async"
            src={CongregationImage}
            alt="Members of Christ Alive Power Assembly gathered for a church service"
            loading="lazy" fetchPriority="low"
            width="2048"
            height="1365"
          />
          <figcaption>
            <span>Our shared purpose</span>
            <p>“That I may know Him.”</p>
            <cite>Philippians 3:10</cite>
          </figcaption>
        </figure>

        <div className="church-about-content">
          <p className="church-about-eyebrow">About us / Christ Alive Power Assembly</p>
          <h2 id="about-title">Rooted in Christ.<br /><span>Growing together.</span></h2>
          <p className="church-about-description">
            Christ Alive Power Assembly is a Spirit-filled church committed to
            knowing Jesus Christ and making Him known. Through worship, biblical
            teaching, and fellowship, we help people grow in faith, discover
            God’s purpose, and live it out in everyday life.
          </p>

          <dl className="church-about-values">
            <div>
              <dt>Worship</dt>
              <dd>Honouring God together.</dd>
            </div>
            <div>
              <dt>Grow</dt>
              <dd>Grounded in His Word.</dd>
            </div>
            <div>
              <dt>Serve</dt>
              <dd>Sharing Christ’s love.</dd>
            </div>
          </dl>

          <a className="church-about-link" href="#branches-section">
            Find a church near you <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};
