"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  Truck,
  Star,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: "Visit Our Location",
      details: [
        "Ridmalsar, Padampur",
        "Sriganganagar, Rajasthan",
        "335061, India",
      ],
      action: "Get Directions",
    },
    {
      icon: <Phone className="h-6 w-6 text-green-600" />,
      title: "Call Us",
      details: [
        "+91 7296979897",
        "Mon-Sat: 9:00 AM - 7:00 PM",
        "Sunday: 10:00 AM - 5:00 PM",
      ],
      action: "Call Now",
    },
    {
      icon: <Mail className="h-6 w-6 text-green-600" />,
      title: "Email Us",
      details: [
        "contact@gorang.com",
        "support@gorang.com",
        "We reply within 24 hours",
      ],
      action: "Send Email",
    },
  ];

  const faqs = [
    {
      question: "What makes your products organic?",
      answer:
        "All our products are certified organic, sourced from farms that don't use synthetic pesticides, fertilizers, or GMOs. We follow strict organic farming standards.",
    },
    {
      question: "How do you ensure product freshness?",
      answer:
        "We maintain cold chain storage and use protective packaging. Most products are prepared fresh upon order and delivered within 2-3 days.",
    },
    {
      question: "Do you deliver across India?",
      answer:
        "Yes, we deliver pan-India. Shipping costs vary by location and are calculated at checkout. Free delivery on orders above ₹999.",
    },
    {
      question: "What's your return policy?",
      answer:
        "We offer 100% satisfaction guarantee. If you're not happy with any product, contact us within 7 days for a full refund or replacement.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-green-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full text-green-700 font-medium mb-6">
              <MessageCircle className="h-4 w-4 mr-2" />
              We&apos;re Here to Help
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {" "}
                Touch
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Have questions about our organic products? Need help with an
              order? Or just want to learn more about our farming practices?
              We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group-hover:shadow-xl group-hover:border-green-200 transition-all duration-300 text-center h-full">
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <div className="bg-green-50 p-4 rounded-full">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {info.title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    {info.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-green-700 font-medium">
                    Thank you! Your message has been sent successfully.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-support">Order Support</option>
                    <option value="bulk-order">Bulk Order</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Business Hours & Additional Info */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Clock className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Business Hours
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    { day: "Monday - Friday", time: "9:00 AM - 7:00 PM" },
                    { day: "Saturday", time: "9:00 AM - 7:00 PM" },
                    { day: "Sunday", time: "10:00 AM - 5:00 PM" },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-700">
                        {schedule.day}
                      </span>
                      <span className="text-green-600 font-medium">
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Note:</strong> We&apos;re also available on WhatsApp
                    for quick queries and support!
                  </p>
                </div>
              </div>

              {/* Quick Support */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-6">
                  <HeadphonesIcon className="h-6 w-6 mr-3" />
                  <h3 className="text-2xl font-bold">Need Quick Help?</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 mr-3 mt-1 text-green-200" />
                    <div>
                      <h4 className="font-semibold mb-1">Order Tracking</h4>
                      <p className="text-green-100 text-sm">
                        Track your order status in real-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Star className="h-5 w-5 mr-3 mt-1 text-green-200" />
                    <div>
                      <h4 className="font-semibold mb-1">
                        Product Information
                      </h4>
                      <p className="text-green-100 text-sm">
                        Get detailed info about our organic products
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-green-500">
                  <p className="text-green-100 text-sm mb-4">
                    For immediate assistance, call us directly:
                  </p>
                  <a
                    href="tel:+917296979897"
                    className="inline-flex items-center bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    +91 7296979897
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions about our products and
                services
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <a
                href="mailto:contact@gorang.com"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
