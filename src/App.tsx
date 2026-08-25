import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Footer from './components/Footer/Footer'
import { menuKeys } from './components/shared/navigation'
import About from './components/About/About'
import Products from './components/Products/Products'
import Projects from './components/Projects/Projects'
import News from './components/News/News'
import Contact from './components/Contact/Contact'

function Layout() {
  return <><Navbar /><Outlet /><Footer /></>
}

function Home() {
  return <main><Hero /></main>
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