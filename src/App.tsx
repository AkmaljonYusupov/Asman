import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import { menuKeys } from './components/shared/navigation'

function Layout() {
  return <><Navbar /><Outlet /></>
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
        {menuKeys.slice(1).map((key) => (
          <Route key={key} path={key} element={<Placeholder />} />
        ))}
      </Route>
    </Routes>
  )
}