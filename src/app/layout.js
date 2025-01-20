import { Lilita_One } from "next/font/google";
import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
config.autoAddCss = false;

import Sidebar from "./components/nav/sidebar";
import SidebarShrunk from "./components/nav/sidebar-shrunk";
import { ToastProvider } from "./components/toasts/toast-holder";

const lilitaSans = Lilita_One({
  weight: '400',
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lilitaSans.className} antialiased bg-main-bg bg-repeat`}>
        <ToastProvider>
        <div className="relative h-full min-h-screen font-sans bg-white-overlay">
          <div className="flex items-start">
            <Sidebar></Sidebar>
            <SidebarShrunk></SidebarShrunk>
            <button
              id="open-sidebar"
              className="ml-auto fixed top-[20px] left-[7px] z-[100] hover:bg-off-white p-2 rounded-default transition-all duration-300"
            >
              <FontAwesomeIcon icon={faBarsStaggered} className="text-xl text-black" />
            </button>
            <section className="main-content w-full p-6">
              <div>
                <div className="flex items-center flex-wrap gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green">
                      Welcome back, John
                    </h3>
                    <p className="text-xs text-gray-300">
                      Streamlined dashboard layout featuring a welcoming header for user
                      personalization.
                    </p>
                  </div>
                </div>
              </div>

              {children}
            </section>
          </div>
        </div>
        </ToastProvider>
      </body>
    </html>
  );
}