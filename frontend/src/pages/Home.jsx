import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import SEO, { SEOConfigs } from '../components/SEO'

const Home = () => {
  return (
    <>
      <SEO {...SEOConfigs.home} />
      <div className="min-h-screen">
        {/* Desktop navbar compensation */}
        <div className="hidden lg:block h-16"></div>
        
        {/* Mobile navbar compensation handled in MobileNavbar component */}
        <main className="relative">
          <Hero />
          <div className="space-y-16 py-8">
            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewsletterBox />
          </div>
        </main>
        
        {/* Mobile bottom nav compensation */}
        <div className="lg:hidden h-[68px]"></div>
      </div>
    </>
  )
}

export default Home
