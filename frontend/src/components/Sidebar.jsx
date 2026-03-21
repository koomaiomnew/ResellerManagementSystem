import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Resellers', path: '/admin/resellers' },
    { name: 'Orders', path: '/admin/orders' },
  ];

  const resellerLinks = [
    { name: 'Dashboard', path: '/reseller/dashboard' },
    { name: 'Catalog', path: '/reseller/catalog' },
    { name: 'My Products', path: '/reseller/my-products' },
    { name: 'Orders', path: '/reseller/orders' },
    { name: 'Wallet', path: '/reseller/wallet' },
  ];

  const links = role === 'ADMIN' ? adminLinks : resellerLinks;

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col pt-4">
      <div className="px-6 mb-8 text-white">
        <h2 className="text-xl font-bold tracking-wider">RMS {role}</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
