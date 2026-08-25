import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo/asman_logo_nav.png'
import Flag from '../shared/Flag'
import { menuKeys, languages } from '../shared/navigation'
import './Offcanvas.scss'

type OffcanvasProps = {
  open: boolean
  onClose: () => void
}

export default function Offcanvas({ open, onClose }: OffcanvasProps) {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('asman-language', lang)
  }

  // Lock page scroll while the panel is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div
        className={open ? 'offcanvas-overlay active' : 'offcanvas-overlay'}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside id="mobile-offcanvas" className={open ? 'offcanvas active' : 'offcanvas'} aria-hidden={!open}>
        <div className="offcanvas-head">
          <NavLink to="/" className="offcanvas-brand" onClick={onClose}>
            <img src={logo} alt="Asman" />
          </NavLink>
          <button className="offcanvas-close" onClick={onClose} aria-label={t('aria.menu')}>✕</button>
        </div>

        <nav className="offcanvas-nav" aria-label="Mobile">
          {menuKeys.map((key, index) => (
            <NavLink
              key={key}
              to={key === 'home' ? '/' : `/${key}`}
              onClick={onClose}
              style={{ transitionDelay: open ? `${index * 45}ms` : '0ms' }}
            >
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="offcanvas-footer">
          <span className="offcanvas-languages-label">{t('aria.language')}</span>
          <div className="offcanvas-languages">
            {languages.map(([lang, label]) => (
              <button key={lang} className={i18n.language === lang ? 'selected' : ''} onClick={() => changeLanguage(lang)}>
                <Flag lang={lang} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}