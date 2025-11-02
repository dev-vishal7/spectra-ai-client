import React, { useState } from "react";

export function CTASection() {
  const [formData, setFormData] = useState({
    businessName: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    console.log("[v0] Form submitted:", formData);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitMessage("Thank you! We'll be in touch soon.");
    setIsSubmitting(false);

    setTimeout(() => {
      setFormData({
        businessName: "",
        fullName: "",
        email: "",
        phone: "",
        role: "",
        requirements: "",
      });
      setSubmitMessage("");
    }, 3000);
  };

  return (
    <section id="demo-form" className="py-24 bg-black text-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to make your floors, units, assets, and machines visible in
            real time?
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 backdrop-blur-sm rounded-2xl p-8 border border-background/20"
          style={{ backgroundColor: "ButtonShadow" }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium mb-2"
              >
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="Your Company"
                className="bg-background text-foreground w-full p-2 rounded border border-border"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="bg-background text-foreground w-full p-2 rounded border border-border"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@company.com"
                className="bg-background text-foreground w-full p-2 rounded border border-border"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="bg-background text-foreground w-full p-2 rounded border border-border"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Role / Title
            </label>
            <input
              id="role"
              type="text"
              placeholder="Operations Manager"
              className="bg-background text-foreground w-full p-2 rounded border border-border"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium mb-2"
            >
              Requirement / Notes
            </label>
            <textarea
              id="requirements"
              placeholder="Tell us about your needs..."
              rows={4}
              className="bg-background text-foreground w-full p-2 rounded border border-border"
              value={formData.requirements}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-black/90 text-primary-foreground py-3 rounded-lg text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Connect & Start Observing →"}
          </button>

          {submitMessage && (
            <p className="text-center text-sm text-background/80">
              {submitMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
