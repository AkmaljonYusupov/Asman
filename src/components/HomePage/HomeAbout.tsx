import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './HomeAbout.scss'

/**
 * HomeAbout — the "who we are" teaser block that sits directly under
 * Hero on the home page (not the full About *page*, which lives at
 * components/About/About.tsx with its own PageHero). This is a
 * condensed preview: eyebrow + heading + description + a 2×2 grid of
 * trust points on the left, two façade photos and a highlight card on
 * the right, all inside one white rounded frame — matching the
 * reference design 1:1.
 *
 * Copy comes from `homeAbout.*` in en/ru/uz.json, next to `hero` and
 * `pageHero`. Images are expected at /public/images/home/about-1.jpg
 * and about-2.jpg — drop your own façade photos there (see the two
 * <img> tags below).
 */

type IconFn = () => ReactElement

// ===== Icons — same local, currentColor approach as Contact.tsx =====
const ShieldCheckIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 3.5 5 6v5.2c0 4.6 3 7.7 7 9.3 4-1.6 7-4.7 7-9.3V6l-7-2.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m9 12.2 2.1 2.1L15.3 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BuildingIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M7 21V6.4c0-.6.4-1.1 1-1.3l3.6-1.2c.6-.2 1.2.2 1.2.9V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.8 9.4 16 8.3c.6-.2 1.2.2 1.2.9V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 21h16M9.4 8.4h.01M9.4 11.6h.01M9.4 14.8h.01M9.4 18h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const LeafIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M19.5 4.5c.6 6-1.2 10.6-4.9 13-3 1.9-6.8 1.7-8.6-.1-1.8-1.8-2-5.6-.1-8.6 2.4-3.7 7-5.5 13-4.9Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 18c2.5-4 5.5-7 10-9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const DiamondIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M7 4h10l3.5 5-9 11-9-11L7 4Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2.5 9h19M9 4l-1.6 5L12 20l4.6-11L15 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LandmarkIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M3 21h18M4 21V10.5M20 21V10.5M4 10.5h16L12 4l-8 6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.3 10.5V21M11 10.5V21M13 10.5V21M16.7 10.5V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const ArrowRightIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M4.5 12h14.5M13.5 6.5 19.5 12l-6 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const POINT_KEYS = ['quality', 'modern', 'eco', 'beauty'] as const

const POINT_ICONS: Record<(typeof POINT_KEYS)[number], IconFn> = {
  quality: ShieldCheckIcon,
  modern: BuildingIcon,
  eco: LeafIcon,
  beauty: DiamondIcon,
}

// Flips `true` (and stays true) once the section scrolls into view.
// Same local hook as Contact.tsx — kept per-file rather than shared, so
// each component stays self-contained.
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
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
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

export default function HomeAbout() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLElement>(0.15)

  return (
    <section className="ha-section" ref={ref}>
      <div className={`ha-frame${inView ? ' in-view' : ''}`}>
        <div className="ha-text">
          <p className="ha-eyebrow">
            {t('homeAbout.eyebrow')}
            <span className="ha-eyebrow-dash" aria-hidden="true" />
          </p>

          <h2 className="ha-title">{t('homeAbout.title')}</h2>

          <p className="ha-description">{t('homeAbout.description')}</p>

          <ul className="ha-points">
            {POINT_KEYS.map((key, i) => {
              const Icon = POINT_ICONS[key]
              return (
                <li className="ha-point" key={key} style={inView ? { transitionDelay: `${0.15 + i * 0.08}s` } : undefined}>
                  <span className="ha-point-icon">
                    <Icon />
                  </span>
                  <span className="ha-point-text">
                    <strong>{t(`homeAbout.points.${key}.title`)}</strong>
                    <span>{t(`homeAbout.points.${key}.description`)}</span>
                  </span>
                </li>
              )
            })}
          </ul>

          <Link className="ha-cta" to="/about">
            {t('homeAbout.cta')}
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="ha-media">
          <div className="ha-media-grid">
            {/* O'z fasad suratlaringizni shu yerga qo'ying:
                public/images/home/about-1.jpg va about-2.jpg */}
            <img className="ha-media-image" src="/images/home/about-1.png" alt={t('homeAbout.imageAlt1')} loading="lazy" />
            <img className="ha-media-image" src="/images/home/about-2.png" alt={t('homeAbout.imageAlt2')} loading="lazy" />
          </div>

          <div className="ha-highlight">
            <span className="ha-highlight-icon">
              <LandmarkIcon />
            </span>
            <span className="ha-highlight-text">
              <strong>{t('homeAbout.highlight.title')}</strong>
              <span>{t('homeAbout.highlight.description')}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}