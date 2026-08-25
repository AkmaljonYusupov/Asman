import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { menuKeys } from '../shared/navigation'
import aboutImg from '../../assets/PageHeroImg/About.png'
import contactImg from '../../assets/PageHeroImg/Contact.png'
import newsImg from '../../assets/PageHeroImg/News.png'
import productsImg from '../../assets/PageHeroImg/Products.png'
import projectsImg from '../../assets/PageHeroImg/Projects.png'
import './PageHero.scss'

/**
 * PageHero — the shared banner every inner page (About, Products, Projects,
 * News, Contact) opens with. It's the same "daytime sky" design language
 * and reveal choreography as the homepage Hero (badgePop eyebrow, wordIn
 * title, textReveal description — see Hero.scss) scaled down to a single
 * static banner: no slider, no bucket shatter, since inner pages need a
 * quick, calm orientation cue rather than a second full-screen moment.
 *
 * One component serves every page — each page just passes its own
 * `pageKey`. All copy comes from i18n (`pageHero.<pageKey>.*` for the
 * eyebrow/title/description, `nav.<pageKey>` for the breadcrumb label —
 * reusing the same nav strings Navbar/Offcanvas already render, so the
 * breadcrumb can never drift out of sync with the menu).
 *
 * Usage:
 *   <PageHero pageKey="about" />
 *   <PageHero pageKey="products" />
 */

export type PageHeroKey = Exclude<(typeof menuKeys)[number], 'home'>

type PageHeroProps = {
  pageKey: PageHeroKey
  /** Optional: override the breadcrumb trail's parent step (defaults to Home only). */
  parent?: { labelKey: string; to: string }
}

type PageHeroContent = {
  eyebrow: string
  titleStart: string
  titleAccent?: string
  titleEnd?: string
  description?: string
}

// Small inline icon set, matching Hero.tsx's own approach: currentColor so
// each usage site controls color via CSS, kept local since these aren't
// used anywhere else yet.
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M4 11.5 12 4l8 7.5M6 9.8V19a1 1 0 0 0 1 1h3.2v-5.2a1.8 1.8 0 0 1 1.8-1.8v0a1.8 1.8 0 0 1 1.8 1.8V20H17a1 1 0 0 0 1-1V9.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 3.5c.5 3.3 1.8 4.9 5.5 5.5-3.7.6-5 2.2-5.5 5.5-.5-3.3-1.8-4.9-5.5-5.5 3.7-.6 5-2.2 5.5-5.5Z"
      fill="currentColor"
    />
    <path
      d="M18.5 15c.28 1.7.9 2.5 2.5 2.75-1.6.25-2.22 1.05-2.5 2.75-.28-1.7-.9-2.5-2.5-2.75 1.6-.25 2.22-1.05 2.5-2.75Z"
      fill="currentColor"
    />
  </svg>
)

// The actual photo behind each page's banner — sits under the mist/blob
// backdrop below (see .page-hero-photo in PageHero.scss) so every inner
// page gets a real image instead of just the abstract gradient.
const PAGE_IMAGES: Record<PageHeroKey, string> = {
  about: aboutImg,
  products: productsImg,
  projects: projectsImg,
  news: newsImg,
  contact: contactImg,
}

// One faint, oversized watermark icon per page — gives each page its own
// visual flavor without needing a photo asset, while staying within the
// same "single reusable component" build. Purely decorative (aria-hidden).
const WATERMARK_ICONS: Record<PageHeroKey, () => ReactElement> = {
  about: () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V9.5L12 4l8 5.5V20M8 20v-6h8v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  products: () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.8c3.4 4.1 7 9 7 12.9a7 7 0 1 1-14 0c0-3.9 3.6-8.8 7-12.9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  projects: () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  news: () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5h13a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5.5ZM8 9.5h7M8 13h7M8 16h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  contact: () => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.3 4.2h3.1l1.4 3.8-2 1.6a12.4 12.4 0 0 0 5.8 5.8l1.6-2 3.8 1.4v3.1c0 1-.86 1.77-1.85 1.63A16.9 16.9 0 0 1 3.67 6.05C3.53 5.06 4.3 4.2 5.3 4.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

// Splits a translated phrase into words that stagger in left-to-right —
// the same idea as Hero.tsx's AnimatedWords, kept as its own small copy
// here so PageHero has no runtime dependency on the Hero component.
function AnimatedWords({ text, startIndex, keyPrefix }: { text: string; startIndex: number; keyPrefix: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={`${keyPrefix}${i}`} className="ph-word" style={{ animationDelay: `${0.12 + (startIndex + i) * 0.06}s` }}>
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

export default function PageHero({ pageKey, parent }: PageHeroProps) {
  const { t } = useTranslation()

  const content = t(`pageHero.${pageKey}`, { returnObjects: true }) as PageHeroContent
  const Watermark = WATERMARK_ICONS[pageKey]

  const startWords = content.titleStart.split(' ').length
  const accentWords = content.titleAccent ? content.titleAccent.split(' ').length : 0

  return (
    <section className="page-hero">
      {/* Static equivalent of Hero's crossfading backgrounds/ken-burns:
         a mist gradient plus two soft, slowly-drifting color blobs (same
         --sa-sky/--sa-gold tokens Hero/Navbar/Footer already share) stand
         in for a photo, since inner pages don't have per-slide art. */}
      <div className="page-hero-backdrop" aria-hidden="true">
        <img className="page-hero-photo" src={PAGE_IMAGES[pageKey]} alt="" draggable={false} />
        <span className="ph-blob ph-blob-sky" />
        <span className="ph-blob ph-blob-gold" />
        <div className="ph-grid" />
      </div>

      <div className="page-hero-watermark" aria-hidden="true">
        <Watermark />
      </div>

      <div className="page-hero-content">
        <nav className="ph-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">
            <HomeIcon />
            <span>{t('pageHero.breadcrumbHome')}</span>
          </Link>
          {parent && (
            <>
              <ChevronIcon />
              <Link to={parent.to}>{t(parent.labelKey)}</Link>
            </>
          )}
          <ChevronIcon />
          <span aria-current="page">{t(`nav.${pageKey}`)}</span>
        </nav>

        <p className="ph-eyebrow">
          <span><SparkIcon /></span>
          {content.eyebrow}
        </p>

        <h1>
          <AnimatedWords text={content.titleStart} startIndex={0} keyPrefix="s" />
          {content.titleAccent && (
            <>
              {' '}
              <em>
                <AnimatedWords text={content.titleAccent} startIndex={startWords} keyPrefix="a" />
              </em>
            </>
          )}
          {content.titleEnd && (
            <>
              {' '}
              <AnimatedWords text={content.titleEnd} startIndex={startWords + accentWords} keyPrefix="e" />
            </>
          )}
        </h1>

        {content.description && <p className="ph-description">{content.description}</p>}
      </div>
    </section>
  )
}