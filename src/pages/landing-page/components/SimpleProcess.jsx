import React from "react";
const SimpleProcess = () => (
  <section className="bg-gray-50 py-20 px-6 md:px-16">
    <h2 className="text-3xl font-bold text-center mb-12">
      Simple process, powerful results
    </h2>
    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          num: "01",
          title: "Connect Anything",
          desc: "From machines to sensors, link any data source within minutes.",
        },
        {
          num: "02",
          title: "Stream & Normalize",
          desc: "Spectra automatically cleans and structures data in real time.",
        },
        {
          num: "03",
          title: "Observe & Act",
          desc: "Visualize trends instantly, set alerts, and trigger automations.",
        },
      ].map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-8 text-center">
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

export default SimpleProcess;
