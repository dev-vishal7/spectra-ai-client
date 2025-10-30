import React from "react";

const Pricing = () => (
  <section className="bg-gray-50 py-20 px-6 md:px-16 text-center">
    <h2 className="text-3xl font-bold mb-10">Simple & Clear</h2>
    <div className="max-w-sm mx-auto bg-white border border-gray-200 shadow rounded-lg p-10">
      <h3 className="text-4xl font-extrabold mb-4">$15</h3>
      <p className="text-gray-600 mb-8">per month</p>
      <ul className="text-left text-gray-600 space-y-3 mb-8">
        <li>✓ Full access to all features</li>
        <li>✓ Realtime dashboards</li>
        <li>✓ Plug-and-play analytics setup</li>
        <li>✓ Scales with your operations</li>
      </ul>
      <button className="bg-black text-white w-full py-3 rounded-md font-semibold hover:bg-gray-800 transition">
        Get Started
      </button>
      <p className="text-sm text-gray-400 mt-4">
        * Billed monthly or annually. Cancel anytime.
      </p>
    </div>
  </section>
);

export default Pricing;
