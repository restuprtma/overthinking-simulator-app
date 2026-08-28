import type { AuthState, SignInParams, SignUpParams, AuthContextValue } from '../../types';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { configureAxiosAuth } from 'src/shared/lib/axios';
import { getGoogleIdToken } from 'src/shared/lib/firebase';

import * as authApi from '../../api';
import { AuthContext } from '../auth-context';
import {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpired,
} from './utils';

type Props = {
  children: React.ReactNode;
};

const INITIAL_STATE: AuthState = {
  loading: true,
  user: null,
  roles: [],
  permissions: [],
  isSuperAdmin: false,
};

export function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  const applySignOut = useCallback(() => {
    clearTokens();
    setState({ ...INITIAL_STATE, loading: false });
  }, []);

  const checkUserSession = useCallback(async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
      setState({ ...INITIAL_STATE, loading: false });
      return;
    }

    try {
      if (!accessToken || isAccessTokenExpired(accessToken)) {
        if (!refreshToken) {
          applySignOut();
          return;
        }
        const tokens = await authApi.refreshTokens(refreshToken);
        setTokens(tokens.access_token, tokens.refresh_token);
      }

      const me = await authApi.getMe();

      setState({
        loading: false,
        user: me.user,
        roles: me.roles,
        permissions: me.permissions,
        isSuperAdmin: me.is_super_admin,
      });
    } catch (error) {
      console.error('[auth] session check failed:', error);
      applySignOut();
    }
  }, [applySignOut]);

  useEffect(() => {
    configureAxiosAuth({
      getAccessToken,
      getRefreshToken,
      onRefresh: async (refreshToken) => {
        const tokens = await authApi.refreshTokens(refreshToken);
        setTokens(tokens.access_token, tokens.refresh_token);
        return tokens;
      },
      onUnauthorized: () => {
        applySignOut();
      },
    });

    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(async (params: SignInParams) => {
    const res = await authApi.signIn(params);
    setTokens(res.access_token, res.refresh_token);
    setState({
      loading: false,
      user: res.user,
      roles: res.roles,
      permissions: res.permissions,
      isSuperAdmin: false,
    });
  }, []);

  const signUp = useCallback(
    async (params: SignUpParams) => {
      await authApi.signUp(params);
      await signIn({ login: params.email, password: params.password });
    },
    [signIn]
  );

  const signInWithGoogle = useCallback(async () => {
    const idToken = await getGoogleIdToken();
    const res = await authApi.signInWithGoogle({ id_token: idToken });
    setTokens(res.access_token, res.refresh_token);
    setState({
      loading: false,
      user: res.user,
      roles: res.roles,
      permissions: res.permissions,
      isSuperAdmin: false,
    });
    return { isNewUser: res.is_new_user };
  }, []);

  const signOut = useCallback(
    async (options?: { allDevices?: boolean }) => {
      try {
        if (options?.allDevices) {
          await authApi.logoutAll();
        } else {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }
        }
      } catch (error) {
        console.error('[auth] sign out api failed:', error);
      } finally {
        applySignOut();
      }
    },
    [applySignOut]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      authenticated: !state.loading && !!state.user,
      unauthenticated: !state.loading && !state.user,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      checkUserSession,
    }),
    [state, signIn, signUp, signInWithGoogle, signOut, checkUserSession]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

