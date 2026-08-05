import { Link } from 'react-router-dom'

const SOCIAL = {
  facebook: 'https://facebook.com/teotiashopprix',
  twitter: 'https://twitter.com/teotiashopprix',
  instagram: 'https://instagram.com/teotiashopprix',
}

export default function Footer() {
  return (
    <footer className="bg-luxe-panel text-white mt-8 font-sans border-t border-gold/20">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-luxe-bg hover:bg-black py-3 text-sm text-gold"
      >
        Back to top
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 text-sm">
        <div>
          <h4 className="font-bold text-gold mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/about" className="hover:text-gold">About Teotia Shopprix</Link></li>
            <li><Link to="/careers" className="hover:text-gold">Careers</Link></li>
            <li><Link to="/press" className="hover:text-gold">Press Releases</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gold mb-3">Connect with Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">Facebook</a></li>
            <li><a href={SOCIAL.twitter} target="_blank" rel="noreferrer" className="hover:text-gold">Twitter</a></li>
            <li><a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gold mb-3">Make Money with Us</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/sell-with-us" className="hover:text-gold">Sell on Teotia Shopprix</Link></li>
            <li><Link to="/affiliate" className="hover:text-gold">Become an Affiliate</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gold mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-gold">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-gold">Returns & Refunds</Link></li>
            <li><Link to="/terms" className="hover:text-gold">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/10 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Teotia Shopprix. All rights reserved.
      </div>
    </footer>
  )
}
