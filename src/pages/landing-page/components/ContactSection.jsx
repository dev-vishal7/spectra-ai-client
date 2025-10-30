import React from "react";

const ContactSection = () => (
  <section className="py-20 px-6 md:px-16 bg-black text-white text-center">
    <h2 className="text-3xl font-extrabold mb-6">
      Ready to make your floors, units, assets, and machines visible in real
      time?
    </h2>
    <form className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4 text-left">
      <input
        type="text"
        placeholder="Business Name"
        className="p-3 rounded-md text-black"
      />
      <input
        type="text"
        placeholder="Full Name"
        className="p-3 rounded-md text-black"
      />
      <input
        type="email"
        placeholder="Business Email"
        className="p-3 rounded-md text-black"
      />
      <input
        type="text"
        placeholder="Phone Number"
        className="p-3 rounded-md text-black"
      />
      <textarea
        placeholder="Tell us about your needs"
        className="md:col-span-2 p-3 rounded-md text-black h-24"
      />
      <button className="md:col-span-2 bg-white text-black font-semibold py-3 rounded-md hover:bg-gray-200 transition">
        Schedule a Demo
      </button>
    </form>
  </section>
);

export default ContactSection;
