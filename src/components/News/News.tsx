import SEO from '../shared/SEO'
import PageHero from '../PageHero/PageHero'
import './News.scss'
import CtaBanner from '../HomePage/CtaBanner'

export default function News() {
  return (
    <>
      <SEO pageKey="news" />
      <PageHero pageKey="news" />
      <CtaBanner/>
    </>
  )
}