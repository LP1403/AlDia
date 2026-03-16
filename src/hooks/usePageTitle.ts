import { useEffect } from 'react'

const APP_TITLE = 'Al Día'

export function usePageTitle(pageTitle: string, description?: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} – ${APP_TITLE}` : APP_TITLE
    return () => {
      document.title = APP_TITLE
    }
  }, [pageTitle])

  useEffect(() => {
    if (!description) return
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    const prev = meta.getAttribute('content')
    meta.setAttribute('content', description)
    return () => {
      if (meta) meta.setAttribute('content', prev ?? '')
    }
  }, [description])
}
