import { useEffect, useState } from 'react'
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

const ChevronIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Kept as a single source of truth: the dot progress bar's animation-duration
// and the .hero-background "ken burns" zoom in Hero.scss are both tuned to
// this same length, so drifting this value out of sync with the CSS will
// make the progress bar and the actual slide change visibly disagree.
const AUTOPLAY_MS = 6500

const slides = [
  { image: slider01, bucket: bucket01 },
  { image: slider02, bucket: bucket02 },
  { image: slider03, bucket: bucket03 },
]

export default function Hero() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--nav-slider-image', `url("${slides[current].image}")`)
  }, [current])

  const select = (index: number) => setCurrent((index + slides.length) % slides.length)

  return (
    <section className="hero" aria-roledescription="carousel">
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
          />
        ))}
      </div>
      <div className="hero-shade"></div>

      <div className="hero-content" key={current}>
        <p className="eyebrow"><span><DropIcon /></span>{t('hero.eyebrow')}</p>
        <h1>{t('hero.titleStart')} <em>{t('hero.titleAccent')}</em> {t('hero.titleEnd')}</h1>
        <p className="description">{t('hero.description')}</p>
        <div className="hero-actions">
          <a className="button primary" href="#catalog">{t('hero.catalog')} <b><ArrowRightIcon /></b></a>
          <a className="button secondary" href="#contact"><SearchIcon /> {t('hero.contact')}</a>
        </div>
      </div>

      <div className="products" aria-hidden="true">
        {slides.map((slide, index) => (
          <div key={index} className={index === current ? 'product-pair active' : 'product-pair'}>
            <img className="bucket-large" src={slide.bucket} alt="" />
            <img className="bucket-small" src={slide.bucket} alt="" />
          </div>
        ))}
      </div>

      <button className="nav-arrow prev" onClick={() => select(current - 1)} aria-label={t('hero.prevSlide')}>
        <ChevronIcon direction="left" />
      </button>
      <button className="nav-arrow next" onClick={() => select(current + 1)} aria-label={t('hero.nextSlide')}>
        <ChevronIcon direction="right" />
      </button>

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