import React from "react";

const PhysicalOpsProblem = () => (
  <section className="bg-gray-50 py-16 px-6 md:px-16 text-center">
    <h2 className="text-3xl font-bold mb-12">The Physical Ops Problem</h2>
    <div className="grid md:grid-cols-3 gap-10">
      {[
        {
          title: "Limited Visibility",
          desc: "It’s hard to visualize metrics and flow in one place.",
        },
        {
          title: "Time Lost",
          desc: "Teams waste hours daily on manual data logs & reporting.",
        },
        {
          title: "Inexact Decisions",
          desc: "Hard to improve when you can’t measure in real time.",
        },
      ].map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-xl mb-3">{item.title}</h3>
          <p className="text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
    <p className="text-gray-600 mt-10">
      Spectra brings analytics to your operations, assets, machines, and
      properties — in minutes.
    </p>
  </section>
);

export default PhysicalOpsProblem;
