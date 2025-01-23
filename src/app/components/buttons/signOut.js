'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { signOut } from "@/app/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "../toasts/toast-holder";

export default function SignOut({ }) {
    const router = useRouter();
    const { showToast } = useToast();

    const handleSignOut = async (event) => {
        event.preventDefault();

        try {
            await signOut();
            router.push('/login/signIn');
        } catch (error) {
            showToast("Error Signing Out", error, true, true, 5);
        }
    };

    return (
        <li>
            <button type="button" onClick={handleSignOut}
                className="w-full text-black text-lg flex items-center cursor-pointer hover:bg-green-light rounded-default px-3 py-2.5 transition-all duration-300"
            >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Sign Out
            </button>
        </li>
    );
}