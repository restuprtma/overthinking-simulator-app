const ROOTS = {
  AUTH: '/auth',
};

export const paths = {
  faqs: '/faqs',
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  dashboard: {
    root: '/',
    settings: {
      roles: '/settings/roles',
      users: '/settings/users',
      credentials: '/settings/credentials',
    },
    simulator: {
      root: '/simulator',
      history: '/simulator/history',
      detail: (id: string) => `/simulator/${id}`,
    },
  },
};

