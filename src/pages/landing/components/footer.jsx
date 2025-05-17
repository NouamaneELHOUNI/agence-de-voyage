import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Al-Safar Hajj & Umrah</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Your trusted partner for Hajj and Umrah journeys since 2005. We provide comprehensive services to make
              your pilgrimage comfortable and meaningful.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-muted-foreground hover:text-primary">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/services/hajj" className="text-muted-foreground hover:text-primary">
                  Hajj Packages
                </Link>
              </li>
              <li>
                <Link to="/services/umrah" className="text-muted-foreground hover:text-primary">
                  Umrah Packages
                </Link>
              </li>
              <li>
                <Link to="/services/visa" className="text-muted-foreground hover:text-primary">
                  Visa Processing
                </Link>
              </li>
              <li>
                <Link to="/services/accommodation" className="text-muted-foreground hover:text-primary">
                  Accommodation
                </Link>
              </li>
              <li>
                <Link to="/services/transportation" className="text-muted-foreground hover:text-primary">
                  Transportation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground">
              <p>123 Pilgrim Street</p>
              <p>London, UK, EC1A 1AA</p>
              <p className="mt-4">Email: info@alsafar.com</p>
              <p>Phone: +44 20 1234 5678</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Al-Safar Hajj & Umrah Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
