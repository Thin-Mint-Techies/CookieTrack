import { Lilita_One } from "next/font/google";
import "../globals.css";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
config.autoAddCss = false;

import Sidebar from "../components/nav/sidebar";
import SidebarShrunk from "../components/nav/sidebar-shrunk";
import { ToastProvider } from "../components/toasts/toast-holder";
import { getAuthenticatedAppForUser } from "../lib/firebase/serverApp";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "CookieTrack",
  description: "A web app used to track, manage, and stay up to date with the latest orders, rewards, and inventory of Girl Scout cookie troops."
}

const lilitaSans = Lilita_One({
  weight: '400',
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <html lang="en">
      <body className={`${lilitaSans.className} antialiased bg-main-bg bg-repeat`}>
        <ToastProvider>
          <div className="relative h-full min-h-screen font-sans bg-white-overlay">
            <div className="flex items-start">
              <Sidebar initialUser={currentUser?.toJSON()}></Sidebar>
              <SidebarShrunk initialUser={currentUser?.toJSON()}></SidebarShrunk>
              <button
                id="open-sidebar"
                className="max-lg:-left-[7px] max-lg:pr-[1px] max-lg:bg-white max-lg:shadow-default ml-auto fixed top-[20px] left-[7px] z-[100] hover:bg-off-white p-2 rounded-default transition-all duration-300"
              >
                <FontAwesomeIcon icon={faBarsStaggered} className="max-lg:text-lg text-xl text-black" />
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