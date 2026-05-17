'use client';

import { useMemo } from 'react';
import { useAuth } from '../app/providers';
import { ApiClient } from './api';

export function useApi() {
  const { getAccessToken } = useAuth();
  return useMemo(() => new ApiClient(getAccessToken), [getAccessToken]);
}
