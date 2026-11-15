import { useLocation } from 'react-router';

const pages = {
  '/': [
    'Christ Alive Power Assembly | Worship, Grow, Serve',
    'Discover Christ Alive Power Assembly, our church branches, upcoming programs, and resources to grow in faith.',
  ],
  '/login': [
    'Sign in | Christ Alive Power Assembly',
    'Sign in to your Christ Alive Power Assembly account.',
  ],
  '/admin/developer/overview': [
    'Developer Admin | Christ Alive Power Assembly',
    'Developer workspace for the Christ Alive Power Assembly website.',
  ],
  '/admin/all-admins': [
    'Admins | Christ Alive Power Assembly',
    'Manage the administrator directory for Christ Alive Power Assembly.',
  ],
  '/admin/branches': [
    'Branches | Christ Alive Power Assembly',
    'View and manage Christ Alive Power Assembly branches.',
  ],
  '/admin/general-overseer': [
    'General Overseer | Christ Alive Power Assembly',
    'General Overseer workspace for reviewing administrators and church branches.',
  ],
  '/admin/attendance': [
    'Church Attendance | Christ Alive Power Assembly',
    'Review attendance totals, service trends, and branch comparisons for Christ Alive Power Assembly.',
  ],
  '/admin/attendance-reports': [
    'Branch Attendance Reports | Christ Alive Power Assembly',
    'Review attendance reports submitted by Christ Alive Power Assembly branches.',
  ],
  '/admin/general-overseer/finance': [
    'Church Finance | Christ Alive Power Assembly',
    'Review financial activity and reports across Christ Alive Power Assembly branches.',
  ],
  '/admin/branch-media-admin': [
    'Branch Media Admin | Christ Alive Power Assembly',
    'Branch Media Admin workspace for Christ Alive Power Assembly.',
  ],
  '/admin/branch-media-admin/attendance': [
    'Branch Attendance | Christ Alive Power Assembly',
    'Record and review service attendance for your Christ Alive Power Assembly branch.',
  ],
  '/admin/branch-media-admin/visitors': [
    'Branch Visitors | Christ Alive Power Assembly',
    'Record and review visitors to your Christ Alive Power Assembly branch.',
  ],
  '/admin/branch-finance-secretary': [
    'Branch Finance Secretary | Christ Alive Power Assembly',
    'Branch Finance Secretary workspace for Christ Alive Power Assembly.',
  ],
  '/admin/headquater-media-admin/overview': [
    'Headquater Media Admin | Christ Alive Power Assembly',
    'Headquater Media Admin workspace for Christ Alive Power Assembly.',
  ],
  '/admin/upload-resource': [
    'Upload Resources | Christ Alive Power Assembly',
    'Manage headquarter media documents and hymn resources for Christ Alive Power Assembly.',
  ],
};

export function SEO() {
  const { pathname: routePath } = useLocation();
  const pathname = routePath.replace(/\/+$/, '') || '/';
  const [title, description] = pages[pathname] ?? [
    'Page not found | Christ Alive Power Assembly',
    'This page could not be found. Return to Christ Alive Power Assembly to explore our church and resources.',
  ];
  const isAdmin = pathname.startsWith('/admin');
  const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '');
  const canonical =
    siteUrl && pages[pathname] ? `${siteUrl}${pathname}` : undefined;
  const image = siteUrl ? `${siteUrl}/images/slide-02-1280.webp` : undefined;
  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      {canonical && <link rel='canonical' href={canonical} />}
      {(!pages[pathname] || isAdmin) && (
        <meta name='robots' content='noindex, follow' />
      )}
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='Christ Alive Power Assembly' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      {canonical && <meta property='og:url' content={canonical} />}
      {image && <meta property='og:image' content={image} />}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      {image && <meta name='twitter:image' content={image} />}
      {pathname === '/' && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Church',
                name: 'Christ Alive Power Assembly',
                ...(siteUrl && {
                  '@id': `${siteUrl}/#organization`,
                  url: siteUrl,
                  logo: `${siteUrl}/apple-touch-icon.png`,
                }),
              },
              {
                '@type': 'WebSite',
                name: 'Christ Alive Power Assembly',
                ...(siteUrl && {
                  url: siteUrl,
                  publisher: { '@id': `${siteUrl}/#organization` },
                }),
              },
            ],
          }).replace(/</g, '\\u003c')}
        </script>
      )}
    </>
  );
}
