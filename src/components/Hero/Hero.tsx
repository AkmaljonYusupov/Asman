import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import slider01 from '../../assets/slider/slider01/slider01.png'
import slider02 from '../../assets/slider/slider02/slider02.png'
import slider03 from '../../assets/slider/slider03/slider03.png'
import bucket01 from '../../assets/slider/slider01/slider_chelak01.png'
import bucket02 from '../../assets/slider/slider02/slider_chelak02.png'
import bucket03 from '../../assets/slider/slider03/slider_chelak03.png'
import './Hero.scss'

// Small inline icon set, styled to the hero's own palette (currentColor, so
// each usage site controls its own color/hover via CSS rather than baking a
// fill in here). Kept local to Hero since none of these are used elsewhere yet.
const DropIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 3.2c2.9 3.6 6.4 8.1 6.4 11.6a6.4 6.4 0 1 1-12.8 0c0-3.5 3.5-8 6.4-11.6Z"
      fill="currentColor"
    />
  </svg>
)

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
    <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

// Deterministic 0..1 "random" from an integer seed (no Math.random, so
// server-rendered and client-rendered markup can never disagree).
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 999.9) * 10000
  return x - Math.floor(x)
}

// Renders one bucket photo as a grid of clipped duplicates of the same <img>
// (so object-fit/aspect ratio always matches the real image, nothing is
// pre-sliced). At rest the pieces sit exactly edge-to-edge and read as the
// normal photo; .product-pair.active drives shardIn (see Hero.scss), which
// throws every piece outward/upward on entry and lets it fall back into
// place, staggered by distance from the image's center.
function ShatterImage({ src, cols, rows, className }: { src: string; cols: number; rows: number; className: string }) {
  const centerCol = (cols - 1) / 2 || 1
  const centerRow = (rows - 1) / 2 || 1
  const pieces = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col
      const nx = (col - centerCol) / centerCol
      const ny = (row - centerRow) / centerRow
      const jitter = (seed: number, spread: number) => pseudoRandom(i + seed) * spread - spread / 2
      const dx = nx * 210 + jitter(1, 90)
      const dy = ny * 160 - 190 + jitter(2, 90)
      const rot = nx * 150 + jitter(3, 130)
      const skew = jitter(4, 24)
      const delay = (Math.abs(nx) + Math.abs(ny)) * 0.22 + i * 0.008
      pieces.push({ row, col, dx, dy, rot, skew, delay })
    }
  }

  return (
    <div className={className}>
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
            className="shard"
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

// Splits a translated phrase into words, each wrapped so it can animate in
// on its own delay (see .word / wordIn in Hero.scss). startIndex lets several
// phrases (plain text, then the <em> accent, then more plain text) share one
// continuous left-to-right stagger instead of each restarting from zero.
function AnimatedWords({ text, startIndex, keyPrefix }: { text: string; startIndex: number; keyPrefix: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={`${keyPrefix}${i}`} className="word" style={{ animationDelay: `${0.1 + (startIndex + i) * 0.07}s` }}>
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

// Kept as a single source of truth: the dot progress bar's animation-duration
// and the .hero-background "ken burns" zoom in Hero.scss are both tuned to
// this same length, so drifting this value out of sync with the CSS will
// make the progress bar and the actual slide change visibly disagree.
const AUTOPLAY_MS = 8500

// One slide's full text block, sourced from hero.slides[i] in the locale
// files — each slide gets its own eyebrow, headline, and description
// instead of sharing one static block across all three images.
type HeroSlideContent = {
  eyebrow: string
  titleStart: string
  titleAccent: string
  titleEnd: string
  description: string
}

const slides = [
  { image: slider01, bucket: bucket01 },
  { image: slider02, bucket: bucket02 },
  { image: slider03, bucket: bucket03 },
]

// Fallback used only for the first paint, before any bucket photo has
// finished loading and reported its real size.
const DEFAULT_BUCKET_RATIO = 620 / 570

export default function Hero() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)

  // The .products box needs an aspect-ratio that matches the actual bucket
  // photo, or ShatterImage's object-fit ends up either letterboxing (gap)
  // or, with object-fit: cover, zooming/cropping the photo to fill a box
  // shaped wrong for it. Rather than hardcoding a guessed ratio (which only
  // ever matches one photo, if any), each bucket image is loaded once here
  // and its real naturalWidth/naturalHeight is used instead — so the box
  // always matches whatever the actual asset's proportions are, per slide.
  const [bucketRatios, setBucketRatios] = useState<Record<number, number>>({})

  useEffect(() => {
    let cancelled = false
    slides.forEach((slide, index) => {
      const img = new window.Image()
      img.onload = () => {
        if (cancelled || !img.naturalWidth || !img.naturalHeight) return
        setBucketRatios((prev) => ({ ...prev, [index]: img.naturalWidth / img.naturalHeight }))
      }
      img.src = slide.bucket
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--nav-slider-image', `url("${slides[current].image}")`)
  }, [current])

  const select = (index: number) => setCurrent((index + slides.length) % slides.length)

  // Each slide now carries its own full text block (see hero.slides[i] in
  // the locale files: eyebrow, titleStart/titleAccent/titleEnd, description)
  // instead of one headline shared across all three images.
  const slidesContent = t('hero.slides', { returnObjects: true }) as HeroSlideContent[]
  const content: HeroSlideContent = slidesContent?.[current] ?? slidesContent?.[0]

  // Buttons should always appear after the text has finished animating in —
  // but title length now varies per slide/language, so a fixed CSS delay
  // isn't safe (a long title would still be mid-word when the buttons
  // popped). These constants mirror the timings in Hero.scss (.word's
  // per-word delay/duration, .description's textReveal delay/duration);
  // keep them in sync if those change.
  const WORD_DELAY_BASE = 0.1
  const WORD_DELAY_STEP = 0.07
  const WORD_ANIM_DURATION = 0.85
  const DESCRIPTION_DELAY = 0.55
  const DESCRIPTION_DURATION = 0.8
  const BUTTONS_BUFFER = 0.15
  const BUTTONS_STAGGER = 0.12

  const titleWordCount =
    content.titleStart.split(' ').length + content.titleAccent.split(' ').length + content.titleEnd.split(' ').length
  const titleFinish = WORD_DELAY_BASE + (titleWordCount - 1) * WORD_DELAY_STEP + WORD_ANIM_DURATION
  const descriptionFinish = DESCRIPTION_DELAY + DESCRIPTION_DURATION
  const actionsDelay = Math.max(titleFinish, descriptionFinish) + BUTTONS_BUFFER

  // Drag-to-swipe: works with touch, mouse, and pen via the Pointer Events
  // API. Only the horizontal distance between pointerdown and pointerup
  // decides the swipe, so a tap/click (near-zero delta) never triggers a
  // slide change and buttons/dots underneath keep working normally.
  const SWIPE_THRESHOLD_PX = 50
  const dragStartX = useRef<number | null>(null)

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    dragStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null) return
    const deltaX = e.clientX - dragStartX.current
    dragStartX.current = null
    if (deltaX > SWIPE_THRESHOLD_PX) select(current - 1)
    else if (deltaX < -SWIPE_THRESHOLD_PX) select(current + 1)
  }

  const handlePointerCancel = () => {
    dragStartX.current = null
  }

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      {/* All backgrounds stay mounted; only the active one is opaque, so
         swapping the "active" class crossfades between them instead of
         hard-cutting on src change. */}
      <div className="hero-backgrounds">
        {slides.map((slide, index) => (
          <img
            key={index}
            className={index === current ? 'hero-background active' : 'hero-background'}
            src={slide.image}
            alt=""
            draggable={false}
          />
        ))}
      </div>
      <div className="hero-shade"></div>

      <div className="hero-content" key={current}>
        <p className="eyebrow"><span><DropIcon /></span>{content.eyebrow}</p>
        <h1>
          <AnimatedWords text={content.titleStart} startIndex={0} keyPrefix="s" />{' '}
          <em><AnimatedWords text={content.titleAccent} startIndex={content.titleStart.split(' ').length} keyPrefix="a" /></em>{' '}
          <AnimatedWords
            text={content.titleEnd}
            startIndex={content.titleStart.split(' ').length + content.titleAccent.split(' ').length}
            keyPrefix="e"
          />
        </h1>
        <p className="description">{content.description}</p>
        <div className="hero-actions">
          <Link className="button primary" to="/products" style={{ animationDelay: `${actionsDelay}s` }}>
            {t('hero.catalog')} <b><ArrowRightIcon /></b>
          </Link>
          <Link className="button secondary" to="/contact" style={{ animationDelay: `${actionsDelay + BUTTONS_STAGGER}s` }}>
            <SearchIcon /> {t('hero.contact')}
          </Link>
        </div>
      </div>

      {/* Only the active slide's shards are mounted. Rendering all three
         slides' pieces at once (78 <img> each x3) was the main cause of
         jank: idle sets still cost layout/paint/clip-path for nothing,
         since they're invisible anyway. Mounting fresh on activation still
         replays the shatter animation exactly as before. */}
      <div
        className="products"
        aria-hidden="true"
        style={{ ['--bucket-ratio' as string]: bucketRatios[current] ?? DEFAULT_BUCKET_RATIO }}
      >
        {slides.map((slide, index) => (
          <div key={index} className={index === current ? 'product-pair active' : 'product-pair'}>
            {index === current && (
              <>
                <ShatterImage src={slide.bucket} cols={5} rows={4} className="bucket-large" />
                <ShatterImage src={slide.bucket} cols={4} rows={3} className="bucket-small" />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => select(index)}
            aria-label={`Slide ${index + 1}`}
            className={index === current ? 'active' : ''}
          >
            {index === current && (
              <span
                key={current}
                className="dot-progress"
                style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}