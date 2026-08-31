import SEO from '../shared/SEO'
import PageHero from '../PageHero/PageHero'
import './Projects.scss'
import CtaBanner from '../HomePage/CtaBanner'

export default function Projects() {
  return (
    <>
      <SEO pageKey="projects" />
      <PageHero pageKey="projects" />
      <CtaBanner/>
    </>
  )
}