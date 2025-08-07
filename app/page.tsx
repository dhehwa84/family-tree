import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Users } from 'lucide-react'
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Placeholder for Logo */}
            <Users className="w-8 h-8 text-purple-100" />
            <h1 className="text-3xl font-extrabold tracking-tight">
              Madzvamutse Clan
            </h1>
          </div>
          <nav>
            <Link href="/family-view" passHref>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white transition-colors duration-200">
                View Family Tree
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-50 to-indigo-100 py-20 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/abstract-purple-blue.png"
              alt="Background pattern"
              layout="fill"
              objectFit="cover"
              quality={100}
              className="z-0"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-7xl font-extrabold text-purple-900 leading-tight mb-6 drop-shadow-md">
              Unveiling the Rich Heritage of the Madzvamutse Clan
            </h2>
            <p className="text-lg md:text-xl text-purple-800 mb-10 max-w-2xl mx-auto">
              Explore the deep roots, vibrant history, and enduring legacy of our family. Connect with generations past and present.
            </p>
            <Link href="/family-view" passHref>
              <Button size="lg" className="bg-purple-700 hover:bg-purple-800 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                Discover Our Family Tree
              </Button>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-center text-purple-800 mb-12">Our Story</h3>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg leading-relaxed mb-6">
                  The Madzvamutse clan, rooted deeply in the rich soils of Zimbabwe, carries a history woven with resilience, tradition, and community spirit. Our lineage traces back through generations, each contributing to the vibrant tapestry that defines us today. From the early days in Wedza, Mashonaland East, our ancestors laid foundations built on strong family bonds and a profound respect for our heritage.
                </p>
                <p className="text-lg leading-relaxed">
                  This platform is a living testament to our journey, a digital archive designed to preserve our stories, celebrate our achievements, and connect family members across the globe. We invite you to delve into our past, understand our present, and help shape our future.
                </p>
              </div>
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/zimbabwean-family-gathering.png"
                  alt="Historical family gathering"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-16 bg-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-center text-purple-800 mb-12">Family Moments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/placeholder-i47s3.png"
                  alt="Family portrait"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-900">Generations United</h4>
                  <p className="text-sm text-gray-600 mt-1">A timeless capture of our family's unity.</p>
                </div>
              </Card>
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/zimbabwean-ceremony.png"
                  alt="Traditional ceremony"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-900">Celebrating Our Roots</h4>
                  <p className="text-sm text-gray-600 mt-1">Moments from a traditional clan gathering.</p>
                </div>
              </Card>
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/modern-family-outdoor-gathering.png"
                  alt="Modern family gathering"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-900">New Beginnings</h4>
                  <p className="text-sm text-gray-600 mt-1">The younger generation carrying the legacy forward.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Google Maps Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-center text-purple-800 mb-12">Our Ancestral Home</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 text-lg leading-relaxed">
                <p className="mb-4">
                  The heart of the Madzvamutse clan lies in **Wedza**, a vibrant district in **Mashonaland East, Zimbabwe**. This land holds countless memories, stories, and the very essence of our heritage. It's where our roots run deepest, and where many of our family traditions continue to thrive.
                </p>
                <p>
                  We invite you to visualize our ancestral home on the map below.
                </p>
                <div className="flex items-center space-x-2 mt-4 text-purple-700 font-medium">
                  <MapPin className="w-5 h-5" />
                  <span>Wedza, Mashonaland East, Zimbabwe</span>
                </div>
              </div>
              <div className="md:w-1/2 w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-xl border-2 border-purple-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15200.000000000002!2d31.599999999999998!3d-18.333333333333332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1932111111111111%3A0x1111111111111111!2sWedza%2C%20Zimbabwe!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map of Wedza, Zimbabwe"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-16 bg-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl font-bold text-purple-800 mb-12">Connect With Us</h3>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              We'd love to hear from you! Whether you have questions about the family history, want to share information, or simply connect, feel free to reach out.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <div className="flex items-center space-x-3 text-lg">
                <Mail className="w-6 h-6 text-purple-700" />
                <a href="mailto:info@madzvamutseclan.com" className="text-purple-800 hover:underline">
                  info@madzvamutseclan.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-lg">
                <Phone className="w-6 h-6 text-purple-700" />
                <a href="tel:+263771234567" className="text-purple-800 hover:underline">
                  +263 771 234 567
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Madzvamutse Clan. All rights reserved.</p>
          <p className="mt-2">Built with pride and heritage.</p>
        </div>
      </footer>
    </div>
  )
}
