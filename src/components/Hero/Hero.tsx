import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import slider01 from '../../assets/slider/slider01/slider01.png'
import slider02 from '../../assets/slider/slider02/slider02.png'
import slider03 from '../../assets/slider/slider03/slider03.png'
import bucket01 from '../../assets/slider/slider01/slider_chelak01.png'
import bucket02 from '../../assets/slider/slider02/slider_chelak02.png'
import bucket03 from '../../assets/slider/slider03/slider_chelak03.png'
import './Hero.scss'

const slides = [
  { image: slider01, bucket: bucket01 },
  { image: slider02, bucket: bucket02 },
  { image: slider03, bucket: bucket03 },
]

export default function Hero() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 6500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--nav-slider-image', `url("${slides[current].image}")`)
  }, [current])

  const select = (index: number) => setCurrent((index + slides.length) % slides.length)

  return (
    <section className="hero" aria-roledescription="carousel">
      <img className="hero-background" src={slides[current].image} alt="" />
      <div className="hero-shade"></div>

      <div className="hero-content" key={current}>
        <p className="eyebrow"><span>♢</span>{t('hero.eyebrow')}</p>
        <h1>{t('hero.titleStart')} <em>{t('hero.titleAccent')}</em> {t('hero.titleEnd')}</h1>
        <p className="description">{t('hero.description')}</p>
        <div className="hero-actions">
          <a className="button primary" href="#catalog">{t('hero.catalog')} <b>→</b></a>
          <a className="button secondary" href="#contact">⌕ {t('hero.contact')}</a>
        </div>
      </div>

      <div className="products" aria-hidden="true">
        <img className="bucket-large" src={slides[current].bucket} alt="" />
        <img className="bucket-small" src={slides[current].bucket} alt="" />
      </div>

      <button className="arrow arrow-left" onClick={() => select(current - 1)} aria-label={t('aria.previous')}>‹</button>
      <button className="arrow arrow-right" onClick={() => select(current + 1)} aria-label={t('aria.next')}>›</button>

      <div className="dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => select(index)}
            aria-label={`Slide ${index + 1}`}
            className={index === current ? 'active' : ''}
          ></button>
        ))}
      </div>
    </section>
  )
}