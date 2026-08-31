import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import bgPhoto from '../../assets/cta/cta-bg.jpg'
import './CtaBanner.scss'

/**
 * CtaBanner — the deep-blue "Loyihangizni biz bilan amalga oshiring!"
 * promotional banner, typically the last section on the home page
 * before Footer. Heading + description + three feature badges in
 * the middle, a vertical divider, then two white action cards
 * ("Contact us" / phone number) on the right.
 *
 * Same conventions as HomeAbout.tsx/WhyChooseUs.tsx: own local
 * useInView, word-by-word title reveal, staggered entrance, classes
 * and @keyframes use the `ctb-` prefix so they can't collide with the
 * other HomePage sections' identically-shaped ones (all load on the
 * same page).
 *
 * The banner's own background photo is loaded via `import` (same
 * reasoning as WhyChooseUs.tsx's icons: a missing file fails the
 * BUILD, not just a silent broken <img> at runtime). Put your own
 * photo at:
 *   src/assets/cta/cta-bg.jpg
 *
 * The phone number reuses `footer.phone` / `footer.phoneHref` — the
 * site's one real contact number — rather than a second, different
 * hard-coded number, so there's only ever one "official" phone shown
 * across the whole site.
 */

type IconFn = () => ReactElement

const ArrowRightIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M4.5 12h15M13.5 6.5 19.5 12l-6 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PhoneIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M6.6 3.5h3l1.7 4.2-2.1 1.5a12.5 12.5 0 0 0 6.8 6.8l1.5-2.1 4.2 1.7v3a2 2 0 0 1-2.3 2A17.5 17.5 0 0 1 4.6 5.8 2 2 0 0 1 6.6 3.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MedalIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <circle cx="12" cy="8.6" r="5.1" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M12 6.3 12.8 8l1.9.27-1.37 1.33.32 1.9L12 10.6l-1.65.9.32-1.9L9.3 8.27 11.2 8 12 6.3Z"
      fill="currentColor"
    />
    <path d="M9.2 13.3 7.9 20l4.1-2.1 4.1 2.1-1.3-6.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShieldIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M12 3.5 5 6v5.2c0 4.6 3 7.7 7 9.3 4-1.6 7-4.7 7-9.3V6l-7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m9 12.2 2.1 2.1L15.3 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClockIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.3" stroke="currentColor" strokeWidth="1.7" />
    <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BADGE_KEYS = ['quality', 'trust', 'delivery'] as const
type BadgeKey = (typeof BADGE_KEYS)[number]

const BADGE_ICONS: Record<BadgeKey, IconFn> = {
  quality: MedalIcon,
  trust: ShieldIcon,
  delivery: ClockIcon,
}

// Splits a title fragment into words, each animating in on its own
// delay — same technique as Hero.tsx's AnimatedWords / HomeAbout.tsx's
// AnimatedTitle.
function AnimatedTitle({ text, active, delayOffset = 0 }: { text: string; active: boolean; delayOffset?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="ctb-word" style={active ? { animationDelay: `${delayOffset + i * 0.06}s` } : { opacity: 0 }}>
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

// Flips `true` (and stays true) once the section scrolls into view.
// Same local hook as HomeAbout.tsx/Sertifikatpage.tsx/WhyChooseUs.tsx.
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

// Title length varies by translation, so everything after it (badges,
// divider, actions) waits for however long the title actually takes to
// finish — same dynamic-delay approach as HomeAbout.tsx/WhyChooseUs.tsx.
const WORD_DELAY_STEP = 0.06
const WORD_ANIM_DURATION = 0.7
const BADGES_BUFFER = 0.18
const BADGES_STAGGER = 0.09
const ACTIONS_BUFFER = 0.3
const ACTIONS_STAGGER = 0.1

export default function CtaBanner() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLElement>(0.2)

  const titleStart = t('homeCta.titleStart')
  const titleAccent = t('homeCta.titleAccent')
  const titleEnd = t('homeCta.titleEnd')
  const startCount = titleStart.split(' ').length
  const accentCount = titleAccent.split(' ').length
  const accentDelayOffset = startCount * WORD_DELAY_STEP
  const endDelayOffset = (startCount + accentCount) * WORD_DELAY_STEP
  const totalWords = startCount + accentCount + titleEnd.split(' ').length
  const titleFinish = (totalWords - 1) * WORD_DELAY_STEP + WORD_ANIM_DURATION
  const badgesDelay = titleFinish + BADGES_BUFFER
  const actionsDelay = titleFinish + ACTIONS_BUFFER

  return (
    <section className="ctb-section" ref={ref}>
      <div className={`ctb-banner${inView ? ' in-view' : ''}`}>
        <div className="ctb-bg-mask" aria-hidden="true">
          <img className="ctb-bg-photo" src={bgPhoto} alt="" draggable={false} />
          <span className="ctb-overlay" aria-hidden="true" />
          <span className="ctb-dotgrid" aria-hidden="true" />
          <span className="ctb-diagonal" aria-hidden="true" />
        </div>
        <div className="ctb-content">
          <h2 className="ctb-title">
            <AnimatedTitle text={titleStart} active={inView} delayOffset={0} />{' '}
            <em>
              <AnimatedTitle text={titleAccent} active={inView} delayOffset={accentDelayOffset} />
            </em>
            <br />
            <AnimatedTitle text={titleEnd} active={inView} delayOffset={endDelayOffset} />
          </h2>

          <p className="ctb-description">{t('homeCta.description')}</p>

          <ul className="ctb-badges">
            {BADGE_KEYS.map((key, i) => {
              const Icon = BADGE_ICONS[key]
              return (
                <li className="ctb-badge" key={key} style={inView ? { animationDelay: `${badgesDelay + i * BADGES_STAGGER}s` } : { opacity: 0 }}>
                  <span className="ctb-badge-icon">
                    <Icon />
                  </span>
                  <span className="ctb-badge-label">{t(`homeCta.badges.${key}`)}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="ctb-divider" aria-hidden="true" />

        <div className="ctb-actions">
          <Link className="ctb-action ctb-action--primary" to="/contact" style={inView ? { animationDelay: `${actionsDelay}s` } : { opacity: 0 }}>
            <span className="ctb-action-icon">
              <ArrowRightIcon />
            </span>
            <span className="ctb-action-text">
              <strong>{t('homeCta.contact.title')}</strong>
              <span>{t('homeCta.contact.subtitle')}</span>
            </span>
          </Link>

          <a
            className="ctb-action ctb-action--secondary"
            href={`tel:${t('footer.phoneHref')}`}
            style={inView ? { animationDelay: `${actionsDelay + ACTIONS_STAGGER}s` } : { opacity: 0 }}
          >
            <span className="ctb-action-icon">
              <PhoneIcon />
            </span>
            <span className="ctb-action-text ctb-action-text--phone">{t('footer.phone')}</span>
          </a>
        </div>
      </div>
    </section>
  )
}