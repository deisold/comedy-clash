// components/Footer.tsx

export default function Footer() {
    return (
      <footer className="mt-auto bg-gray-900 text-white py-6 mt-8 text-center w-full">
        <div className="max-w-7xl mx-auto px-4 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm">© {new Date().getFullYear()} Comedy Clash. All rights reserved.</p>
          <ul className="flex justify-center space-x-6 mt-4 md:mt-0">
            <li><a href="/privacy" className="hover:text-gray-400">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-gray-400">Terms of Service</a></li>
            <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
          </ul>
        </div>
      </footer>
    );
  }
