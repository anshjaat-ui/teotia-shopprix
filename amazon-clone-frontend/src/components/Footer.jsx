export default function Footer() {
  return (
    <footer className="bg-navy-light text-white mt-8 font-sans">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-navy-lighter hover:bg-navy-light/80 py-3 text-sm"
      >
        Back to top
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 text-sm">
        <div>
          <h4 className="font-bold mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">About Teotia Shopprix</li>
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Press Releases</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Connect with Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Facebook</li>
            <li className="hover:underline cursor-pointer">Twitter</li>
            <li className="hover:underline cursor-pointer">Instagram</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Make Money with Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Sell on Teotia Shopprix</li>
            <li className="hover:underline cursor-pointer">Become an Affiliate</li>
            <li className="hover:underline cursor-pointer">Advertise Your Products</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer">Your Account</li>
            <li className="hover:underline cursor-pointer">Returns Centre</li>
            <li className="hover:underline cursor-pointer">Help</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-600 text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} Teotia Shopprix. All rights reserved.
      </div>
    </footer>
  )
}
