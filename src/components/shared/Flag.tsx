import './Flag.scss'

// Looks for uz.png / ru.png / en.png inside src/assets/logo
const logoImages = import.meta.glob('../../assets/logo/*.{png,PNG}', { eager: true, import: 'default', query: '?url' }) as Record<string, string>
const flags = ['uz', 'ru', 'en'].reduce<Record<string, string | undefined>>((result, lang) => {
  result[lang] = Object.entries(logoImages).find(([path]) => new RegExp(`/${lang}\\.png$`, 'i').test(path))?.[1]
  return result
}, {})

export default function Flag({ lang }: { lang: string }) {
  return flags[lang] ? <img className="flag" src={flags[lang]} alt="" /> : <i className={`flag flag-${lang}`}></i>
}