import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo/asman_logo_nav.png'
import Flag from '../shared/Flag'
import { menuKeys, languages } from '../shared/navigation'
import Offcanvas from '../Offcanvas/Offcanvas'
import './Navbar.scss'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('asman-language', lang)
    setLanguageOpen(false)
  }

  return (
    <>
      <header className="header">
        <NavLink to="/" className="logo" aria-label="Asman home" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Asman" />
        </NavLink>

        <nav className="navigation" aria-label="Primary">
          {menuKeys.map((key) => (
            <NavLink key={key} to={key === 'home' ? '/' : `/${key}`}>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="language">
          <button
            className="language-current"
            onClick={() => setLanguageOpen(!languageOpen)}
            aria-label={t('aria.language')}
            aria-expanded={languageOpen}
          >
            <Flag lang={i18n.language} />
            <span>{i18n.language.toUpperCase()}</span>
          </button>
          {languageOpen && (
            <div className="language-menu">
              {languages.map(([lang, label]) => (
                <button key={lang} className={i18n.language === lang ? 'selected' : ''} onClick={() => changeLanguage(lang)}>
                  <Flag lang={lang} />
                  <span>{label}</span>
                  {i18n.language === lang && <b>✓</b>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className={menuOpen ? 'menu-toggle active' : 'menu-toggle'}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('aria.menu')}
          aria-expanded={menuOpen}
          aria-controls="mobile-offcanvas"
        >
          <i></i><i></i><i></i>
        </button>
      </header>

      {/* Rendered as a sibling of <header>, not inside it — backdrop-filter/blur on
         .header would otherwise create a containing block that traps this
         fixed-position panel inside the header's own height. */}
      <Offcanvas open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}