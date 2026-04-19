const config = {
  baseurl: 'https://aniwatchtv.to',
  baseurl2: 'https://aniwatchtv.to',
  origin: '*',
  port: 5000,

  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },

  logLevel: 'INFO',
  enableLogging: false,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isNetlify: process.env.NETLIFY === 'true',
};

export default config;
