import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../shared/SEO'
import PageHero from '../PageHero/PageHero'
import './Contact.scss'

/**
 * Contact — PageHero, a contact form, and a live map of Asman's location
 * ("Qo'qon" Free Economic Zone, Fergana region).
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

// Splits a translated phrase into words that stagger in left-to-right —
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

// ===== Form =====
type FormState = { fullName: string; phone: string; message: string }
const EMPTY_FORM: FormState = { fullName: '', phone: '', message: '' }

function FormSection() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLDivElement>()
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
      <div className={`cs-form-card${inView ? ' in-view' : ''}`}>
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
    </section>
  )
}

// ===== Map =====
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3035.9633472934443!2d71.0216583!3d40.4539482!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bafbcbdb3b5941%3A0xac338a24c1d7d98e!2zQVNNQU4u0KPQvdC40YLQsNGAINC60L7RgNGF0L7QvdCw0YHQuA!5e0!3m2!1sru!2s!4v1787681943374!5m2!1sru!2s'

function MapSection() {
  const { t } = useTranslation()
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="cs-map-section" ref={ref}>
      <div className="cs-map-heading">
        <h2>
          <AnimatedWords text={t('contactMap.title')} active={inView} />
        </h2>
        <p className={`cs-map-lead${inView ? ' in-view' : ''}`}>{t('contactMap.description')}</p>
      </div>

      <div className={`cs-map-frame${inView ? ' in-view' : ''}`}>
        <iframe
          className="cs-map-iframe"
          title="Asman — xarita"
          src={MAP_EMBED_SRC}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
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