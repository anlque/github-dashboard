const GITHUB_API = 'https://api.github.com';
const FORWARDED_HEADERS = [
  'content-type',
  'link',
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
  'x-ratelimit-used',
];

export default async function handler(request, response) {
  const pathParam = request.query.path;
  const segments = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';
  const queryIndex = request.url?.indexOf('?') ?? -1;
  const search = queryIndex >= 0 ? request.url.slice(queryIndex) : '';
  const targetUrl = `${GITHUB_API}/${segments}${search}`;

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dash-github-insights',
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const upstream = await fetch(targetUrl, { headers });
  const body = await upstream.text();

  response.status(upstream.status);

  for (const headerName of FORWARDED_HEADERS) {
    const value = upstream.headers.get(headerName);
    if (value) {
      response.setHeader(headerName, value);
    }
  }

  response.end(body);
}
