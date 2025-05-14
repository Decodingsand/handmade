
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="ceramics-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ceramic-secondary">CeramicSpace</h3>
            <p className="text-gray-600 text-sm">
              Connecting ceramic artists with art lovers around the world. Discover unique handmade pieces crafted with passion.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Browse All
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Kitchen" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Kitchen
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Home" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Home Decor
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Garden" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Garden
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/sellers" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Artisans
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-ceramic-secondary text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Stay Connected</h4>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for product updates, artisan spotlights, and exclusive offers.
            </p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-ceramic-accent text-sm"
              />
              <button className="bg-ceramic-secondary text-white px-4 py-2 rounded-r-md text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} CeramicSpace. All rights reserved. This is a demo site created as a proof-of-concept.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
