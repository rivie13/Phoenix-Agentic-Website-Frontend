/** @type {import('next').NextConfig} */
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://login.microsoftonline.com https: https://*.list-manage.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://login.microsoftonline.com https://*.list-manage.com",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  async headers() {
    if (!isProduction) {
      return [];
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
