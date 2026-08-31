import SEO from '../shared/SEO'
import PageHero from '../PageHero/PageHero'
import './Products.scss'
import CtaBanner from '../HomePage/CtaBanner'

export default function Products() {
  return (
    <>
      <SEO pageKey="products" />
      <PageHero pageKey="products" />
      <CtaBanner/>
    </>
  )
}