const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const fetch = require('node-fetch');

const SITE_URL = 'https://ermic.ca';
const SPACE_ID = process.env.REACT_APP_SPACE_ID;
const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

const musicianQuery = (limit, skip) => `
  {
    musicianCollection(limit: ${limit}, skip: ${skip}) {
      items {
        slug
        sys {
          updatedAt
        }
      }
    }
  }
`;

async function fetchPaginatedMusicians() {
  const limit = 100;
  let skip = 0;
  let allItems = [];
  let hasMore = true;

  while (hasMore) {
    const query = musicianQuery(limit, skip);
    const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({query})
    });

    const { data } = await res.json();
    const items = data?.musicianCollection?.items || [];

    allItems = [...allItems, ...items];

    if (items.length < limit) {
      hasMore = false;
    } else {
      skip += limit;
    }
  }

  return allItems;
}

async function buildSitemap() {
  const sitemap = new SitemapStream({ hostname: SITE_URL });

  const staticRoutes = [
    '/',
    '/browse',
    '/results',
    '/results/occupation',
    '/results/performance',
    '/results/author',
    '/about',
    '/contact',
  ];

  staticRoutes.forEach(path =>
    sitemap.write({ url: path, priority: 0.8 })
  );

  const musicians = await fetchPaginatedMusicians();
  musicians.forEach(m => {
    sitemap.write({
      url: `/musician/${m.slug}`,
      lastmod: m.sys.updatedAt,
      priority: 0.7
    });
  });

  sitemap.end();

  const xml = await streamToPromise(sitemap);
  createWriteStream('./public/sitemap.xml').write(xml.toString());
}

buildSitemap().catch(console.error);