// components/Header.tsx
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to the Comedy Clash</h1>
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:text-gray-400">Home</Link></li>
          <li><Link href="/about" className="hover:text-gray-400">About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;