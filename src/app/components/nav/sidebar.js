'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBarsStaggered, faHouse, faBoxesStacked,faMoneyCheckDollar, 
    faListCheck, faAngleDown, faUsers, faGifts, faGear
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import Image from "next/image";
import mainLogo from 'public/images/cookietrack_logo.png';
import avatar from 'public/images/avatar.png';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseConfig } from '@/app/lib/firebase/config';

function useUserSession(initialUser) {
    // The initialUser comes from the server via a server component
    const [user, setUser] = useState(initialUser);
    const router = useRouter();

    // Register the service worker that sends auth state back to server
    // The service worker is built with npm run build-service-worker
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
            const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

            navigator.serviceWorker
                .register(serviceWorkerUrl)
                .then((registration) => console.log("scope is: ", registration.scope));
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged((authUser) => {
            setUser(authUser)
        })

        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        onAuthStateChanged((authUser) => {
            if (user === undefined) return

            // refresh when user changed to ease testing
            if (user?.email !== authUser?.email) {
                router.refresh()
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return user;
}

export default function Sidebar({ initialUser }) {
    const user = useUserSession(initialUser);

    useEffect(() => {
        // Add functionality for submenus
        document.querySelectorAll('#sidebar ul > li > div').forEach((menu) => {
            menu.addEventListener('click', () => {
                const subMenu = menu.nextElementSibling;
                if (!subMenu) return;
                const arrowIcon = menu.querySelector('.fa-angle-down');

                // Toggle submenu visibility
                if (subMenu.classList.contains('max-h-0')) {
                    subMenu.classList.remove('max-h-0');
                    subMenu.classList.add('max-h-[500px]');
                } else {
                    subMenu.classList.remove('max-h-[500px]');
                    subMenu.classList.add('max-h-0');
                }

                // Toggle arrow rotation
                arrowIcon?.classList.toggle('rotate-0');
                arrowIcon?.classList.toggle('-rotate-90');
            });
        });

        // Add functionality for sidebar toggling
        const sidebarCloseBtn = document.getElementById('close-sidebar');
        const sidebarOpenBtn = document.getElementById('open-sidebar');
        const sidebarCollapseMenu = document.getElementById('sidebar-collapse-menu');
        const sidebar = document.getElementById('sidebar');
        const shrunkSidebar = document.getElementById('shrunk-sidebar');

        sidebarOpenBtn?.addEventListener('click', () => {
            sidebarCollapseMenu.style.cssText = 'width: 270px; visibility: visible; opacity: 1;';
            sidebar.style.cssText = 'width: 270px;';
            shrunkSidebar.style.cssText = 'width: 0px;';
        });

        sidebarCloseBtn?.addEventListener('click', () => {
            sidebarCollapseMenu.style.cssText = 'width: 32px; visibility: hidden; opacity: 0;';
            sidebar.style.cssText = 'width: 32px;';
            shrunkSidebar.style.cssText = 'width: 16px;';
        });

        // Cleanup event listeners on unmount
        return () => {
            document.querySelectorAll('#sidebar ul > li > div').forEach((menu) => {
                menu.removeEventListener('click', () => { });
            });
            sidebarOpenBtn?.removeEventListener('click', () => { });
            sidebarCloseBtn?.removeEventListener('click', () => { });
        };
    }, []);

    return (
        <nav
            id="sidebar"
            className="lg:w-[270px] max-lg:fixed transition-all duration-500 shrink-0 z-[101]"
        >
            <div
                id="sidebar-collapse-menu"
                className="bg-green shadow-default h-screen fixed top-0 left-0 overflow-auto overflow-x-hidden z-[99] lg:w-[270px] max-lg:w-0 max-lg:invisible transition-all duration-500"
            >
                <div className="bg-white flex items-center gap-4 pt-6 pb-2 px-4 sticky top-0 min-h-[64px] z-[100]">
                    <Link href="/main/dashboard">
                        <Image
                            src={mainLogo}
                            alt="logo"
                            className="w-40 max-lg:mr-5 accent-green"
                        />
                    </Link>
                    <button id="close-sidebar" className="ml-auto hover:bg-off-white p-2 rounded-default transition-all duration-300">
                        <FontAwesomeIcon icon={faBarsStaggered} className="text-xl text-black" />
                    </button>
                </div>
                <div className="py-4 px-4">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/main/dashboard"
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faHouse} />
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/main/inventory"
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faBoxesStacked} />
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    Inventory
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/main/orders"
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faMoneyCheckDollar} />
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    Orders
                                </span>
                            </Link>
                        </li>
                        <li>
                            <div
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faListCheck} />
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    Manage
                                </span>
                                <FontAwesomeIcon icon={faAngleDown} className="w-2.5 h-2.5 text-sm rotate-0 ml-auto transition-all duration-500" />
                            </div>
                            <ul className="sub-menu overflow-hidden transition-[max-height] duration-500 ease-in-out ml-8">
                                <li>
                                    <Link
                                        href="/main/troop/troopers"
                                        className="text-black text-sm block hover:bg-green-light rounded-default px-3 py-2 transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>Troopers</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/main/troop/rewards"
                                        className="text-black text-sm block hover:bg-green-light rounded-default px-3 py-2 transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faGifts} />
                                        <span>Rewards</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div className="fixed bottom-6 w-[238px]">
                        <hr className="border-black my-6" />
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/main/user/settings"
                                    className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faGear} />
                                    Settings
                                </Link>
                            </li>
                        </ul>
                        <Link href="/main/user/account" className="mt-2 flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300">
                            <Image
                                src={user?.photoURL || avatar}
                                alt="Profile picture"
                                className="w-9 h-9 rounded-full border-2 border-black shrink-0"
                            />
                            <div className="ml-4">
                                <p className="text-sm text-black whitespace-nowrap">{user?.displayName || "John Doe"}</p>
                                <p className="text-xs text-black whitespace-nowrap">
                                    {user?.email || "johndoe@gmail.com"}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}