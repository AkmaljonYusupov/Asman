import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import type { PageHeroKey } from '../PageHero/PageHero'



const SITE_URL = 'https://asman.uz'
const SITE_NAME = 'Asman'

const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  uz: 'uz_UZ',
}

export type SEOKey = PageHeroKey | 'home'

type SEOContent = {
  title: string
  description: string
  keywords: string
}

type SEOProps = {
  pageKey: SEOKey
  /** Optional: absolute URL to a page-specific share image (falls back to the site default). */
  image?: string
}

export default function SEO({ pageKey, image }: SEOProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const content = t(`seo.${pageKey}`, { returnObjects: true }) as SEOContent
  const currentLang = (i18n.language?.split('-')[0] || 'uz') as keyof typeof OG_LOCALES

  const canonicalUrl = `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`
  const shareImage = image ?? `${SITE_URL}/og-image.jpg`

  return (
    <Helmet htmlAttributes={{ lang: currentLang }}>
      <title>{`${content.title} | ${SITE_NAME}`}</title>
      <meta name="description" content={content.description} />
      <meta name="keywords" content={content.keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* If routes become language-prefixed later, replace the block
         above with per-language canonical + hreflang alternates, e.g.:
         <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en${path}`} />
         <link rel="alternate" hrefLang="ru" href={`${SITE_URL}/ru${path}`} />
         <link rel="alternate" hrefLang="uz" href={`${SITE_URL}/uz${path}`} />
         <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${path}`} /> */}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={content.title} />
      <meta property="og:description" content={content.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={OG_LOCALES[currentLang] ?? 'uz_UZ'} />
      <meta property="og:image" content={shareImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={content.title} />
      <meta name="twitter:description" content={content.description} />
      <meta name="twitter:image" content={shareImage} />
    </Helmet>
  )
}