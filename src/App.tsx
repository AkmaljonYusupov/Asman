import { useLayoutEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import HomeAbout from './components/HomePage/HomeAbout'
import Sertifikatpage from './components/HomePage/Sertifikatpage'
import Footer from './components/Footer/Footer'
import SEO from './components/shared/SEO'
import { menuKeys } from './components/shared/navigation'
import About from './components/About/About'
import Products from './components/Products/Products'
import Projects from './components/Projects/Projects'
import News from './components/News/News'
import Contact from './components/Contact/Contact'

function Layout() {
  const { pathname, hash } = useLocation()

  // Har bir marshrut almashganda sahifani yuqoriga qaytaradi.
  //
  // useLayoutEffect ishlatilgan — u brauzer yangi kadrni chizishidan
  // OLDIN, sinxron ishlaydi, shuning uchun eski scroll pozitsiyasi bir
  // lahzaga ham "yalt" etib ko'rinmaydi.
  //
  // window.scrollTo() o'rniga documentElement.scrollTop ga to'g'ridan-
  // to'g'ri qiymat berilmoqda: agar global CSS'da
  // `html { scroll-behavior: smooth }` bo'lsa, window.scrollTo() o'sha
  // qoidaga bo'ysunib, sekin animatsiya bilan yuqoriga ko'tariladi (yoki
  // tez-tez navigatsiya qilinganda umuman yetib ulgurmay qoladi).
  // scrollTop'ga bevosita yozish esa CSS'dan mustaqil — har doim oniy.
  useLayoutEffect(() => {
    if (hash) return // #bo'lim havolasi bo'lsa, o'sha yerga scroll qilinsin
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0 // eski Safari uchun zaxira
  }, [pathname, hash])

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

function Home() {
  return (
    <main>
      <SEO pageKey="home" />
      <Hero />
      <HomeAbout />
      <Sertifikatpage />
    </main>
  )
}

function Placeholder() {
  return <main className="placeholder"><h1>Asman</h1></main>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        {menuKeys.slice(1).map((key) => (
          <Route key={key} path={key} element={<Placeholder />} />
        ))}
      </Route>
    </Routes>
  )
}