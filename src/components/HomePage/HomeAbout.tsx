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
 * the right, all inside one white rounded frame.
 *
 * The two photos use the same "shatter-in" technique as Hero.tsx's
 * ShatterImage: each is rendered as a grid of clipped duplicates of one
 * <img>, scattered off to the side at rest, and flown into place once
 * the section scrolls into view (see ShatterPhoto below).
 *
 * Copy comes from `homeAbout.*` in en/ru/uz.json, next to `hero` and
 * `pageHero`. Images are expected at /public/images/home/about-1.png
 * and about-2.png — drop your own façade photos there (see the two
 * <ShatterPhoto> usages below).
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

// Deterministic 0..1 "random" from an integer seed (no Math.random, so
// server-rendered and client-rendered markup can never disagree). Same
// technique as Hero.tsx's pseudoRandom.
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 999.9) * 10000
  return x - Math.floor(x)
}

// Renders one photo as a grid of clipped duplicates of the same <img>
// (object-fit/aspect ratio always matches the real image — nothing is
// pre-sliced in an image editor). At rest the pieces sit edge-to-edge and
// read as the normal photo; once `active`, every piece flies in from a
// scattered position/rotation and settles into place, staggered by
// distance from the image's own center — the same shatter-in technique
// as Hero.tsx's ShatterImage, just for a single static photo instead of
// a swappable carousel slide. The whole grid carries one accessible
// name (role="img" + aria-label) since the individual <img> pieces are
// duplicates of one photo, not separate content.
function ShatterPhoto({
  src,
  alt,
  cols,
  rows,
  baseDelay,
  active,
}: {
  src: string
  alt: string
  cols: number
  rows: number
  baseDelay: number
  active: boolean
}) {
  const centerCol = (cols - 1) / 2 || 1
  const centerRow = (rows - 1) / 2 || 1
  const pieces = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col
      const nx = (col - centerCol) / centerCol
      const ny = (row - centerRow) / centerRow
      const jitter = (seed: number, spread: number) => pseudoRandom(i + seed) * spread - spread / 2
      const dx = nx * 130 + jitter(1, 55)
      const dy = ny * 100 - 80 + jitter(2, 55)
      const rot = nx * 100 + jitter(3, 80)
      const skew = jitter(4, 14)
      const delay = baseDelay + (Math.abs(nx) + Math.abs(ny)) * 0.16 + i * 0.012
      pieces.push({ row, col, dx, dy, rot, skew, delay })
    }
  }

  return (
    <div className="ha-shatter" role="img" aria-label={alt}>
      {pieces.map(({ row, col, dx, dy, rot, skew, delay }, i) => {
        const left = (col / cols) * 100
        const right = ((col + 1) / cols) * 100
        const top = (row / rows) * 100
        const bottom = ((row + 1) / rows) * 100
        return (
          <img
            key={i}
            src={src}
            alt=""
            className={active ? 'ha-shard active' : 'ha-shard'}
            draggable={false}
            style={{
              clipPath: `polygon(${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%)`,
              ['--dx' as string]: `${dx}px`,
              ['--dy' as string]: `${dy}px`,
              ['--rot' as string]: `${rot}deg`,
              ['--skew' as string]: `${skew}deg`,
              ['--delay' as string]: `${delay}s`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}

// Splits the heading into words, each animating in on its own delay —
// same technique as Hero.tsx's AnimatedWords/.word (wordIn keyframe),
// just triggered by scroll-into-view here instead of running on mount.
function AnimatedTitle({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="ha-word"
          style={active ? { animationDelay: `${0.08 + i * 0.06}s` } : { opacity: 0 }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
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

// Mirrors Hero.tsx's actionsDelay approach: title length varies by
// translation, so a fixed CSS delay for the points/CTA isn't safe — a
// long title would still be mid-word when they popped in. These
// constants match .ha-word's own timing above (delay base/step,
// animation duration) and .ha-description's (delay, duration).
const WORD_DELAY_BASE = 0.08
const WORD_DELAY_STEP = 0.06
const WORD_ANIM_DURATION = 0.8
const DESCRIPTION_DELAY = 0.5
const DESCRIPTION_DURATION = 0.8
const POINTS_BUFFER = 0.1
const POINTS_STAGGER = 0.09
const CTA_BUFFER = 0.15

export default function HomeAbout() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLElement>(0.15)

  const title = t('homeAbout.title')
  const titleWordCount = title.split(' ').length
  const titleFinish = WORD_DELAY_BASE + (titleWordCount - 1) * WORD_DELAY_STEP + WORD_ANIM_DURATION
  const descriptionFinish = DESCRIPTION_DELAY + DESCRIPTION_DURATION
  const pointsDelay = Math.max(titleFinish, descriptionFinish) + POINTS_BUFFER
  const ctaDelay = pointsDelay + POINT_KEYS.length * POINTS_STAGGER + CTA_BUFFER

  return (
    <section className="ha-section" ref={ref}>
      <div className={`ha-frame${inView ? ' in-view' : ''}`}>
        <div className="ha-text">
          <p className="ha-eyebrow">{t('homeAbout.eyebrow')}</p>

          <h2 className="ha-title">
            <AnimatedTitle text={title} active={inView} />
          </h2>

          <p className="ha-description">{t('homeAbout.description')}</p>

          <ul className="ha-points">
            {POINT_KEYS.map((key, i) => {
              const Icon = POINT_ICONS[key]
              return (
                <li className="ha-point" key={key} style={inView ? { animationDelay: `${pointsDelay + i * POINTS_STAGGER}s` } : { opacity: 0 }}>
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

          <Link className="ha-cta" to="/about" style={inView ? { animationDelay: `${ctaDelay}s` } : { opacity: 0 }}>
            {t('homeAbout.cta')}
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="ha-media">
          <div className="ha-media-grid">
            {/* O'z fasad suratlaringizni shu yerga qo'ying:
                public/images/home/about-1.png va about-2.png */}
            <ShatterPhoto
              src="/images/home/about-1.png"
              alt={t('homeAbout.imageAlt1')}
              cols={4}
              rows={5}
              baseDelay={0}
              active={inView}
            />
            <ShatterPhoto
              src="/images/home/about-2.png"
              alt={t('homeAbout.imageAlt2')}
              cols={4}
              rows={5}
              baseDelay={0.22}
              active={inView}
            />
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