import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../shared/SEO'
import PageHero from '../PageHero/PageHero'
import './Contact.scss'

/**
 * Contact — PageHero, a two-column "get in touch" frame (info panel +
 * contact form), and a live map of Asman's location ("Qo'qon" Free
 * Economic Zone, Fergana region).
 *
 * The frame's left column (ContactInfoPanel) carries the eyebrow,
 * heading, description, phone/email/address rows, and social links;
 * the right column is the form card, unchanged in its own behaviour.
 *
 * Sending status is shown as a panel that fades in *over the fields
 * themselves*, inside the same form card: submitting first fades the
 * inputs out, then the spinner (and later the checkmark) fades in on
 * top of that same spot — never a native alert()/prompt() or a fixed
 * corner popup. The person can also skip the wait early with the ×
 * button.
 *
 * Map copy comes from `contactMap.title` / `contactMap.description`,
 * and the form's own copy from `contactForm.*` (en/ru/uz.json, next to
 * `pageHero`/`footer`).
 */

type IconFn = () => ReactElement

// ===== Icons — same local, currentColor approach as PageHero.tsx =====
const SendIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M20 4 3.5 10.4c-.8.3-.78 1.46.03 1.73L11 14.6l2.5 7.4c.28.82 1.44.85 1.76.04L20 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11 14.6 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CheckCircleIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="m7.8 12.3 2.6 2.6 5.8-5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const ArrowRightIcon: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ===== Social icons — flat, white glyphs; each sits on its own coloured
// rounded-square badge (background colour set via .cs-social-icon-* in
// Contact.scss), matching the reference design's Instagram/Facebook/
// Telegram tiles. =====
const InstagramGlyph: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="white" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="1.7" />
    <circle cx="17.1" cy="6.9" r="1.1" fill="white" />
  </svg>
)

const FacebookGlyph: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M14 9.2h2.2V6.4h-2.2c-2 0-3.4 1.5-3.4 3.5v1.7H8.7v2.8h1.9V19h2.8v-4.6h2l.5-2.8h-2.5v-1.4c0-.6.4-1 1-1Z"
      fill="white"
    />
  </svg>
)

const TelegramGlyph: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="m5 12.4 13.7-5.6c.6-.25 1.2.2 1 .85l-2.3 10.9c-.15.7-.85 1-1.4.6l-3.5-2.7-1.8 1.8c-.25.25-.65.2-.8-.15l-1.2-3.1-3-1.1c-.6-.2-.65-1.05-.5-1.5Z"
      fill="white"
    />
    <path d="m9.7 14.1 8.3-6.6-7 7.3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Phone/email/address glyphs for the left panel's contact rows — same
// flat, currentColor approach as the other icons in this file. Unlike
// the social glyphs (always white-on-colour-badge), these use
// currentColor: each contact row renders the icon twice — small and
// brand-blue in the badge, and large and faint as a background
// watermark — so the colour needs to follow the CSS `color` set on
// whichever wrapper is rendering it.
const PhoneGlyph: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1L6.6 10.8Z"
      fill="currentColor"
    />
  </svg>
)

const EmailGlyph: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const MapPinGlyph: IconFn = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 21.5c4.2-4.6 7-8.3 7-12A7 7 0 0 0 5 9.5c0 3.7 2.8 7.4 7 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

// Flips `true` (and stays true) once the section scrolls into view.
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

// Continuous scroll-linked parallax: as the page scrolls, the element
// drifts vertically relative to how far its centre sits from the
// viewport's centre, at `speed` (positive drifts down as it approaches
// centre from above; negative drifts the opposite way — pairing a
// positive and a negative speed on two nearby elements is what reads as
// "depth"). The offset is lerped toward its target every frame instead
// of snapping straight to it, so the motion stays smooth rather than
// jittery. Sets `transform` directly on the DOM node (not via React
// state) since this runs every animation frame. No-ops entirely when
// the person has requested reduced motion.
function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T | null>(null)
  const current = useRef(0)
  const target = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let ticking = false

    function measure() {
      const rect = el!.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      target.current = (viewportCenter - elementCenter) * speed
      ticking = false
    }
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(measure)
      }
    }
    function loop() {
      current.current += (target.current - current.current) * 0.09
      el!.style.transform = `translate3d(0, ${current.current.toFixed(2)}px, 0)`
      frame = requestAnimationFrame(loop)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(frame)
    }
  }, [speed])

  return ref
}


