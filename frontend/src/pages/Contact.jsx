
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import SEO, { SEOConfigs } from "../components/SEO";

const Contact = () => {
  return (
    <>
      <SEO {...SEOConfigs.contact} />
      <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-80 bg-gray-900">
        <img
          src={assets.hero_img}
          alt="ZeroFashion Store"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Store Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Flagship Store
              </h2>
              <p className="text-lg text-gray-600">
                32A, Luxury Avenue, Varanasi
                <br />
                Uttar Pradesh, India
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Contact Information
              </h3>
              <p className="text-lg text-gray-600">
                Tel: +91 9918572513
                <br />
                Email: contact@zerofashion.vercel.app
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Opening Hours
              </h3>
              <p className="text-lg text-gray-600">
                Monday - Saturday: 10:00 AM - 9:00 PM
                <br />
                Sunday: 11:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          {/* Map of Varanasi */}
          <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.23982822113!2d82.92106832346196!3d25.320746507140592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131710853ff0b5!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1653905762899!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Varanasi Map"
            ></iframe>
          </div>
        </div>

        {/* Career Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Career at ZeroFashion
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
            <p className="text-xl text-gray-700 mb-6">
              Join our team of passionate fashion enthusiasts and innovators.
              We&apos;re always looking for talented individuals to help shape the
              future of fashion.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Explore our current openings and find your perfect fit in the
              world of premium fashion.
            </p>
            <button className="bg-black text-white px-8 py-4 text-lg font-semibold rounded-md hover:bg-gray-800 transition-colors duration-300">
              Explore Job Openings
            </button>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-20">
          <NewsletterBox />
        </div>
      </div>
      </div>
    </>
  );
};

export default Contact;
