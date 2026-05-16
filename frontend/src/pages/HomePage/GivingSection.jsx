import GivingImage from '../../assets/images/lead-pastor.jpg';
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
          <img src={GivingImage} className='cta-img' alt="" />
        </div>
      </div>
    </div>
  );
};