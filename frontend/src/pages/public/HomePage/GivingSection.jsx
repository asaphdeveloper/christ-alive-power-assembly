const GivingImage = '/images/lead-pastor-1280.webp';
import './GivingSection.css';

export const Giving = () => {
  return (
    <div className="section-cta">
      <div className="cta-box">
        <div className="cta-text-box">
          <h2>Make Your Givings</h2>
          <p>
            Healthy, tasty and hassle-free meals are waiting for you. Start
            eating well today. You can cancel or pause anytime. And the first
            meal is on us! You can cancel or pause anytime. And the first meal
            is on us! You can cancel or pause anytime.
          </p>
          <a className='cta-button' href="#">Give Now</a>
        </div>
        <div className="cta-img-box" role="img" aria-label="Giving">
          <img srcSet="/images/lead-pastor-640.webp 640w, /images/lead-pastor-1280.webp 1280w, /images/lead-pastor-2048.webp 2048w" sizes="(max-width: 750px) 100vw, 50vw" loading="lazy" fetchPriority="low" decoding="async" width="2048" height="1365" src={GivingImage} className='cta-img' alt="" />
        </div>
      </div>
    </div>
  );
};