import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Form from 'next/form';
import GoogleSignIn from '@/components/buttons/google';

export default function SignUp() {
    return (
        <div className="font-sans flex items-center min-h-[calc(100vh-158px)] p-4">
            <div className="w-full max-w-4xl max-md:max-w-xl mx-auto">
                <div className="bg-white grid md:grid-cols-2 gap-16 w-full sm:p-8 p-6 shadow-default rounded-default overflow-hidden">
                    <Form className="w-full">
                        <div className="mb-8">
                            <h3 className="text-green text-3xl">Create an Account</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-black text-base mb-2 block">
                                    First Name
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        id="create-fname"
                                        name="fname"
                                        type="text"
                                        required=""
                                        className="bg-white border border-gray w-full text-base text-black pl-4 pr-10 py-2.5 rounded-default accent-green"
                                        placeholder="Enter your first name"
                                    />
                                    <FontAwesomeIcon icon={faUser} className="w-[18px] h-[18px] absolute right-4" />
                                </div>
                            </div>
                            <div>
                                <label className="text-black text-base mb-2 block">Last Name</label>
                                <div className="relative flex items-center">
                                    <input
                                        id="create-lname"
                                        name="lname"
                                        type="text"
                                        required=""
                                        className="bg-white border border-gray w-full text-base text-black pl-4 pr-10 py-2.5 rounded-default accent-green"
                                        placeholder="Enter your last name"
                                    />
                                    <FontAwesomeIcon icon={faUser} className="w-[18px] h-[18px] absolute right-4" />
                                </div>
                            </div>
                            <div>
                                <label className="text-black text-base mb-2 block">
                                    Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        id="create-email"
                                        name="email"
                                        type="email"
                                        required=""
                                        className="bg-white border border-gray w-full text-base text-black pl-4 pr-10 py-2.5 rounded-default accent-green"
                                        placeholder="Enter your email address"
                                    />
                                    <FontAwesomeIcon icon={faEnvelope} className="w-[18px] h-[18px] absolute right-4" />
                                </div>
                            </div>
                            <div>
                                <label className="text-black text-base mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        id="create-password"
                                        name="password"
                                        type="password"
                                        required=""
                                        className="bg-white border border-gray w-full text-base text-black pl-4 pr-10 py-2.5 rounded-default accent-green"
                                        placeholder="**********"
                                    />
                                    <FontAwesomeIcon icon={faLock} className="w-[18px] h-[18px] absolute right-4" />
                                </div>
                                <p className="text-sm text-orange-light mt-2">
                                    At least 6 characters with 1 special character, 1 uppercase
                                    letter, and 1 number.
                                </p>
                            </div>
                            <div>
                                <label className="text-black text-base mb-2 block">
                                    Confirm Password
                                </label>
                                <div className="relative flex items-center">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required=""
                                        className="bg-white border border-gray w-full text-base text-black pl-4 pr-10 py-2.5 rounded-default accent-green"
                                        placeholder="**********"
                                    />
                                    <FontAwesomeIcon icon={faLock} className="w-[18px] h-[18px] absolute right-4" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="accept-terms"
                                    name="accept-terms"
                                    type="checkbox"
                                    className="h-4 w-4 shrink-0 text-black focus:ring-orange border-gray rounded accent-orange cursor-pointer"
                                    required=""
                                />
                                <label
                                    htmlFor="accept-terms"
                                    className="text-black ml-3 block text-base"
                                >
                                    I accept the{" "}
                                    <Link
                                        href="./terms"
                                        className="text-green hover:underline ml-1 accent-orange"
                                    >
                                        Terms and Conditions
                                    </Link>
                                </label>
                            </div>
                        </div>
                        <div className="!mt-8">
                            <button
                                type="button"
                                id="create-account"
                                className="w-full py-2.5 px-4 text-lg tracking-wider shadow-default rounded-default bg-green hover:bg-green-light text-white accent-orange"
                            >
                                Create Account
                            </button>
                        </div>
                        <p className="text-black text-base mt-6 text-center">
                            Already have an account?{" "}
                            <Link
                                href="./signIn"
                                className="text-green hover:underline ml-1 accent-orange"
                            >
                                Login here
                            </Link>
                        </p>
                    </Form>
                    <div className="max-md:order-1 space-y-6">
                        <div className="md:mb-16 mb-8">
                            <h3 className="text-green text-3xl">Instant Access</h3>
                        </div>
                        <div className="space-y-6">
                            <GoogleSignIn />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}