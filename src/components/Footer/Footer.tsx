import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo/asman_logo_nav.png'
import { menuKeys } from '../shared/navigation'
import './Footer.scss'

/* ===================== Icons ===================== */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M5.3 4.2h3.1l1.4 3.8-2 1.6a12.4 12.4 0 0 0 5.8 5.8l1.6-2 3.8 1.4v3.1c0 1-.86 1.77-1.85 1.63A16.9 16.9 0 0 1 3.67 6.05C3.53 5.06 4.3 4.2 5.3 4.2Z"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.4" stroke="currentColor" strokeWidth="2.1" />
    <path d="m4.5 6.8 7.5 6 7.5-6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M12 21.5c4.4-4.6 7-8.4 7-12A7 7 0 1 0 5 9.5c0 3.6 2.6 7.4 7 12Z"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.4" r="2.3" stroke="currentColor" strokeWidth="2.1" />
  </svg>
)

const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CaretIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path d="M6.5 9.5 12 15l5.5-5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="m3 12.6 16.4-6.9c.9-.38 1.7.32 1.36 1.34l-2.8 12.9c-.24 1.06-1.24 1.32-2 .68l-4.2-3.44-2.36 2.28c-.32.3-.6.14-.7-.24l-.9-3.6-4.3-1.4c-.9-.28-.9-1.24.5-1.62Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="m8.5 15.6 8.9-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <path
      d="M14.7 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H9.3v2.96h2.36V21h3.04Z"
      fill="currentColor"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
    <circle cx="16" cy="14" r="1.2" fill="currentColor" />
    <circle cx="8" cy="14" r="1.2" fill="currentColor" />
  </svg>
)

/* ===================== Social ===================== */
const socialLinks = [
  { key: 'telegram', href: 'https://t.me/asman', Icon: TelegramIcon },
  { key: 'instagram', href: 'https://instagram.com/asman', Icon: InstagramIcon },
  { key: 'facebook', href: 'https://facebook.com/asman', Icon: FacebookIcon },
] as const

/* ===================== Calendar i18n ===================== */
type Lang = 'uz' | 'ru' | 'en'

type CalStrings = {
  months: string[]
  monthsShort: string[]
  weekdaysShort: string[]
  weekdaysLong: string[]
  prevMonth: string
  nextMonth: string
  prevYear: string
  nextYear: string
  prevYears: string
  nextYears: string
  today: string
  label: string
  selected: string
  pickMonth: string
  pickYear: string
  backToDays: string
}

const CAL_TEXT: Record<Lang, CalStrings> = {
  uz: {
    months: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    monthsShort: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
    weekdaysShort: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
    weekdaysLong: ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'],
    prevMonth: 'Oldingi oy',
    nextMonth: 'Keyingi oy',
    prevYear: 'Oldingi yil',
    nextYear: 'Keyingi yil',
    prevYears: 'Oldingi yillar',
    nextYears: 'Keyingi yillar',
    today: 'Bugun',
    label: 'Ish kunlari kalendari',
    selected: 'tanlandi',
    pickMonth: 'Oyni tanlash',
    pickYear: 'Yilni tanlash',
    backToDays: 'Kunlarga qaytish',
  },
  ru: {
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    weekdaysLong: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    prevMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    prevYear: 'Предыдущий год',
    nextYear: 'Следующий год',
    prevYears: 'Предыдущие годы',
    nextYears: 'Следующие годы',
    today: 'Сегодня',
    label: 'Календарь рабочих дней',
    selected: 'выбрано',
    pickMonth: 'Выбрать месяц',
    pickYear: 'Выбрать год',
    backToDays: 'Вернуться к дням',
  },
  en: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekdaysLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    prevYear: 'Previous year',
    nextYear: 'Next year',
    prevYears: 'Previous years',
    nextYears: 'Next years',
    today: 'Today',
    label: 'Working days calendar',
    selected: 'selected',
    pickMonth: 'Pick a month',
    pickYear: 'Pick a year',
    backToDays: 'Back to days',
  },
}

