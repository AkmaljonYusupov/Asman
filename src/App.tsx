import { useEffect, useState } from 'react'
import { NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import slider01 from './slider/slider01/slider01.png'
import slider02 from './slider/slider02/slider02.png'
import slider03 from './slider/slider03/slider03.png'
import bucket01 from './slider/slider01/slider_chelak01.png'
import bucket02 from './slider/slider02/slider_chelak02.png'
import bucket03 from './slider/slider03/slider_chelak03.png'
import logo from './logo/asman_logo_nav.png'

const logoImages = import.meta.glob('./logo/*.{png,PNG}', { eager: true, import: 'default', query: '?url' }) as Record<string, string>
const flags = ['uz', 'ru', 'en'].reduce<Record<string, string | undefined>>((result, lang) => {
  result[lang] = Object.entries(logoImages).find(([path]) => new RegExp(`/${lang}\\.png$`, 'i').test(path))?.[1]
  return result
}, {})

function Flag({ lang }: { lang: string }) {
  return flags[lang] ? <img className="flag" src={flags[lang]} alt="" /> : <i className={`flag flag-${lang}`}></i>
}

const menuKeys = ['home', 'about', 'products', 'projects', 'news', 'contact'] as const
const slides = [
  { image: slider01, bucket: bucket01 },
  { image: slider02, bucket: bucket02 },
  { image: slider03, bucket: bucket03 },
]

function Layout() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const changeLanguage = (lang: string) => { i18n.changeLanguage(lang); localStorage.setItem('asman-language', lang); setLanguageOpen(false) }

  return <><header className="header"><NavLink to="/" className="logo" aria-label="Asman home"><img src={logo} alt="Asman" /></NavLink>
    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={t('aria.menu')} aria-expanded={menuOpen}><i></i><i></i><i></i></button>
    <nav className={menuOpen ? 'navigation active' : 'navigation'}>{menuKeys.map((key) => <NavLink key={key} onClick={() => setMenuOpen(false)} to={key === 'home' ? '/' : `/${key}`}>{t(`nav.${key}`)}</NavLink>)}</nav>
    <div className="language"><button className="language-current" onClick={() => setLanguageOpen(!languageOpen)} aria-label={t('aria.language')} aria-expanded={languageOpen}><Flag lang={i18n.language} /><span>{i18n.language.toUpperCase()}</span></button>{languageOpen && <div className="language-menu">{[['uz', 'O‘zbekcha'], ['ru', 'Русский'], ['en', 'English']].map(([lang, label]) => <button key={lang} className={i18n.language === lang ? 'selected' : ''} onClick={() => changeLanguage(lang)}><Flag lang={lang} /><span>{label}</span>{i18n.language === lang && <b>✓</b>}</button>)}</div>}</div>
  </header><Outlet /></>
}

function Home() {
  const { t } = useTranslation(); const [current, setCurrent] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 6500); return () => clearInterval(timer) }, [])
  useEffect(() => { document.documentElement.style.setProperty('--nav-slider-image', `url("${slides[current].image}")`) }, [current])
  const select = (index: number) => setCurrent((index + slides.length) % slides.length)
  return <main><section className="hero" aria-roledescription="carousel"><img className="hero-background" src={slides[current].image} alt="" /><div className="hero-shade"></div><div className="hero-content" key={current}><p className="eyebrow"><span>♢</span>{t('hero.eyebrow')}</p><h1>{t('hero.titleStart')} <em>{t('hero.titleAccent')}</em> {t('hero.titleEnd')}</h1><p className="description">{t('hero.description')}</p><div className="hero-actions"><a className="button primary" href="#catalog">{t('hero.catalog')} <b>→</b></a><a className="button secondary" href="#contact">⌕ {t('hero.contact')}</a></div></div><div className="products" aria-hidden="true"><img className="bucket-large" src={slides[current].bucket} alt="" /><img className="bucket-small" src={slides[current].bucket} alt="" /></div><button className="arrow arrow-left" onClick={() => select(current - 1)} aria-label={t('aria.previous')}>‹</button><button className="arrow arrow-right" onClick={() => select(current + 1)} aria-label={t('aria.next')}>›</button><div className="dots">{slides.map((_, index) => <button key={index} onClick={() => select(index)} aria-label={`Slide ${index + 1}`} className={index === current ? 'active' : ''}></button>)}</div></section></main>
}
function Placeholder() { return <main className="placeholder"><h1>Asman</h1></main> }
export default function App() { return <Routes><Route element={<Layout />}><Route index element={<Home />} />{menuKeys.slice(1).map((key) => <Route key={key} path={key} element={<Placeholder />} />)}</Route></Routes> }
