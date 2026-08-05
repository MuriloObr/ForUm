/* eslint-disable react-refresh/only-export-components */
import { useQuery } from '@tanstack/react-query'
import type {
  QueryClient,
  QueryFunction,
  QueryKey,
} from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { expect } from 'vitest'

export function QueryProbe({
  queryKey,
  queryFn,
}: {
  queryKey: QueryKey
  queryFn: QueryFunction<unknown>
}) {
  useQuery(queryKey, queryFn)
  return null
}

export async function waitForIdle(
  queryClient: QueryClient,
  queryKey: QueryKey,
) {
  await waitFor(() => {
    const [query] = queryClient.getQueryCache().findAll({ queryKey })
    expect(query.state.fetchStatus).toBe('idle')
  })
}
