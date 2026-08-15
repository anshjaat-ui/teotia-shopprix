import { Link } from 'react-router-dom'

const SOCIAL = {
  facebook: 'https://facebook.com/teotiashopprix',
  twitter: 'https://twitter.com/teotiashopprix',
  instagram: 'https://instagram.com/teotiashopprix',
}

export default function Footer() {
  return (
    <footer className="bg-[#481F72] text-white mt-8 font-sans border-t border-white/15">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-[#351652] hover:bg-[#481F72] py-3 text-sm text-[#FEA3B6]"
      >
        Back to top
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 text-sm">
        <div>
          <h4 className="font-bold text-[#FEA3B6] mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-white/75">
            <li><Link to="/about" className="hover:text-[#FEA3B6]">About Teotia Shopprix</Link></li>
            <li><Link to="/careers" className="hover:text-[#FEA3B6]">Careers</Link></li>
            <li><Link to="/press" className="hover:text-[#FEA3B6]">Press Releases</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#FEA3B6] mb-3">Connect with Us</h4>
          <ul className="space-y-2 text-white/75">
            <li><a href={SOCIAL.facebook} target="_blank" rel="noreferrer" className="hover:text-[#FEA3B6]">Facebook</a></li>
            <li><a href={SOCIAL.twitter} target="_blank" rel="noreferrer" className="hover:text-[#FEA3B6]">Twitter</a></li>
            <li><a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="hover:text-[#FEA3B6]">Instagram</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#FEA3B6] mb-3">Make Money with Us</h4>
          <ul className="space-y-2 text-white/75">
            <li><Link to="/sell-with-us" className="hover:text-[#FEA3B6]">Sell on Teotia Shopprix</Link></li>
            <li><Link to="/affiliate" className="hover:text-[#FEA3B6]">Become an Affiliate</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#FEA3B6] mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-white/75">
            <li><Link to="/contact" className="hover:text-[#FEA3B6]">Contact Us</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-[#FEA3B6]">Shipping Policy</Link></li>
            <li><Link to="/refund-policy" className="hover:text-[#FEA3B6]">Returns & Refunds</Link></li>
            <li><Link to="/terms" className="hover:text-[#FEA3B6]">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-[#FEA3B6]">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-xs text-white/60 py-4">
        © {new Date().getFullYear()} Teotia Shopprix. All rights reserved.
      </div>
    </footer>
  )
}
