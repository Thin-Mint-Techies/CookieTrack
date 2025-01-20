import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Form from 'next/form';

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
                                    <FontAwesomeIcon icon={faUser} className="w-[18px] h-[18px] absolute right-4"/>
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
                            <button
                                type="button"
                                id="login-google"
                                className="w-full px-5 py-2.5 flex items-center justify-center rounded-default text-black text-base tracking-wider border border-gray bg-white hover:bg-off-white accent-green"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22px"
                                    fill="#fff"
                                    className="inline shrink-0 mr-4"
                                    viewBox="0 0 512 512"
                                >
                                    <path
                                        fill="#fbbd00"
                                        d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                                        data-original="#fbbd00"
                                    />
                                    <path
                                        fill="#0f9d58"
                                        d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                                        data-original="#0f9d58"
                                    />
                                    <path
                                        fill="#31aa52"
                                        d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                                        data-original="#31aa52"
                                    />
                                    <path
                                        fill="#3c79e6"
                                        d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                                        data-original="#3c79e6"
                                    />
                                    <path
                                        fill="#cf2d48"
                                        d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                                        data-original="#cf2d48"
                                    />
                                    <path
                                        fill="#eb4132"
                                        d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                                        data-original="#eb4132"
                                    />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}