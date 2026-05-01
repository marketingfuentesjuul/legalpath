import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    // Sometimes React Router or other components might cause a scroll after the initial mount
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 10)
    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}

export default ScrollToTop
