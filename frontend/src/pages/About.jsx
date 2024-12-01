import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center mt-24 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to Zero Fashion — where style meets sustainability. We are
            an eco-conscious fashion brand dedicated to bringing you the latest
            trends with zero compromise on quality and the environment. At Zero
            Fashion, we believe that looking good should also mean feeling good
            about the choices we make. That's why every piece in our collection
            is crafted with care, keeping sustainability and affordability in
            mind.
          </p>
          <p>
            Our journey started with a simple vision: to make fashion accessible
            without the heavy environmental cost. We partner with ethical
            manufacturers, use responsibly sourced materials, and are constantly
            working to reduce our footprint. From packaging to production, we're
            committed to practices that respect the planet and the people who
            live on it.
          </p>
          <p>
            Join us as we build a future of fashion that's both stylish and
            sustainable. Discover our collections and find your perfect style —
            without compromise. Because at Zero Fashion, zero waste and zero
            harm means 100% style.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            At Zero Fashion, our mission is to redefine the fashion industry by
            making sustainability stylish and accessible for everyone. We're
            committed to reducing waste, promoting ethical practices, and
            empowering our customers to make choices that reflect their values.
            By embracing innovative materials and responsible production
            methods, we aim to minimize our environmental impact and set a new
            standard in eco-friendly fashion.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            At Zero Fashion, quality is our promise. We know that sustainable
            fashion shouldn't mean compromising on durability or style. That's
            why each item undergoes rigorous quality checks at every stage, from
            design to delivery. Our commitment to excellence ensures that you
            receive a product that's not only stylish but also crafted to last.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            At Zero Fashion, we make sustainable shopping simple. Enjoy a
            streamlined online experience, fast shipping, and dedicated customer
            support for a hassle-free journey from browsing to delivery. Fashion
            that fits your lifestyle, effortlessly.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            At Zero Fashion, we're here for you. Our friendly support team is
            dedicated to quick responses, personalized assistance, and ensuring
            your satisfaction at every step. Because your experience matters.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default About;
