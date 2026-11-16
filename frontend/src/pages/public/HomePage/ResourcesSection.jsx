import { useEffect, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudDownloadIcon,
  GridViewIcon,
  MusicNote01Icon,
} from '@hugeicons/core-free-icons';
import './ResourcesSection.css';
import { apiUrl } from '../../../utils/api';

const categoryIcons = { 'All materials': GridViewIcon, Hymn: MusicNote01Icon };

const hymnVerses = [
  [
    'Amazing grace! How sweet the sound',
    'That saved a wretch like me!',
    'I once was lost, but now am found;',
    'Was blind, but now I see.',
  ],
  [
    "'Twas grace that taught my heart to fear,",
    'And grace my fears relieved;',
    'How precious did that grace appear',
    'The hour I first believed!',
  ],
  [
    'Through many dangers, toils, and snares,',
    'I have already come;',
    "'Tis grace hath brought me safe thus far,",
    'And grace will lead me home.',
  ],
  [
    'Through many dangers, toils, and snares,',
    'I have already come;',
    "'Tis grace hath brought me safe thus far,",
    'And grace will lead me home.',
  ],
  [
    'Through many dangers, toils, and snares,',
    'I have already come;',
    "'Tis grace hath brought me safe thus far,",
    'And grace will lead me home.',
  ],
  [
    'Through many dangers, toils, and snares,',
    'I have already come;',
    "'Tis grace hath brought me safe thus far,",
    'And grace will lead me home.',
  ],
];

const publishedHymnStorageKey = 'cap-assembly-published-hymn';

function readPublishedHymnVerses() {
  try {
    const savedHymn = JSON.parse(
      window.localStorage.getItem(publishedHymnStorageKey) ?? 'null',
    );
    if (!savedHymn?.lyrics?.trim()) return hymnVerses;

    return savedHymn.lyrics
      .trim()
      .split(/\n\s*\n/)
      .map((verse) =>
        verse
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      )
      .filter((verse) => verse.length);
  } catch {
    return hymnVerses;
  }
}

const hymnResource = {
  id: 'amazing-grace',
  title: 'Amazing Grace',
  category: 'Hymn',
  description: 'A classic hymn of grace and hope.',
  type: 'hymn',
};

const documentCategories = {
  'sunday-bulletin': {
    title: 'Sunday Bulletin',
    category: 'Bulletins',
    day: 'Sunday',
  },
  'wednesday-bulletin': {
    title: 'Wednesday Bulletin',
    category: 'Bulletins',
    day: 'Wednesday',
  },
  'bible-study-guide': {
    title: 'Bible Study Guide',
    category: 'Bible study',
    day: 'Wednesday',
  },
  'friday-prayer-meeting': {
    title: 'Friday Prayer Meeting',
    category: 'Prayer',
    day: 'Friday',
  },
  'sunday-school-guide': {
    title: 'Sunday School Guide',
    category: 'Sunday school',
    day: 'Sunday',
  },
};

export const Resources = () => {
  const [category, setCategory] = useState('All materials');
  const [publicHymnVerses, setPublicHymnVerses] = useState(
    readPublishedHymnVerses,
  );
  const [documents, setDocuments] = useState([]);
  const categories = ['All materials', 'Hymn'];
  useEffect(() => {
    fetch(apiUrl('/api/resources'))
      .then((response) => response.json())
      .then((result) => setDocuments(result.data?.documents ?? []))
      .catch(() => setDocuments([]));

    function handlePublishedHymnChange(event) {
      if (event.key === publishedHymnStorageKey) {
        setPublicHymnVerses(readPublishedHymnVerses());
      }
    }

    window.addEventListener('storage', handlePublishedHymnChange);
    return () =>
      window.removeEventListener('storage', handlePublishedHymnChange);
  }, []);
  const resourceTypes = [
    ...documents
      .map((document) => {
        const details = documentCategories[document.category];
        return details
          ? {
              ...details,
              id: document.id,
              fileName: document.name,
              date: new Date(document.uploadedAt).toLocaleDateString(),
              fileUrl: apiUrl(`/api/resources/${document.id}/file`),
            }
          : null;
      })
      .filter(Boolean),
    hymnResource,
  ];
  const visible = resourceTypes.filter(
    (item) => category === 'All materials' || item.category === category,
  );

  return (
    <section
      className='church-resources'
      id='resources-section'
      aria-labelledby='resources-title'
    >
      <div className='church-resources-inner'>
        <SectionHeading
          icon={CloudDownloadIcon}
          label='Grow in the Word'
          titleId='resources-title'
        >
          <span>Church</span> Resources
        </SectionHeading>
        <p className='church-resources-intro'>
          Browse our materials, read online, or download a PDF to keep.
        </p>
        <div className='church-resources-toolbar'>
          <div
            className='church-resources-filters'
            role='group'
            aria-label='Filter resources'
          >
            {categories.map((name) => (
              <button
                key={name}
                type='button'
                aria-pressed={name === category}
                onClick={() => setCategory(name)}
              >
                <HugeiconsIcon
                  icon={categoryIcons[name]}
                  size={18}
                  aria-hidden='true'
                />
                <span>{name}</span>
                <span
                  className='church-resource-filter-count'
                  aria-hidden='true'
                >
                  {name === 'All materials'
                    ? resourceTypes.length
                    : resourceTypes.filter((item) => item.category === name)
                        .length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ul className='church-resources-list'>
          {visible.map((item) =>
            item.type === 'hymn' ? (
              <li className='church-resource-hymn' key={item.id}>
                <div className='church-resource-hymn-heading'>
                  <span className='church-resource-hymn-icon'>
                    <HugeiconsIcon
                      icon={MusicNote01Icon}
                      size={22}
                      aria-hidden='true'
                    />
                  </span>
                  <div>
                    <span className='church-resource-hymn-label'>Hymn</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                {category === 'Hymn' ? (
                  <div
                    className='church-resource-hymn-verses'
                    aria-label={`${item.title} lyrics`}
                  >
                    {publicHymnVerses.map((verse, index) => (
                      <div className='church-resource-hymn-verse' key={index}>
                        <span>Verse {index + 1}</span>
                        <p>
                          {verse.map((line) => (
                            <span key={line}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    className='church-resource-hymn-read'
                    type='button'
                    onClick={() => setCategory('Hymn')}
                  >
                    Read lyrics
                  </button>
                )}
              </li>
            ) : (
              <li className='church-resource' key={item.id}>
                <div className='church-resource-file' aria-hidden='true'>
                  <svg
                    width='26'
                    height='30'
                    viewBox='0 0 26 30'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  >
                    <path d='M4 1h11l7 7v21H4z' />
                    <path d='M15 1v8h7M8 15h10M8 20h10' />
                  </svg>
                  <span>PDF</span>
                </div>
                <div className='church-resource-details'>
                  <h3>{item.title}</h3>
                  <p className='church-resource-description'>{item.fileName}</p>
                  <div>
                    <span className='church-resource-new-badge'>PDF</span>
                    <span className='church-resource-date'>{item.date}</span>
                    <span className='church-resource-day'>{item.day}</span>
                  </div>
                </div>

                <div className='church-resource-actions'>
                  <a
                    className='church-resource-open'
                    href={item.fileUrl}
                    target='_blank'
                    rel='noreferrer'
                    title={`Open ${item.fileName}`}
                  >
                    Open
                  </a>
                  <a
                    className='church-resource-download'
                    href={`${item.fileUrl}?download=1`}
                    title={`Download ${item.fileName}`}
                  >
                    Download
                  </a>
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
};
