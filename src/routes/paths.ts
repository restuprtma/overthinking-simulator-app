const ROOTS = {
  AUTH: '/auth',
};

export const paths = {
  faqs: '/faqs',
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
    },
  },
  dashboard: {
    root: '/',
    sectorComponent: '/sector-component',
    orderbook: '/orderbook',
    orderbookPlayback: '/orderbook-playback',
    orderbookAnalysis: '/orderbook-analysis',
    tradebookAnalysis: '/tradebook-analysis',
    brokerAnalysis: {
      root: '/broker-analysis',
      brokerActivity: '/broker-analysis/broker-activity',
      stockActivity: '/broker-analysis/stock-activity',
    },
    settings: {
      branches: '/settings/branches',
      roles: '/settings/roles',
      users: '/settings/users',
      translationOverride: '/settings/translation-override',
    },
  },
};
