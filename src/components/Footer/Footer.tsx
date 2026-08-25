import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo/asman_logo_nav.png'
import { menuKeys } from '../shared/navigation'
import './Footer.scss'

// Same small inline-icon approach as Hero.tsx (currentColor, sized in em so
// each usage site controls color/size via CSS). Kept local to Footer since
// none of these are shared with Hero's own icon set.
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M5.3 4.2h3.1l1.4 3.8-2 1.6a12.4 12.4 0 0 0 5.8 5.8l1.6-2 3.8 1.4v3.1c0 1-.86 1.77-1.85 1.63A16.9 16.9 0 0 1 3.67 6.05C3.53 5.06 4.3 4.2 5.3 4.2Z"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.4" stroke="currentColor" strokeWidth="2.1" />
    <path d="m4.5 6.8 7.5 6 7.5-6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 21.5c4.4-4.6 7-8.4 7-12A7 7 0 1 0 5 9.5c0 3.6 2.6 7.4 7 12Z"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.4" r="2.3" stroke="currentColor" strokeWidth="2.1" />
  </svg>
)

// Used for the new "Manzil / Address" column heading — an industrial-zone
// mark (distinct from PinIcon, which stays on the address line itself) so
// the column reads as its own topic rather than a repeat of the pin above.
const ZoneIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M3.5 20.5v-8.2l4-2.9v2.6l4-2.9v2.6l4-2.9v11.7M3.5 20.5h17"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15.5 20.5V8.6l4.6-3.1v15" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 15.2h1.4M7 17.8h1.4M11 15.2h1.4M11 17.8h1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="m3 12.6 16.4-6.9c.9-.38 1.7.32 1.36 1.34l-2.8 12.9c-.24 1.06-1.24 1.32-2 .68l-4.2-3.44-2.36 2.28c-.32.3-.6.14-.7-.24l-.9-3.6-4.3-1.4c-.9-.28-.9-1.24.5-1.62Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="m8.5 15.6 8.9-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M14.7 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H9.3v2.96h2.36V21h3.04Z"
      fill="currentColor"
    />
  </svg>
)

// Drop motif carried over from Hero's eyebrow badge — used here purely as a
// drifting background accent so the footer echoes the hero's visual
// language instead of introducing an unrelated shape system.
const DropIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 3.2c2.9 3.6 6.4 8.1 6.4 11.6a6.4 6.4 0 1 1-12.8 0c0-3.5 3.5-8 6.4-11.6Z"
      fill="currentColor"
    />
  </svg>
)

// href goes to the real destination (tel:/mailto:/https:), aria comes from
// footer.social.<key> in the locale files.
const socialLinks = [
  { key: 'telegram', href: 'https://t.me/asman', Icon: TelegramIcon },
  { key: 'instagram', href: 'https://instagram.com/asman', Icon: InstagramIcon },
  { key: 'facebook', href: 'https://facebook.com/asman', Icon: FacebookIcon },
]

// Mirrors Hero's AnimatedWords, but reveal is gated by the footer's own
// scroll-triggered .in-view class (see below) rather than by mount — words
// stay invisible (see .fw-word in Footer.scss) until in-view flips true,
// at which point each plays its own delayed entrance, same stagger math
// as Hero's title.
function FooterHeadingWords({ text, startIndex, keyPrefix }: { text: string; startIndex: number; keyPrefix: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={`${keyPrefix}${i}`} className="fw-word" style={{ animationDelay: `${(startIndex + i) * 0.08}s` }}>
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  // Unlike Navbar/Hero (which animate on mount, since they're already on
  // screen at load), the footer sits below the fold — so its reveal is
  // triggered the first time it actually scrolls into view, via
  // IntersectionObserver. Once triggered it's left permanently active
  // (observer.disconnect()); it's a one-time entrance, not a replay every
  // time the user scrolls past it.
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Floating "back to top" button — separate from the reveal-on-view
  // animation above, this tracks live scroll position the whole time the
  // page is open (same pattern as Navbar's own scrolled-state effect).
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const year = new Date().getFullYear()

  // footer.heading in the locale files carries its own titleStart /
  // titleAccent / titleEnd, same shape as hero.slides[i] — so the accent
  // word can keep its own colour/em treatment while the whole phrase still
  // shares one continuous word-index stagger.
  const heading = t('footer.heading', { returnObjects: true }) as {
    titleStart: string
    titleAccent: string
    titleEnd: string
  }
  const startCount = heading.titleStart.split(' ').length
  const accentCount = heading.titleAccent.split(' ').length

  return (
    <footer ref={sectionRef} className={inView ? 'footer in-view' : 'footer'}>
      {/* Decorative glow field: a soft radial accent drifting behind the
         content, plus a handful of the hero's drop motif floating slowly
         in the background — always animating once mounted, independent of
         the in-view content reveal below. */}
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-drops" aria-hidden="true">
        <span className="drop drop-a"><DropIcon /></span>
        <span className="drop drop-b"><DropIcon /></span>
        <span className="drop drop-c"><DropIcon /></span>
      </div>
      <div className="footer-shimmer" aria-hidden="true" />

      <div className="footer-inner">
        <h2 className="footer-heading">
          <FooterHeadingWords text={heading.titleStart} startIndex={0} keyPrefix="fs" />{' '}
          <em>
            <FooterHeadingWords text={heading.titleAccent} startIndex={startCount} keyPrefix="fa" />
          </em>{' '}
          <FooterHeadingWords text={heading.titleEnd} startIndex={startCount + accentCount} keyPrefix="fe" />
        </h2>

        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Asman home">
              <img src={logo} alt="Asman" />
            </Link>
            <p className="footer-about">{t('footer.about')}</p>
            <div className="footer-social">
              {socialLinks.map(({ key, href, Icon }, index) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`footer.social.${key}`)}
                  style={{ animationDelay: `${0.5 + index * 0.08}s` }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>{t('footer.menuTitle')}</h3>
            <nav aria-label="Footer">
              {menuKeys.map((key, index) => (
                <Link key={key} to={key === 'home' ? '/' : `/${key}`} style={{ animationDelay: `${0.2 + index * 0.06}s` }}>
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-col footer-contact">
            <h3>{t('footer.contactTitle')}</h3>
            <a href={`tel:${t('footer.phoneHref')}`} style={{ animationDelay: '.4s' }}>
              <PhoneIcon /> {t('footer.phone')}
            </a>
            <a href={`mailto:${t('footer.email')}`} style={{ animationDelay: '.47s' }}>
              <MailIcon /> {t('footer.email')}
            </a>
          </div>

          <div className="footer-col footer-address">
            <h3>
              <ZoneIcon /> {t('footer.addressTitle')}
            </h3>
            <span style={{ animationDelay: '.54s' }}>
              <PinIcon /> {t('footer.address')}
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-bottom-dot" aria-hidden="true" />
          <p>
            © {year} {t('brand')}. {t('footer.rights')}
          </p>
        </div>
      </div>

      <button
        className={showTop ? 'scroll-top visible' : 'scroll-top'}
        onClick={scrollToTop}
        aria-label={t('footer.scrollTop')}
      >
        <ArrowUpIcon />
      </button>
    </footer>
  )
}