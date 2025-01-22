import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse, faBoxesStacked,
    faMoneyCheckDollar, faListCheck, faUsers, faGifts,
    faFileSignature, faGear
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import Image from "next/image";
import avatar from 'public/images/avatar.png';

export default function SidebarShrunk({initialUser}) {
    return (
        <nav
            id="shrunk-sidebar"
            className="max-lg:fixed max-lg:hidden transition-all duration-500 shrink-0 z-[100]"
        >
            <div className="bg-green shadow-default h-screen fixed top-0 left-0 overflow-auto overflow-x-hidden z-[99] w-12 max-lg:w-0 max-lg:invisible transition-all duration-500">
                <div className="bg-white flex items-center p-2 sticky top-0 min-h-[64px] z-[100]" />
                <div className="py-4 px-[2px]">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/main/dashboard"
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default p-[13px] transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faHouse} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/main/inventory"
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default p-[13px] transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faBoxesStacked} />
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/main/orders"
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default p-[13px] transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faMoneyCheckDollar} />
                            </Link>
                        </li>
                        <li className="group">
                            <div
                                className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default p-[13px] transition-all duration-300"
                            >
                                <FontAwesomeIcon icon={faListCheck} />
                            </div>
                            <ul className="group-hover:pointer-events-auto group-hover:opacity-100 overflow-hidden transition-opacity duration-200 ease-in-out fixed opacity-0 pointer-events-none top-[235px] left-[45px] p-[2px] rounded-default bg-white shadow-default">
                                <li>
                                    <Link
                                        href="/main/troop/troopers"
                                        className="text-black text-sm block hover:bg-green-light rounded-default px-3 py-2 transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faUsers} />
                                        Troopers
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/main/troop/rewards"
                                        className="text-black text-sm block hover:bg-green-light rounded-default px-3 py-2 transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faGifts} />
                                        Rewards
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div className="fixed bottom-6 w-[44px]">
                        <hr className="border-black my-6" />
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/main/user/settings"
                                    className="text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default p-[13px] transition-all duration-300"
                                >
                                    <FontAwesomeIcon icon={faGear} />
                                </Link>
                            </li>
                        </ul>
                        <Link href="/main/user/account" className="mt-2 py-1 flex items-center justify-center cursor-pointer hover:bg-green-light rounded-default transition-all duration-300">
                            <Image
                                src={avatar}
                                alt="Profile picture"
                                className="w-9 h-9 rounded-full border-2 border-black shrink-0"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}