/* ===================== Date helpers (local time, DST-safe) ===================== */
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
/** Monday = 0 ... Sunday = 6 */
const mondayIndex = (d: Date) => (d.getDay() + 6) % 7
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
/** `YYYY-MM-DD` — timezone siljishi yo'q (toISOString ishlatilmaydi) */
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

/** Yillar sahifasi: 12 yil, joriy yil o'rtada turadi */
const YEARS_PER_PAGE = 12
const yearPageStart = (year: number) => year - 5

type CalendarCell = { date: Date; inMonth: boolean }

/** Har oy uchun aynan 6 qator (42 katak) — balandlik sakramaydi */
function buildMonthGrid(month: Date): CalendarCell[] {
  const first = startOfMonth(month)
  const lead = mondayIndex(first)
  const total = daysInMonth(first)
  const cells: CalendarCell[] = []

  for (let i = lead; i > 0; i -= 1) cells.push({ date: addDays(first, -i), inMonth: false })
  for (let day = 1; day <= total; day += 1) {
    cells.push({ date: new Date(first.getFullYear(), first.getMonth(), day), inMonth: true })
  }
  while (cells.length < 42) {
    cells.push({ date: addDays(cells[cells.length - 1].date, 1), inMonth: false })
  }
  return cells
}

/* ===================== Calendar ===================== */
type CalView = 'days' | 'months' | 'years'

type FooterCalendarProps = {
  /** Tanlanadigan eng erta kun */
  minDate?: Date
  /** Tanlanadigan eng kech kun */
  maxDate?: Date
  /** Yopiq hafta kunlari (0=Yakshanba ... 6=Shanba) */
  disabledWeekdays?: number[]
  onSelect?: (date: Date) => void
}

