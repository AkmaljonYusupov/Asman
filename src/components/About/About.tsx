import SEO from '../shared/SEO'
import PageHero from '../PageHero/PageHero'
import './About.scss'
import HomeAbout from '../HomePage/HomeAbout'
import Sertifikatpage from '../HomePage/Sertifikatpage'

export default function About() {
  return (
    <>
      <SEO pageKey="about" />
      <PageHero pageKey="about" />
      <HomeAbout/>
      <Sertifikatpage/>
    </>
  )
}