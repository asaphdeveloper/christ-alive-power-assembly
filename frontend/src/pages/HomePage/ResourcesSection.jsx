import { HugeiconsIcon } from '@hugeicons/react';
import { DateTimeIcon, CloudDownloadIcon, Download01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import Card1Image from '../../assets/images/bulletin.jpg';
import Card2Image from '../../assets/images/bible-study.jpg';
import RightUpGreenIcon from '../../assets/images/icons/right-up-green.png';
import './ResourcesSection.css';

export const Resources = () => {
  return (
    <section className="resources-summary" id="resources-section">
      <div className="primary-heading resources-heading">
        <button className="btn-secondary resources-btn">
          <span>Resources</span>
          <HugeiconsIcon icon={CloudDownloadIcon} className='icon' />
        </button>
        <h2>Resources <span>Section</span></h2>
      </div>
      <div className="resources-body">
        <div className="resources-cards">
          <div className="resources-card resources-card-1 reveal-section">
            <div className="resources-card-image">
              <img src={Card1Image} alt="" />
            </div>
            <div className="resources-card-details">
              <div className="resources-card-details-row">
                <h3>Sunday Bulletin</h3>
                <span className="size-btn">882 kb</span>
              </div>
              <div className="date">
                <HugeiconsIcon className='calender-icon' icon={DateTimeIcon} />
                <p className="resources-card-date">7th August</p>
              </div>
              <p className="resources-card-secondary-text limit-to-2-lines">
                Click the download Button To Donwload The Bulletin For Sunday
                Or The View Button To View The Bulletin.
              </p>
              <div className="buttons">
                <a href="#" className="download-btn">
                  <span>Download</span>
                  <HugeiconsIcon className='download-btn-icon' icon={CloudDownloadIcon} alt="" />
                </a>
                <a href="#" className="view-btn">
                  <span>Open</span>
                  <HugeiconsIcon className='view-btn-icon' icon={ViewIcon} alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="resources-card resources-card-2 reveal-section">
            <div className="resources-card-image">
              <img src={Card2Image} alt="resource" />
            </div>
            <div className="resources-card-details">
              <div className="resources-card-details-row">
                <h3>Bible Study Guide</h3>
                <span className="size-btn">2 mb</span>
              </div>
              <div className="date">
                <HugeiconsIcon className='calender-icon' icon={DateTimeIcon} />
                <p className="resources-card-date">7th August</p>
              </div>
              <p className="resources-card-secondary-text limit-to-2-lines">
                Click the download Button To Donwload The Bible Study Guide
                For wednesday Bible Study Or The View Button To View It.
              </p>
              <div className="buttons">
                <a href="#" className="download-btn">
                  <span>Download</span>
                  <HugeiconsIcon className='download-btn-icon' icon={CloudDownloadIcon} alt="" />
                </a>
                <a href="#" className="view-btn">
                  <span>Open</span>
                  <HugeiconsIcon className='view-btn-icon' icon={ViewIcon} alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="resources-card resources-card-3 reveal-section">
            <div className="resources-card-image">
              <img src={Card1Image} alt="" />
            </div>
            <div className="resources-card-details">
              <div className="resources-card-details-row">
                <h3>Friday Prayer Guide</h3>
                <span className="size-btn">516 kb</span>
              </div>
              <div className="date">
                <HugeiconsIcon className='calender-icon' icon={DateTimeIcon} />
                <p className="resources-card-date">7th August</p>
              </div>
              <p className="resources-card-secondary-text limit-to-2-lines">
                Click the download Button To Donwload The Sermon For Sunday Or
                The Listen Button To Listen To The Sermon.
              </p>
              <div className="buttons">
                <a href="#" className="download-btn">
                  <span>Download</span>
                  <HugeiconsIcon className='download-btn-icon' icon={CloudDownloadIcon} alt="" />
                </a>
                <a href="#" className="view-btn">
                  <span>Open</span>
                  <HugeiconsIcon className='view-btn-icon' icon={ViewIcon} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};