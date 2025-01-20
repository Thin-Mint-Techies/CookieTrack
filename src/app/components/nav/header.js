'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRightToBracket, faUserPlus, faKey, faBars } from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import Image from "next/image";
import mainLogo from 'public/images/cookietrack_logo.png';
import { useEffect } from 'react';

export default function Header() {
    useEffect(() => {
        //Mobile hamburger menu
        var toggleOpen = document.getElementById('toggleOpen');
        var toggleClose = document.getElementById('toggleClose');
        var collapseMenu = document.getElementById('collapseMenu');

        function handleClick() {
            if (collapseMenu.style.display === 'block') {
                collapseMenu.style.display = 'none';
            } else {
                collapseMenu.style.display = 'block';
            }
        }

        toggleOpen.addEventListener('click', handleClick);
        toggleClose.addEventListener('click', handleClick);

        // Cleanup event listeners on unmount
        return () => {
            toggleOpen?.removeEventListener('click', () => { });
            toggleClose?.removeEventListener('click', () => { });
        };
    }, []);

    return (
        <header
            className='flex shadow-default py-4 px-4 sm:px-10 bg-white font-sans min-h-[80px] tracking-wide z-50 sticky top-0 rounded-default'>
            <div className='flex flex-wrap items-center gap-5 w-full'>
                <Link href="./signIn"><Image src={mainLogo} alt="logo"
                    className='w-40 max-lg:mr-5 accent-green' />
                </Link>

                <div id="collapseMenu"
                    className='max-lg:hidden lg:!flex lg:ml-auto max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
                    <button id="toggleClose"
                        className='lg:hidden fixed top-2 right-4 z-[100] rounded-default bg-white p-3 accent-green'>
                        <FontAwesomeIcon icon={faXmark} className="text-3xl text-black"></FontAwesomeIcon>
                    </button>

                    <ul
                        className='lg:flex gap-4 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-default max-lg:overflow-auto z-50'>
                        <li className='mb-6 hidden max-lg:block'>
                            <Link href="./signIn"><Image src={mainLogo} alt="logo"
                                className='w-40 accent-green' />
                            </Link>
                        </li>
                        <li className='max-lg:border-b max-lg:py-3 px-3'><Link href='./signIn'
                            className='hover:text-green-light text-black block text-[18px] accent-green'>
                                <FontAwesomeIcon icon={faRightToBracket}></FontAwesomeIcon> Sign In</Link>
                        </li>
                        <li className='max-lg:border-b max-lg:py-3 px-3'><Link href='./signUp'
                            className='hover:text-green text-black block text-[18px] accent-green'>
                                <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon> Create Account</Link>
                        </li>
                        <li className='max-lg:border-b max-lg:py-3 px-3'><Link href='./forgotPass'
                            className='hover:text-green text-black block text-[18px] accent-green'>
                                <FontAwesomeIcon icon={faKey}></FontAwesomeIcon> Forgot Password</Link>
                        </li>
                    </ul>
                </div>

                <div className='flex items-center max-lg:ml-auto space-x-6'>
                    <button id="toggleOpen" className='lg:hidden accent-green'>
                        <FontAwesomeIcon icon={faBars} className="text-2xl text-black"></FontAwesomeIcon>
                    </button>
                </div>
            </div>
        </header>
    );
}