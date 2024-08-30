import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Github } from "lucide-react"

export const Footer = () => {
  return (
    <div className="mt-8">
      <footer className="bg-main text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-white text-lg font-semibold mb-4">Exchange</h2>
              <p className="text-sm">Your trusted platform for cryptocurrency exchange. Fast, secure, and reliable.</p>
            </div>
            <div>
              <h3 className="text-white text-md font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Buy Crypto</Link></li>
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Sell Crypto</Link></li>
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Market Data</Link></li>
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Trading View</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-md font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-md font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="https://github.com/Official-Krish" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">Github</span>
                </Link>
              </div>
              <div className="space-y-2">
                <p className="text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@Exchange.com
                </p>
                <p className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Exchange. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}