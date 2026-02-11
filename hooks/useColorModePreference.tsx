import { useCallback, useEffect, useState } from 'react'

export type ColorModePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'cb-color-mode-preference'
const CUSTOM_EVENT = 'cb-color-mode-preference'

function readPreference(): ColorModePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch {
    // ignore
  }
  return 'system'
}

function writePreference(value: ColorModePreference) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(CUSTOM_EVENT))
}

export function useColorModePreference() {
  const [preference, setPreferenceState] = useState<ColorModePreference>('system')

  useEffect(() => {
    setPreferenceState(readPreference())

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      setPreferenceState(readPreference())
    }
    const onCustom = () => setPreferenceState(readPreference())

    window.addEventListener('storage', onStorage)
    window.addEventListener(CUSTOM_EVENT, onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CUSTOM_EVENT, onCustom)
    }
  }, [])

  const setPreference = useCallback((value: ColorModePreference) => {
    setPreferenceState(value)
    writePreference(value)
  }, [])

  return { preference, setPreference }
}

