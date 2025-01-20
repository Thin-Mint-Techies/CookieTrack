import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-green text-white py-6 px-16 font-sans tracking-wide">
            <div className="flex justify-between items-center max-lg:flex-col text-center flex-wrap gap-4">
                <p className="text-[15px] leading-loose">CookieTrack</p>

                <ul className="flex space-x-6 gap-y-2 max-lg:justify-center flex-wrap">
                    <li>
                        <Link href="./terms" className="text-[15px] hover:text-off-white accent-orange">Terms of Service</Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
}