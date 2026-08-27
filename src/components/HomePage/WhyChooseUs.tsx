import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import bgPhoto from '../../assets/why-us/why-us-bg.jpg'
import icon01 from '../../assets/why-us/why-us01.png'
import icon02 from '../../assets/why-us/why-us02.png'
import icon03 from '../../assets/why-us/why-us03.png'
import icon04 from '../../assets/why-us/why-us04.png'
import icon05 from '../../assets/why-us/why-us05.png'
import icon06 from '../../assets/why-us/why-us06.png'
import './WhyChooseUs.scss'

/**
 * WhyChooseUs — the "Nima uchun bizni tanlashadi?" section: a full-bleed
 * photo background (a finished project/house), a centered heading with
 * a blue accent word and a small line–dot–line divider, then six white
 * cards (icon image + title + short rule + text) in a 3×2 grid.
 *
 * Same reveal techniques as HomeAbout.tsx/Sertifikatpage.tsx (own local
 * useInView, word-by-word title, staggered card entrance) — classes use
 * the `wcu-` prefix and keyframes are `wcu`-prefixed so they can't
 * collide with Hero.scss/HomeAbout.scss/Sertifikatpage.scss's
 * identically-shaped ones, since all of these load on the same page.
 *
 * All seven images (six card icons + the background photo) are loaded
 * via `import`, exactly like Hero.tsx's slider01…slider04 — NOT as
 * `/images/...` string paths into public/. This is a deliberate choice:
 * with an import, Vite resolves the file at BUILD time. If a file is
 * missing, renamed, or has the wrong case, the build fails immediately
 * with a clear "Could not resolve" error — it's impossible to end up
 * with a silently-broken <img> in production. A public/ string path,
 * by contrast, is only checked at runtime (in the browser), so a typo
 * or a file that never got committed/deployed just shows nothing, with
 * no build-time warning at all — exactly the failure mode that caused
 * the icons not to show earlier.
 *
 * Put your seven files at:
 *   src/assets/why-us/why-us-bg.jpg
 *   src/assets/why-us/why-us01.png … why-us06.png
 * (rename/move them from public/images/why-us/ if that's where they
 * are now — that folder is no longer read by this component).
 */

const REASON_KEYS = ['experience', 'quality', 'application', 'range', 'price', 'approach'] as const
type ReasonKey = (typeof REASON_KEYS)[number]

const REASON_IMAGES: Record<ReasonKey, string> = {
  experience: icon01,
  quality: icon02,
  application: icon03,
  range: icon04,
  price: icon05,
  approach: icon06,
}

// If an icon somehow still fails to *load* at runtime (a corrupt file,
// for instance — imports only guarantee the file *exists* at build
// time, not that the browser can decode it), hide it instead of
// leaving the browser's broken-image icon visible.
const hideOnError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.visibility = 'hidden'
}

// Splits the heading into words, each animating in on its own delay —
// same technique as Hero.tsx's AnimatedWords / HomeAbout.tsx's
// AnimatedTitle.
function AnimatedTitle({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="wcu-word" style={active ? { animationDelay: `${0.08 + i * 0.06}s` } : { opacity: 0 }}>
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

// Flips `true` (and stays true) once the section scrolls into view.
// Same local hook as HomeAbout.tsx/Sertifikatpage.tsx/Contact.tsx.
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

// Title length varies by translation, so the divider/grid's own
// entrance waits for however long the title actually takes to finish
// animating — same approach as HomeAbout.tsx's pointsDelay.
const WORD_DELAY_BASE = 0.08
const WORD_DELAY_STEP = 0.06
const WORD_ANIM_DURATION = 0.8
const DIVIDER_BUFFER = 0.1
const GRID_BUFFER = 0.22
const GRID_STAGGER = 0.08

export default function WhyChooseUs() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLElement>(0.12)

  const titleStart = t('whyUs.titleStart')
  const titleAccent = t('whyUs.titleAccent')
  const startWordCount = titleStart.split(' ').length
  const totalWordCount = startWordCount + titleAccent.split(' ').length
  const titleFinish = WORD_DELAY_BASE + (totalWordCount - 1) * WORD_DELAY_STEP + WORD_ANIM_DURATION
  const dividerDelay = titleFinish + DIVIDER_BUFFER
  const gridDelay = titleFinish + GRID_BUFFER

  return (
    <section className="wcu-section" ref={ref}>
      <img className="wcu-bg-image" src={bgPhoto} alt="" draggable={false} />
      <div className="wcu-overlay" aria-hidden="true" />

      <div className={`wcu-inner${inView ? ' in-view' : ''}`}>
        <header className="wcu-head">
          <h2 className="wcu-title">
            <AnimatedTitle text={titleStart} active={inView} />{' '}
            <em>
              <AnimatedTitle text={titleAccent} active={inView} />
            </em>
          </h2>

          <span className="wcu-divider" style={inView ? { animationDelay: `${dividerDelay}s` } : { opacity: 0 }} aria-hidden="true">
            <i />
            <b />
            <i />
          </span>
        </header>

        <ul className="wcu-grid">
          {REASON_KEYS.map((key, i) => (
            <li className="wcu-card" key={key} style={inView ? { animationDelay: `${gridDelay + i * GRID_STAGGER}s` } : { opacity: 0 }}>
              <span className="wcu-card-icon">
                <img src={REASON_IMAGES[key]} alt="" loading="lazy" onError={hideOnError} />
              </span>
              <span className="wcu-card-body">
                <strong>{t(`whyUs.reasons.${key}.title`)}</strong>
                <span className="wcu-card-rule" aria-hidden="true" />
                <span className="wcu-card-text">{t(`whyUs.reasons.${key}.description`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}