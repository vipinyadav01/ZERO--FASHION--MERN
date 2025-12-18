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
      <div className="w-full overflow-x-hidden">
        <main>
          {/* Hero section - handles its own navbar offset */}
          <Hero />
          
          {/* Rest of the content */}
          <div className="space-y-16 py-8">
            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewsletterBox />
          </div>
        </main>
        
        {/* Mobile bottom nav compensation */}
        <div className="md:hidden h-[68px]"></div>
      </div>
    </>
  )
}

export default Home

