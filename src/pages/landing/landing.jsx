import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MainNav } from "./components/mainNav"
import { Footer } from "./components/footer"
import { PackageCard } from "./components/packageCard"
import { TestimonialCard } from "./components/testimonialCard"
import { ServiceCard } from "./components/serviceCard"
import { Calendar, Globe, Hotel, MapPin, Plane, Users } from "lucide-react"

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <img
              src="/placeholder.svg"
              alt="Kaaba in Mecca"
              className="h-full w-full object-cover brightness-50"
            />
          </div>
          <div className=" relative z-10 py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your Journey to Sacred Lands
              </h1>
              <p className="mt-6 text-lg leading-8">
                Experience the spiritual journey of a lifetime with our premium Hajj and Umrah packages. We take care of
                everything so you can focus on your spiritual journey.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link to="/packages">View Packages</Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-muted py-16 md:py-24">
          <div className="">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
              <p className="mt-4 text-muted-foreground">
                Comprehensive services to make your pilgrimage comfortable and meaningful
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <ServiceCard
                icon={Plane}
                title="Flight Booking"
                description="Direct flights to Saudi Arabia from major cities worldwide"
              />
              <ServiceCard
                icon={Hotel}
                title="Premium Accommodation"
                description="Comfortable stays near the holy sites for convenience"
              />
              <ServiceCard
                icon={Users}
                title="Guided Tours"
                description="Experienced scholars to guide you through the rituals"
              />
              <ServiceCard
                icon={Globe}
                title="Visa Processing"
                description="Hassle-free visa application and processing services"
              />
              <ServiceCard
                icon={MapPin}
                title="Transportation"
                description="Reliable transport between all holy sites and accommodations"
              />
              <ServiceCard
                icon={Calendar}
                title="Flexible Scheduling"
                description="Various departure dates to suit your schedule"
              />
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        <section className="py-16 md:py-24">
          <div className="">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Packages</h2>
              <p className="mt-4 text-muted-foreground">
                Select from our carefully designed packages for your spiritual journey
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <PackageCard
                title="Economy Umrah"
                price="$1,999"
                duration="10 days"
                description="Affordable package with all essentials covered for a meaningful Umrah experience"
                features={[
                  "Economy class flights",
                  "3-star hotel accommodation",
                  "Shared transportation",
                  "Basic guided tours",
                  "Visa processing",
                ]}
              />
              <PackageCard
                title="Premium Hajj"
                price="$7,999"
                duration="15 days"
                description="Complete Hajj package with premium services for a comfortable pilgrimage"
                features={[
                  "Business class flights",
                  "5-star hotel accommodation",
                  "Private transportation",
                  "Comprehensive guided tours",
                  "Visa processing",
                  "24/7 support",
                ]}
                featured={true}
              />
              <PackageCard
                title="Deluxe Umrah"
                price="$3,499"
                duration="12 days"
                description="Enhanced Umrah experience with premium accommodations and services"
                features={[
                  "Premium economy flights",
                  "4-star hotel accommodation",
                  "Private transportation",
                  "Detailed guided tours",
                  "Visa processing",
                  "Ziyarat included",
                ]}
              />
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link to="/packages">View All Packages</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted py-16 md:py-24">
          <div className="">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Pilgrims Say</h2>
              <p className="mt-4 text-muted-foreground">Hear from those who have experienced our services</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                name="Ahmed Khan"
                location="London, UK"
                quote="The entire journey was seamless. From visa processing to accommodation near the Haram, everything was perfectly arranged. Will definitely recommend Al-Safar to friends and family."
                rating={5}
              />
              <TestimonialCard
                name="Fatima Ali"
                location="Toronto, Canada"
                quote="As a first-time pilgrim, I was nervous, but the guides were knowledgeable and patient. The accommodation was comfortable and the entire experience was spiritually fulfilling."
                rating={5}
              />
              <TestimonialCard
                name="Mohammed Rahman"
                location="New York, USA"
                quote="The premium Hajj package was worth every penny. The proximity to the Haram, the quality of service, and the attention to detail made our pilgrimage truly special."
                rating={4}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="">
            <div className="rounded-xl bg-primary px-6 py-16 md:px-12 md:py-24">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                  Ready to Begin Your Spiritual Journey?
                </h2>
                <p className="mt-6 text-lg leading-8 text-primary-foreground/90">
                  Contact us today to book your Hajj or Umrah package. Our team is ready to assist you in planning your
                  sacred journey.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    asChild
                  >
                    <Link to="/packages">View Packages</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
