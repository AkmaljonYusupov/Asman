import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import './Sertifikatpage.scss'

/**
 * Sertifikatpage — the certificates showcase section, right below
 * HomeAbout on the home page. Same visual language as HomeAbout/Hero
 * (colours, radii, badgePop/wordIn/textReveal reveal techniques —
 * classes here use the `crt-` prefix instead of `ha-`/none, purely so
 * the local @keyframes below can never collide with Hero.scss's or
 * HomeAbout.scss's identically-shaped ones, since all three stylesheets
 * load on the same page).
 *
 * The five certificate photos are plain images — no text is baked into
 * or overlaid on them. The section's own heading (eyebrow + title +
 * description, all translated) is what tells the visitor which section
 * this is, exactly like HomeAbout's heading does for that section.
 *
 * Clicking a thumbnail opens it full-size in a lightbox (rendered via
 * a portal straight into document.body, so it always sits above the
 * fixed Navbar regardless of any stacking context inside the section)
 * with round, glassy prev/next buttons either side of the image, plus
 * Escape/←/→ keyboard support and a locked background scroll while open.
 *
 * Certificate files are expected at:
 *   public/images/sertifikat/sertifikat01.png … sertifikat05.png
 * (see CERTIFICATES below — add/remove entries to match how many you
 * actually have).
 */

type IconFn = () => JSX.Element

const ArrowLeftIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M19.5 12h-15M10 5.5 3.5 12l6.5 6.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRightIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M4.5 12h15M14 5.5l6.5 6.5-6.5 6.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ZoomIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
    <path d="M15.3 15.3 20 20M10.5 8v5M8 10.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const CERTIFICATES = [
  '/images/sertifikat/sertifikat01.png',
  '/images/sertifikat/sertifikat02.png',
  '/images/sertifikat/sertifikat03.png',
  '/images/sertifikat/sertifikat04.png',
  '/images/sertifikat/sertifikat05.png',
] as const

// Splits the heading into words, each animating in on its own delay —
// same technique as Hero.tsx's AnimatedWords / HomeAbout.tsx's
// AnimatedTitle, kept local here since it's a tiny, self-contained bit
// of markup and this component has no other reason to import from
// HomeAbout.tsx.
function AnimatedTitle({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="crt-word"
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
// Same local hook as HomeAbout.tsx/Contact.tsx.
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

// Same timing-sync approach as Hero.tsx's actionsDelay / HomeAbout.tsx's
// pointsDelay: title length varies by translation, so the grid's own
// entrance waits for however long the title actually takes to finish.
const WORD_DELAY_BASE = 0.08
const WORD_DELAY_STEP = 0.06
const WORD_ANIM_DURATION = 0.8
const DESCRIPTION_DELAY = 0.5
const DESCRIPTION_DURATION = 0.8
const GRID_BUFFER = 0.15
const GRID_STAGGER = 0.07

export default function Sertifikatpage() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLElement>(0.15)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const title = t('certificates.title')
  const titleWordCount = title.split(' ').length
  const titleFinish = WORD_DELAY_BASE + (titleWordCount - 1) * WORD_DELAY_STEP + WORD_ANIM_DURATION
  const descriptionFinish = DESCRIPTION_DELAY + DESCRIPTION_DURATION
  const gridDelay = Math.max(titleFinish, descriptionFinish) + GRID_BUFFER

  const open = useCallback((index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setActiveIndex(index)
  }, [])

  const close = useCallback(() => {
    setActiveIndex(null)
    lastTriggerRef.current?.focus()
  }, [])

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + CERTIFICATES.length) % CERTIFICATES.length))
  }, [])

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % CERTIFICATES.length))
  }, [])

  // Lightbox ochiq bo'lganda: fon scroll'i qulflanadi, Esc/←/→ ishlaydi,
  // yopish tugmasiga fokus o'tadi (va yopilganda ochgan tugmaga qaytadi
  // — `close()` ichida, yuqorida).
  useEffect(() => {
    if (activeIndex === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') showPrev()
      else if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, close, showPrev, showNext])

  return (
    <section className="crt-section" ref={ref}>
      <div className={`crt-frame${inView ? ' in-view' : ''}`}>
        <header className="crt-head">
          <p className="crt-eyebrow">{t('certificates.eyebrow')}</p>
          <h2 className="crt-title">
            <AnimatedTitle text={title} active={inView} />
          </h2>
          <p className="crt-description">{t('certificates.description')}</p>
        </header>

        <ul className="crt-grid">
          {CERTIFICATES.map((src, i) => (
            <li
              className="crt-item"
              key={src}
              style={inView ? { animationDelay: `${gridDelay + i * GRID_STAGGER}s` } : { opacity: 0 }}
            >
              <button
                type="button"
                className="crt-thumb"
                onClick={(e) => open(i, e.currentTarget)}
                aria-label={`${t('certificates.viewLabel')} ${i + 1}`}
              >
                <img src={src} alt={`${t('certificates.imageAlt')} ${i + 1}`} loading="lazy" draggable={false} />
                <span className="crt-thumb-veil" aria-hidden="true">
                  <span className="crt-thumb-zoom">
                    <ZoomIcon />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeIndex !== null &&
        createPortal(
          <div className="crt-lightbox" role="dialog" aria-modal="true" aria-label={t('certificates.lightboxLabel')}>
            <button type="button" className="crt-lightbox-backdrop" onClick={close} aria-label={t('certificates.close')} />

            <div className="crt-lightbox-stage">
              <button ref={closeButtonRef} type="button" className="crt-lightbox-close" onClick={close} aria-label={t('certificates.close')}>
                <CloseIcon />
              </button>

              <button type="button" className="crt-lightbox-nav crt-lightbox-nav--prev" onClick={showPrev} aria-label={t('certificates.prev')}>
                <ArrowLeftIcon />
              </button>

              <div className="crt-lightbox-frame">
                <img
                  key={activeIndex}
                  className="crt-lightbox-image"
                  src={CERTIFICATES[activeIndex]}
                  alt={`${t('certificates.imageAlt')} ${activeIndex + 1}`}
                />
              </div>

              <button type="button" className="crt-lightbox-nav crt-lightbox-nav--next" onClick={showNext} aria-label={t('certificates.next')}>
                <ArrowRightIcon />
              </button>

              <span className="crt-lightbox-counter">
                {activeIndex + 1} / {CERTIFICATES.length}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}