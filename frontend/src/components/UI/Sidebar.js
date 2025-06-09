import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <header className="sm:hidden bg-[#FDF8F3] p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <button
          onClick={toggleMobileMenu}
          className="text-black focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <Link to="/" className="text-black text-2xl font-bold">
          Athena
        </Link>
      </header>

      <div
        className={`fixed top-0 left-0 h-full bg-[#FDF8F3] shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          w-48 p-6
          sm:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        onClick={() => setMobileMenuOpen(false)}
      >
        <nav className="flex flex-col space-y-6 mt-10">
          <Link to="/" className="text-black text-lg font-semibold hover:underline" onClick={() => setMobileMenuOpen(false)}>
            Tool
          </Link>
          <Link to="/about" className="text-black text-lg font-semibold hover:underline" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
        </nav>
      </div>

      <aside
        className={`hidden sm:flex flex-col min-h-screen bg-[#FDF8F3] shadow-md p-6 transition-all duration-300 ease-in-out text-black`}
        style={{ width: collapsed ? '60px' : '160px' }}
      >
        <button
          onClick={toggleCollapse}
          className="mb-6 text-black focus:outline-none self-end"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src="/logo.svg" alt="image" className="h-6 w-6 mr-4"/>
          ) : (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img src="/logo.svg" alt="image" className="h-6 w-6"/>
          )}
        </button>

          {!collapsed && (
          <Link to="/" className="text-2xl font-bold text-primary mb-10 whitespace-nowrap">
            Athena
          </Link>
        )}

        <nav className="flex flex-col space-y-4 text-sm">
          <Link to="/" className="hover:underline whitespace-nowrap" title="Tool">
            {!collapsed ? 'Tool' : 'T'}
          </Link>
          <Link to="/about" className="hover:underline whitespace-nowrap" title="About">
            {!collapsed ? 'About' : 'A'}
          </Link>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
