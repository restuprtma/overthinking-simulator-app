import type { Reflection, ReflectionSummary } from '../types';

import axios, { endpoints } from 'src/shared/lib/axios';

// ----------------------------------------------------------------------

type Meta = { page: number; limit: number; total: number; total_pages: number };

export async function createReflection(payload: { thought: string }): Promise<Reflection> {
  const res = await axios.post<{ data: Reflection | null; message: string }>(
    endpoints.reflections.list,
    payload
  );
  if (!res.data.data) throw new Error(res.data.message || 'Failed to create reflection');
  return res.data.data;
}

export async function listReflections(
  params: { page?: number; limit?: number } = {}
): Promise<{ data: ReflectionSummary[]; meta: Meta }> {
  const res = await axios.get<{ data: ReflectionSummary[] | null; meta: unknown; message: string }>(
    endpoints.reflections.list,
    {
      params: {
        page: params.page,
        limit: params.limit,
      },
    }
  );
  const payload = res.data;
  const pagination = (payload.meta as { pagination?: Meta } | null | undefined)?.pagination;
  const data = payload.data ?? [];
  return {
    data,
    meta: {
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? data.length,
      total: pagination?.total ?? data.length,
      total_pages: pagination?.total_pages ?? 1,
    },
  };
}

export async function getReflection(id: string): Promise<Reflection> {
  const res = await axios.get<{ data: Reflection | null; message: string }>(
    endpoints.reflections.byId(id)
  );
  if (!res.data.data) throw new Error(res.data.message || 'Reflection not found');
  return res.data.data;
}