// same idea as PageHero.tsx's own AnimatedWords, kept as a local copy so
// this component has no runtime dependency on PageHero's internals.
function AnimatedWords({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className={`cs-word${active ? ' in-view' : ''}`}
          style={{ animationDelay: active ? `${0.1 + i * 0.06}s` : undefined }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

// ===== Sending status panel — plain fade/scale, no native alert()/
// prompt(), no bounce. Lives *inside* the form card, laid directly over
// the fields: submitting the form fades the inputs out first, then the
// spinner (and later the checkmark) fades in on top of that same spot —
// never a fixed corner popup. The person can also skip the wait early
// with the × button. =====
type SendStatus = 'idle' | 'submitting' | 'success'

function StatusPanel({ status, onClose }: { status: SendStatus; onClose: () => void }) {
  const { t } = useTranslation()
  const visible = status !== 'idle'
  return (
    <div
      className={`cs-status-panel${visible ? ' show' : ''}${status === 'success' ? ' is-success' : ''}`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <span className="cs-status-icon">
        {status === 'success' ? <CheckCircleIcon /> : <span className="cs-status-spinner" aria-hidden="true" />}
      </span>
      <strong>{status === 'success' ? t('contactForm.status.successTitle') : t('contactForm.status.sendingTitle')}</strong>
      <p>{status === 'success' ? t('contactForm.status.successDescription') : t('contactForm.status.sendingDescription')}</p>
      <button type="button" className="cs-status-close" aria-label={t('contactForm.close')} onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  )
}

// Social profile links for the left "get in touch" panel. Names come
// from `footer.social.*` (already used the same way in Footer), so the
// label can never drift out of sync between the two places.
const SOCIAL_LINKS: { key: 'instagram' | 'facebook' | 'telegram'; href: string; Icon: IconFn }[] = [
  { key: 'instagram', href: 'https://www.instagram.com/asman.uz/', Icon: InstagramGlyph },
  { key: 'facebook', href: 'https://www.facebook.com/asmanuzbekistan/', Icon: FacebookGlyph },
  { key: 'telegram', href: 'https://t.me/asman_uzb', Icon: TelegramGlyph },
]

// Phone/email/address rows shown on the left "get in touch" panel, above
// the divider and social list. `footer.phone`/`footer.phoneHref` and
// `footer.address` are reused here (same numbers Footer already shows),
// so there's a single source of truth for them; only the row's own
// label copy comes from `contactForm.info.*` (kept for screen readers —
// see .cs-info-contact-label in Contact.scss). The address row links out
// to the real Google Maps place rather than a tel:/mailto: scheme.
const CONTACT_ROWS: {
  key: 'phone' | 'email' | 'address'
  href: string
  external?: boolean
  Icon: IconFn
}[] = [
  { key: 'phone', href: 'tel:+998954041100', Icon: PhoneGlyph },
  { key: 'email', href: 'mailto:info@asman.uz', Icon: EmailGlyph },
  { key: 'address', href: 'https://maps.app.goo.gl/fVzbMBR7J6tJeCo59', external: true, Icon: MapPinGlyph },
]

// ===== Quick-info strip — phone/email/address as solid pills, sitting
// in the gap ABOVE the bordered frame (not inside it, and not inside
// the info panel either): its own full-width row between PageHero's
// text and the frame, matching the reference design where this strip
// reads as a separate element from the "get in touch" card below it. =====
function ContactQuickInfo() {
  const { t } = useTranslation()
  // One hook call per row (fixed at 3 — CONTACT_ROWS never changes at
  // runtime) rather than calling the hook inside .map, since hooks can't
  // run a variable number of times per render. Each ref goes on a plain
  // wrapper div, not the <a> itself — the <a> already has its own hover
  // transform (the lift on :hover in Contact.scss), and setting an
  // inline `transform` on the same element every animation frame would
  // permanently override that CSS transform. Splitting parallax (outer
  // wrapper) from hover (inner link) keeps both independent.
  const parallaxRefs = [
    useParallax<HTMLDivElement>(0.05),
    useParallax<HTMLDivElement>(0.09),
    useParallax<HTMLDivElement>(0.14),
  ]
  return (
    <div className="cs-quick-info">
      {CONTACT_ROWS.map(({ key, href, external, Icon }, i) => (
        <div key={key} ref={parallaxRefs[i]} className="cs-info-contact-parallax">
          <a
            className="cs-info-contact-row"
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="cs-info-contact-bg-icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="cs-info-contact-icon">
              <Icon />
            </span>
            <span className="cs-info-contact-text">
              <span className="cs-info-contact-label">{t(`contactForm.info.${key}Label`)}</span>
              <span className="cs-info-contact-value">{t(`footer.${key}`)}</span>
            </span>
          </a>
        </div>
      ))}
    </div>
  )
}

// ===== Left "get in touch" panel — eyebrow, heading, description, a
// thin divider, then a list of social links, each with a coloured icon
// tile, the platform name, and a "Follow" call to action. Sits beside
// the form card inside the same bordered outer frame. =====
function ContactInfoPanel() {
  const { t } = useTranslation()
  const parallaxRef = useParallax<HTMLDivElement>(-0.035)
  return (
    <div className="cs-info-panel" ref={parallaxRef}>
      <p className="cs-info-eyebrow">
        <span className="cs-info-eyebrow-dash" aria-hidden="true" />
        {t('contactForm.info.eyebrow')}
      </p>
      <h2>{t('contactForm.info.heading')}</h2>
      <p className="cs-info-description">{t('contactForm.info.description')}</p>

      <div className="cs-info-divider" />

      <p className="cs-info-follow-label">{t('contactForm.info.followLabel')}</p>
      <ul className="cs-social-list">
        {SOCIAL_LINKS.map(({ key, href, Icon }) => (
          <li key={key}>
            <a className="cs-social-row" href={href} target="_blank" rel="noopener noreferrer">
              <span className={`cs-social-icon cs-social-icon-${key}`}>
                <Icon />
              </span>
              <span className="cs-social-name">{t(`footer.social.${key}`)}</span>
              <span className="cs-social-cta">
                {t('contactForm.info.followCta')} <ArrowRightIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ===== Form =====
type FormState = { fullName: string; phone: string; message: string }
const EMPTY_FORM: FormState = { fullName: '', phone: '', message: '' }

function FormSection() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLDivElement>()
  const formCardParallaxRef = useParallax<HTMLDivElement>(0.035)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<SendStatus>('idle')
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => {
    timers.current.forEach(clearTimeout)
  }, [])

  const errors: Partial<Record<keyof FormState, string>> = {
    fullName: form.fullName.trim().length < 3 ? t('contactForm.errors.fullName') : undefined,
    phone: form.phone.trim().length < 9 ? t('contactForm.errors.phone') : undefined,
    message: form.message.trim().length < 10 ? t('contactForm.errors.message') : undefined,
  }
  const isValid = !errors.fullName && !errors.phone && !errors.message

  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }
  const handleBlur = (field: keyof FormState) => () => setTouched((prev) => ({ ...prev, [field]: true }))

  function closeStatus() {
    timers.current.forEach(clearTimeout)
    setStatus('idle')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ fullName: true, phone: true, message: true })
    if (!isValid || status === 'submitting') return

    setStatus('submitting')
    // TODO: point this at the real contact endpoint/CRM — this timeout
    // just mimics the round trip so the status panel can be reviewed as-is.
    const t1 = setTimeout(() => {
      setStatus('success')
      setForm(EMPTY_FORM)
      setTouched({})
      const t2 = setTimeout(() => setStatus('idle'), 3600)
      timers.current.push(t2)
    }, 1100)
    timers.current.push(t1)
  }

  return (
    <section className="cs-form-section" ref={ref}>
      <ContactQuickInfo />

      <div className={`cs-contact-frame${inView ? ' in-view' : ''}`}>
        <ContactInfoPanel />

        <div className="cs-form-card" ref={formCardParallaxRef}>
          <div className="cs-form-heading">
            <h2>{t('contactForm.heading')}</h2>
            <p>{t('contactForm.description')}</p>
          </div>

          <div className="cs-form-body">
            <form
              className={`cs-form-fields${status !== 'idle' ? ' is-hidden' : ''}`}
              onSubmit={handleSubmit}
              noValidate
              aria-hidden={status !== 'idle'}
            >
              <label className="cs-field">
                <span>{t('contactForm.fields.fullName.label')}</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  placeholder={t('contactForm.fields.fullName.placeholder')}
                  autoComplete="name"
                />
                {touched.fullName && errors.fullName && <em className="cs-field-error">{errors.fullName}</em>}
              </label>

              <label className="cs-field">
                <span>{t('contactForm.fields.phone.label')}</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  placeholder={t('contactForm.fields.phone.placeholder')}
                  autoComplete="tel"
                />
                {touched.phone && errors.phone && <em className="cs-field-error">{errors.phone}</em>}
              </label>

              <label className="cs-field">
                <span>{t('contactForm.fields.message.label')}</span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={handleChange('message')}
                  onBlur={handleBlur('message')}
                  placeholder={t('contactForm.fields.message.placeholder')}
                />
                {touched.message && errors.message && <em className="cs-field-error">{errors.message}</em>}
              </label>

              <button type="submit" className="cs-submit">
                <SendIcon /> {t('contactForm.submit')}
              </button>
            </form>

            <StatusPanel status={status} onClose={closeStatus} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ===== Map =====
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3035.9633472934443!2d71.0216583!3d40.4539482!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bafbcbdb3b5941%3A0xac338a24c1d7d98e!2zQVNNQU4u0KPQvdC40YLQsNGAINC60L7RgNGF0L7QvdCw0YHQuA!5e0!3m2!1sru!2s!4v1787710741551!5m2!1sru!2s'

function MapSection() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLDivElement>()
  const headingParallaxRef = useParallax<HTMLDivElement>(0.06)
  const frameParallaxRef = useParallax<HTMLDivElement>(-0.04)

  return (
    <section className="cs-map-section" ref={ref}>
      <div className="cs-map-heading" ref={headingParallaxRef}>
        <h2>
          <AnimatedWords text={t('contactMap.title')} active={inView} />
        </h2>
        <p className={`cs-map-lead${inView ? ' in-view' : ''}`}>{t('contactMap.description')}</p>
      </div>

      <div ref={frameParallaxRef}>
        <div className={`cs-map-frame${inView ? ' in-view' : ''}`}>
          <iframe
            className="cs-map-iframe"
            title="Asman — xarita"
            src={MAP_EMBED_SRC}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  )
}

export default function Contact() {
  return (
    <>
      <SEO pageKey="contact" />
      <PageHero pageKey="contact" />
      <FormSection />
      <MapSection />
    </>
  )
}