function FooterCalendar({ minDate, maxDate, disabledWeekdays = [], onSelect }: FooterCalendarProps) {
  const { i18n } = useTranslation()

  const lang: Lang = useMemo(() => {
    const raw = (i18n.resolvedLanguage || i18n.language || 'uz').toLowerCase().split(/[-_]/)[0]
    return raw === 'ru' || raw === 'en' || raw === 'uz' ? (raw as Lang) : 'uz'
  }, [i18n.resolvedLanguage, i18n.language])

  const text = CAL_TEXT[lang]

  const [today, setToday] = useState(() => startOfDay(new Date()))
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const [view, setView] = useState<CalView>('days')
  const [selected, setSelected] = useState<Date | null>(null)
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(new Date()))
  const [yearBase, setYearBase] = useState(() => yearPageStart(new Date().getFullYear()))

  const bodyRef = useRef<HTMLDivElement>(null)
  const shouldFocusRef = useRef(false)

  /* --- Yarim kechada "bugun"ni yangilash --- */
  useEffect(() => {
    const tick = () => {
      const now = startOfDay(new Date())
      setToday((prev) => (isSameDay(prev, now) ? prev : now))
    }
    const id = window.setInterval(tick, 60_000)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const min = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate])
  const max = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate])

  const isDayDisabled = useCallback(
    (date: Date) => {
      if (min && date < min) return true
      if (max && date > max) return true
      return disabledWeekdays.includes(date.getDay())
    },
    [min, max, disabledWeekdays],
  )

  /** Oy butunlay diapazondan tashqarida bo'lsa — yopiq */
  const isMonthDisabled = useCallback(
    (year: number, month: number) => {
      const first = new Date(year, month, 1)
      const last = new Date(year, month + 1, 0)
      if (min && last < min) return true
      if (max && first > max) return true
      return false
    },
    [min, max],
  )

  const isYearDisabled = useCallback(
    (year: number) => {
      if (min && year < min.getFullYear()) return true
      if (max && year > max.getFullYear()) return true
      return false
    },
    [min, max],
  )

  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])
  const viewYear = viewMonth.getFullYear()
  const years = useMemo(
    () => Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearBase + i),
    [yearBase],
  )

  /* --- Navigatsiya chegaralari (rejimga qarab) --- */
  const canGoPrev = useMemo(() => {
    if (!min) return true
    if (view === 'days') return startOfMonth(min) < startOfMonth(viewMonth)
    if (view === 'months') return min.getFullYear() < viewYear
    return min.getFullYear() < yearBase
  }, [min, view, viewMonth, viewYear, yearBase])

  const canGoNext = useMemo(() => {
    if (!max) return true
    if (view === 'days') return startOfMonth(max) > startOfMonth(viewMonth)
    if (view === 'months') return max.getFullYear() > viewYear
    return max.getFullYear() >= yearBase + YEARS_PER_PAGE
  }, [max, view, viewMonth, viewYear, yearBase])

  /** viewMonth'ni min/max ichida ushlab turadi */
  const setViewSafe = useCallback(
    (next: Date) => {
      let candidate = startOfMonth(next)
      if (min && candidate < startOfMonth(min)) candidate = startOfMonth(min)
      if (max && candidate > startOfMonth(max)) candidate = startOfMonth(max)
      setViewMonth(candidate)
    },
    [min, max],
  )

  const step = (dir: 1 | -1) => {
    if (view === 'days') setViewSafe(addMonths(viewMonth, dir))
    else if (view === 'months') setViewSafe(new Date(viewYear + dir, viewMonth.getMonth(), 1))
    else setYearBase((base) => base + dir * YEARS_PER_PAGE)
  }

  /* --- Kunlar rejimida roving fokus --- */
  const moveFocus = useCallback((next: Date) => {
    shouldFocusRef.current = true
    setFocusDate(next)
    setViewMonth((prev) => (isSameMonth(prev, next) ? prev : startOfMonth(next)))
  }, [])

  useEffect(() => {
    if (!shouldFocusRef.current || view !== 'days') return
    shouldFocusRef.current = false
    bodyRef.current?.querySelector<HTMLButtonElement>(`[data-day="${toKey(focusDate)}"]`)?.focus()
  }, [focusDate, viewMonth, view])

  const selectDate = useCallback(
    (date: Date) => {
      if (isDayDisabled(date)) return
      const day = startOfDay(date)
      setSelected(day)
      setFocusDate(day)
      setViewMonth((prev) => (isSameMonth(prev, day) ? prev : startOfMonth(day)))
      onSelect?.(day)
    },
    [isDayDisabled, onSelect],
  )

  /** `focusAfter` faqat klaviaturadan kelganda true — sichqoncha bosganda halqa chiqmaydi */
  const pickMonth = (month: number, focusAfter: boolean) => {
    if (isMonthDisabled(viewYear, month)) return
    setViewSafe(new Date(viewYear, month, 1))
    setView('days')
    const target = new Date(viewYear, month, Math.min(focusDate.getDate(), daysInMonth(new Date(viewYear, month, 1))))
    shouldFocusRef.current = focusAfter
    setFocusDate(target)
  }

  const pickYear = (year: number) => {
    if (isYearDisabled(year)) return
    setViewSafe(new Date(year, viewMonth.getMonth(), 1))
    setView('months')
  }

  /* --- Klaviatura --- */
  const onDaysKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    const key = event.key

    if (key in deltas) {
      event.preventDefault()
      moveFocus(addDays(focusDate, deltas[key]))
      return
    }
    if (key === 'Home') {
      event.preventDefault()
      moveFocus(addDays(focusDate, -mondayIndex(focusDate)))
      return
    }
    if (key === 'End') {
      event.preventDefault()
      moveFocus(addDays(focusDate, 6 - mondayIndex(focusDate)))
      return
    }
    if (key === 'PageUp' || key === 'PageDown') {
      event.preventDefault()
      const target = addMonths(focusDate, key === 'PageUp' ? -1 : 1)
      moveFocus(new Date(target.getFullYear(), target.getMonth(), Math.min(focusDate.getDate(), daysInMonth(target))))
      return
    }
    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      event.preventDefault()
      selectDate(focusDate)
      return
    }
    if (key === 'Escape') {
      event.preventDefault()
      setView('months')
    }
  }

  /** months/years panellari uchun umumiy strelka navigatsiyasi */
  const onGridKeyDown = (columns: number) => (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    }
    const key = event.key

    if (key === 'Escape') {
      event.preventDefault()
      setView(view === 'years' ? 'months' : 'days')
      return
    }
    if (!(key in deltas)) return

    event.preventDefault()
    const buttons = Array.from(
      bodyRef.current?.querySelectorAll<HTMLButtonElement>('button[data-idx]:not(:disabled)') ?? [],
    )
    if (!buttons.length) return

    const active = document.activeElement as HTMLElement | null
    const currentIdx = buttons.findIndex((btn) => btn === active)
    const nextIdx = clamp((currentIdx === -1 ? 0 : currentIdx) + deltas[key], 0, buttons.length - 1)
    buttons[nextIdx]?.focus()
  }

  const goToToday = () => {
    setView('days')
    setViewSafe(startOfMonth(today))
    moveFocus(today)
  }

  const longDate = (date: Date) =>
    `${date.getDate()} ${text.months[date.getMonth()]} ${date.getFullYear()}, ${text.weekdaysLong[mondayIndex(date)]}`

  /* --- Sarlavha va nav yorliqlari --- */
  const titleText =
    view === 'days'
      ? `${text.months[viewMonth.getMonth()]} ${viewYear}`
      : view === 'months'
        ? String(viewYear)
        : `${yearBase} – ${yearBase + YEARS_PER_PAGE - 1}`

  const titleAria = view === 'days' ? text.pickMonth : view === 'months' ? text.pickYear : text.backToDays
  const prevAria = view === 'days' ? text.prevMonth : view === 'months' ? text.prevYear : text.prevYears
  const nextAria = view === 'days' ? text.nextMonth : view === 'months' ? text.nextYear : text.nextYears

  const onTitleClick = () => {
    if (view === 'days') {
      setView('months')
      return
    }
    if (view === 'months') {
      setYearBase(yearPageStart(viewYear))
      setView('years')
      return
    }
    setView('days')
  }

  // Grid ichida doim bitta tabbable katak bo'lishi kerak (roving tabindex)
  const tabDate = isSameMonth(focusDate, viewMonth)
    ? focusDate
    : isSameMonth(today, viewMonth)
      ? today
      : startOfMonth(viewMonth)

  const readout = selected
    ? `${selected.getDate()} ${text.months[selected.getMonth()]} ${selected.getFullYear()} · ${text.weekdaysLong[mondayIndex(selected)]}`
    : `${today.getDate()} ${text.months[today.getMonth()]} ${today.getFullYear()}`

  return (
    <div className={`fcal fcal--${view}`} role="group" aria-label={text.label}>
      <div className="fcal-head">
        <button type="button" className="fcal-nav" onClick={() => step(-1)} disabled={!canGoPrev} aria-label={prevAria}>
          <ChevronLeftIcon />
        </button>

        <button
          type="button"
          className="fcal-title"
          onClick={onTitleClick}
          aria-label={`${titleText} — ${titleAria}`}
          aria-live="polite"
        >
          <span className="fcal-title-text">{titleText}</span>
          <span className="fcal-caret" aria-hidden="true">
            <CaretIcon />
          </span>
        </button>

        <button type="button" className="fcal-nav" onClick={() => step(1)} disabled={!canGoNext} aria-label={nextAria}>
          <ChevronRightIcon />
        </button>
      </div>

      {view === 'days' && (
        <div className="fcal-weekdays" aria-hidden="true">
          {text.weekdaysShort.map((day, index) => (
            <span key={day} className={index > 4 ? 'fcal-wd is-weekend' : 'fcal-wd'}>
              {day}
            </span>
          ))}
        </div>
      )}

      <div className="fcal-body" ref={bodyRef}>
        {view === 'days' && (
          <div
            className="fcal-grid fcal-grid--days"
            role="grid"
            aria-label={`${text.months[viewMonth.getMonth()]} ${viewYear}`}
            onKeyDown={onDaysKeyDown}
          >
            {cells.map(({ date, inMonth }) => {
              const key = toKey(date)

              if (!inMonth) {
                return <span key={key} className="fcal-day is-outside" role="gridcell" aria-hidden="true" />
              }

              const disabled = isDayDisabled(date)
              const isToday = isSameDay(date, today)
              const isSelected = !!selected && isSameDay(date, selected)
              const weekend = date.getDay() === 0 || date.getDay() === 6

              const classes = ['fcal-day']
              if (isToday) classes.push('is-today')
              if (isSelected) classes.push('is-selected')
              if (weekend) classes.push('is-weekend')

              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  data-day={key}
                  className={classes.join(' ')}
                  tabIndex={isSameDay(date, tabDate) ? 0 : -1}
                  disabled={disabled}
                  aria-current={isToday ? 'date' : undefined}
                  aria-selected={isSelected}
                  aria-label={`${longDate(date)}${isSelected ? `, ${text.selected}` : ''}`}
                  onClick={() => selectDate(date)}
                  onFocus={() => setFocusDate(startOfDay(date))}
                >
                  <span>{date.getDate()}</span>
                </button>
              )
            })}
          </div>
        )}

        {view === 'months' && (
          <div className="fcal-grid fcal-grid--months" role="grid" aria-label={text.pickMonth} onKeyDown={onGridKeyDown(3)}>
            {text.monthsShort.map((label, month) => {
              const disabled = isMonthDisabled(viewYear, month)
              const isCurrent = today.getFullYear() === viewYear && today.getMonth() === month
              const isActive = viewMonth.getMonth() === month
              const isSelectedMonth =
                !!selected && selected.getFullYear() === viewYear && selected.getMonth() === month

              const classes = ['fcal-cell']
              if (isCurrent) classes.push('is-today')
              if (isSelectedMonth) classes.push('is-selected')
              else if (isActive) classes.push('is-active')

              return (
                <button
                  key={label}
                  type="button"
                  role="gridcell"
                  data-idx={month}
                  className={classes.join(' ')}
                  disabled={disabled}
                  aria-current={isCurrent ? 'date' : undefined}
                  aria-label={`${text.months[month]} ${viewYear}`}
                  onClick={(event) => pickMonth(month, event.detail === 0)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}

        {view === 'years' && (
          <div className="fcal-grid fcal-grid--years" role="grid" aria-label={text.pickYear} onKeyDown={onGridKeyDown(3)}>
            {years.map((year, idx) => {
              const disabled = isYearDisabled(year)
              const isCurrent = today.getFullYear() === year
              const isActive = viewYear === year
              const isSelectedYear = !!selected && selected.getFullYear() === year

              const classes = ['fcal-cell']
              if (isCurrent) classes.push('is-today')
              if (isSelectedYear) classes.push('is-selected')
              else if (isActive) classes.push('is-active')

              return (
                <button
                  key={year}
                  type="button"
                  role="gridcell"
                  data-idx={idx}
                  className={classes.join(' ')}
                  disabled={disabled}
                  aria-current={isCurrent ? 'date' : undefined}
                  aria-label={String(year)}
                  onClick={() => pickYear(year)}
                >
                  {year}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="fcal-foot">
        <button type="button" className="fcal-today-btn" onClick={goToToday}>
          <span className="fcal-dot" aria-hidden="true" />
          {text.today}
        </button>
        <span className="fcal-readout" title={readout}>
          {readout}
        </span>
      </div>
    </div>
  )
}

/** Yakshanba dam olish kuni (barqaror referens) */
const CLOSED_WEEKDAYS = [0]

/* ===================== Animated words ===================== */
function FooterHeadingWords({ text, startIndex, keyPrefix }: { text: string; startIndex: number; keyPrefix: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={`${keyPrefix}${i}`} className="fw-word" style={{ animationDelay: `${(startIndex + i) * 0.08}s` }}>
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </>
  )
}

/* ===================== Footer ===================== */
export default function Footer() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
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
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const year = new Date().getFullYear()

  const heading = t('footer.heading', { returnObjects: true }) as {
    titleStart: string
    titleAccent: string
    titleEnd: string
  }
  const startCount = heading.titleStart.split(' ').length
  const accentCount = heading.titleAccent.split(' ').length

  return (
    <footer ref={sectionRef} className={inView ? 'footer in-view' : 'footer'}>
      <div className="footer-glow" aria-hidden="true" />
      {/* Fon bezaklari: tomchilar o'rniga logo suratlari */}
      <div className="footer-marks" aria-hidden="true">
        <span className="mark mark-a"><img src={logo} alt="" /></span>
        <span className="mark mark-b"><img src={logo} alt="" /></span>
        <span className="mark mark-c"><img src={logo} alt="" /></span>
      </div>
      <div className="footer-shimmer" aria-hidden="true" />

      <div className="footer-inner">
        <h2 className="footer-heading">
          <FooterHeadingWords text={heading.titleStart} startIndex={0} keyPrefix="fs" />{' '}
          <em>
            <FooterHeadingWords text={heading.titleAccent} startIndex={startCount} keyPrefix="fa" />
          </em>{' '}
          <FooterHeadingWords text={heading.titleEnd} startIndex={startCount + accentCount} keyPrefix="fe" />
        </h2>

        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Asman home">
              <img src={logo} alt="Asman" />
            </Link>
            <p className="footer-about">{t('footer.about')}</p>
            <div className="footer-social">
              {socialLinks.map(({ key, href, Icon }, index) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`footer.social.${key}`)}
                  style={{ animationDelay: `${0.5 + index * 0.08}s` }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3>{t('footer.menuTitle')}</h3>
            <nav aria-label="Footer">
              {menuKeys.map((key, index) => (
                <Link key={key} to={key === 'home' ? '/' : `/${key}`} style={{ animationDelay: `${0.2 + index * 0.06}s` }}>
                  {t(`nav.${key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-col footer-contact">
            <h3>{t('footer.contactTitle')}</h3>
            <a href={`tel:${t('footer.phoneHref')}`} style={{ animationDelay: '.4s' }}>
              <PhoneIcon /> {t('footer.phone')}
            </a>
            <a href={`mailto:${t('footer.email')}`} style={{ animationDelay: '.47s' }}>
              <MailIcon /> {t('footer.email')}
            </a>
            <span className="footer-address-line" style={{ animationDelay: '.54s' }}>
              <PinIcon /> {t('footer.address')}
            </span>
          </div>

          <div className="footer-col footer-calendar-col">
            <h3>
              <CalendarIcon /> {t('footer.scheduleTitle', { defaultValue: 'Ish jadvali' })}
            </h3>
            <div className="footer-calendar-wrapper">
              <FooterCalendar disabledWeekdays={CLOSED_WEEKDAYS} />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-bottom-dot" aria-hidden="true" />
          <p>
            © {year} {t('brand')}. {t('footer.rights')}
          </p>
        </div>
      </div>

      <button
        className={showTop ? 'scroll-top visible' : 'scroll-top'}
        onClick={scrollToTop}
        aria-label={t('footer.scrollTop')}
      >
        <ArrowUpIcon />
      </button>
    </footer>
  )
}