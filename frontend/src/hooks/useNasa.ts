import { useState, useEffect } from 'react'
import { api } from '@/services/api'

interface FetchState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
}

export function useNasa<T>(endpoint: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null, loading: true, error: null,
  })

  useEffect(() => {
    let cancelled = false
    api.get<{ data: T }>(endpoint)
      .then((res) => { if (!cancelled) setState({ data: res.data, loading: false, error: null }) })
      .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: String(err) }) })
    return () => { cancelled = true }
  }, [endpoint])

  return state
}
