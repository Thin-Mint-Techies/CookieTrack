import { Lilita_One } from "next/font/google";
import "../globals.css";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { ToastProvider } from "../components/toasts/toast-holder";
import Header from "../components/nav/header";
import Footer from "../components/nav/footer";

export const metadata = {
  title: "CookieTrack | Login",
  description: "A web app used to track, manage, and stay up to date with the latest orders, rewards, and inventory of Girl Scout cookie troops."
}

const lilitaSans = Lilita_One({
  weight: '400',
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lilitaSans.className} antialiased bg-main-bg bg-repeat`}>
        <ToastProvider>
          <Header></Header>
            {children}
          <Footer></Footer>
        </ToastProvider>
      </body>
    </html>
  );
}