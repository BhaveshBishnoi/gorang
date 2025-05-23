import {
  Leaf,
  Heart,
  Shield,
  Award,
  Users,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  Star,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "100% Organic",
      description:
        "All our products are certified organic, sourced directly from trusted farmers without any synthetic chemicals or pesticides.",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Made with Love",
      description:
        "Every product is crafted with care and passion, following traditional methods passed down through generations.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Quality Assured",
      description:
        "We maintain strict quality controls and testing procedures to ensure you receive only the finest products.",
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Award Winning",
      description:
        "Our products have received multiple certifications and awards for quality and authenticity.",
    },
  ];

  const stats = [
    { number: "5000+", label: "Happy Customers" },
    { number: "50+", label: "Organic Products" },
    { number: "10+", label: "Years Experience" },
    { number: "100%", label: "Satisfaction Rate" },
  ];

  const timeline = [
    {
      year: "2014",
      title: "The Beginning",
      description:
        "Started with a small farm in Ridmalsar, focusing on traditional organic farming methods.",
    },
    {
      year: "2017",
      title: "First Products",
      description:
        "Launched our first range of organic ghee and cold-pressed oils in local markets.",
    },
    {
      year: "2020",
      title: "Going Digital",
      description:
        "Expanded online to reach customers across India with our pure organic products.",
    },
    {
      year: "2024",
      title: "Today",
      description:
        "Serving thousands of families with premium organic products and growing every day.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-green-50 to-white overflow-hidden">
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full text-green-700 font-medium mb-6">
                <Leaf className="h-4 w-4 mr-2" />
                Pure • Organic • Authentic
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Our Story of
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  {" "}
                  Pure Organic Living
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                At Gorang, we believe in the power of nature to nourish and
                heal. Since 2014, we&apos;ve been committed to bringing you the
                purest organic products straight from the heart of Rajasthan to
                your home.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-green-100"
                  >
                    <div className="text-3xl font-bold text-green-700 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What We Stand For
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our values guide everything we do, from sourcing to delivery
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="group text-center">
                  <div className="bg-gray-50 group-hover:bg-green-50 rounded-2xl p-8 transition-all duration-300 border border-gray-100 group-hover:border-green-200 group-hover:shadow-lg">
                    <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey Timeline */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From a small farm to serving thousands of families across India
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 hidden md:block"></div>

                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex items-start mb-12 md:mb-16"
                  >
                    <div className="hidden md:flex absolute left-6 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                    <div className="md:ml-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 w-full">
                      <div className="flex items-center mb-4">
                        <span className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-sm">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Why Choose Gorang?
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  We&apos;re not just another organic food company. We&apos;re a
                  family business rooted in traditional values and committed to
                  your health and well-being.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                      title: "Direct from Farm",
                      description:
                        "No middlemen, ensuring freshness and fair prices for farmers",
                    },
                    {
                      icon: <Truck className="h-6 w-6 text-green-600" />,
                      title: "Safe Delivery",
                      description:
                        "Carefully packaged and delivered to maintain product integrity",
                    },
                    {
                      icon: <Clock className="h-6 w-6 text-green-600" />,
                      title: "Traditional Methods",
                      description:
                        "Time-tested processes that preserve nutritional value",
                    },
                    {
                      icon: <Star className="h-6 w-6 text-green-600" />,
                      title: "Customer First",
                      description:
                        "Your satisfaction is our top priority with 24/7 support",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-4 mt-1">{item.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-8 text-white">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-300 rounded-full opacity-20"></div>

                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <MapPin className="h-8 w-8 mr-3" />
                      <h3 className="text-2xl font-bold">Our Location</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Headquarters</h4>
                        <p className="text-green-100">
                          Ridmalsar, Padampur
                          <br />
                          Sriganganagar, Rajasthan
                          <br />
                          335061, India
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Contact Details</h4>
                        <p className="text-green-100">
                          Phone: +91 7296979897
                          <br />
                          Email: contact@gorang.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Our Mission
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed mb-8 text-green-50">
                `To make pure, organic, and traditional products accessible to
                every family, promoting health and wellness while supporting
                sustainable farming practices in rural India.`
              </p>
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <Users className="h-12 w-12 mx-auto mb-4 text-green-200" />
                  <h3 className="text-xl font-bold mb-2">Community First</h3>
                  <p className="text-green-100">
                    Supporting local farmers and bringing you the best of
                    traditional Indian organic products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
