import React from "react";

const MicroSetup = () => (
  <section className="py-20 px-6 md:px-16">
    <h2 className="text-3xl font-bold text-center mb-10">
      Micro Setup → Macro Impact
    </h2>
    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          num: "01",
          title: "Plug & Play Interface",
          desc: "Add or remove data streams easily, no coding required.",
        },
        {
          num: "02",
          title: "Micro Analytics",
          desc: "Track the smallest operational details for maximum insight.",
        },
        {
          num: "03",
          title: "Macro Results",
          desc: "Drive efficiency, reduce downtime, and scale your processes.",
        },
      ].map((item, idx) => (
        <div key={idx} className="bg-white shadow rounded-lg p-8 text-center">
          <h3 className="text-5xl font-extrabold text-gray-900 mb-4">
            {item.num}
          </h3>
          <h4 className="font-bold text-xl mb-2">{item.title}</h4>
          <p className="text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default MicroSetup;
