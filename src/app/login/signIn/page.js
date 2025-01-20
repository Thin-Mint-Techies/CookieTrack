import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Form from 'next/form';

export default function SignIn() {
    return (
        <div className="font-sans min-h-[calc(100vh-158px)]">
            <div className="min-h-[calc(100vh-158px)] flex items-center justify-center py-6 px-4">
                <div className="grid items-center gap-4 max-w-xl w-full">
                    <div className="border border-gray bg-white rounded-default p-6 max-w-full shadow-default max-md:mx-auto">
                        <Form className="space-y-4">
                            <div className="mb-8">
                                <h3 className="text-green text-4xl flex justify-center">Sign In</h3>
                                <p className="text-black text-xl mt-4 leading-relaxed flex justify-center">Welcome back to CookieTrack!</p>
                            </div>

                            <div>
                                <label className="text-black text-lg mb-2 block">Email Address</label>
                                <div className="relative flex items-center">
                                    <input id="login-email" name="email" type="email" required
                                        className="w-full text-base text-black border border-gray px-4 py-3 rounded-default accent-green"
                                        placeholder="E.g. cookies@gmail.com " />
                                    <FontAwesomeIcon icon={faEnvelope} className="w-[18px] h-[18px] absolute right-4"></FontAwesomeIcon>
                                </div>
                            </div>
                            <div>
                                <label className="text-black text-lg mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input id="login-password" name="password" type="password" required
                                        className="w-full text-base text-black border border-gray px-4 py-3 rounded-default accent-green"
                                        placeholder="**********" />
                                    <FontAwesomeIcon icon={faLock} className="w-[18px] h-[18px] absolute right-4"></FontAwesomeIcon>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center cursor-pointer">
                                    <input id="remember-me" name="remember-me" type="checkbox"
                                        className="h-4 w-4 shrink-0 text-black focus:ring-orange border rounded accent-orange cursor-pointer" />
                                    <label htmlFor="remember-me" className="ml-3 block text-base text-black cursor-pointer">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-base">
                                    <Link href="./forgotPass" className="text-green hover:underline accent-orange">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <div className="!mt-8">
                                <button id="login" type="button"
                                    className="w-full shadow-default py-3 px-4 text-xl tracking-wide rounded-default text-white bg-green hover:bg-green-light accent-orange">
                                    Log in
                                </button>
                            </div>

                            <div className="my-4 flex items-center gap-4">
                                <hr className="w-full border-gray" />
                                <p className="text-base text-black text-center">or</p>
                                <hr className="w-full border-gray" />
                            </div>

                            <button id="login-google" type="button"
                                className="w-full flex items-center justify-center gap-4 py-3 px-6 text-lg tracking-wide text-black border border-gray rounded-default bg-white hover:bg-off-white accent-green">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline" viewBox="0 0 512 512">
                                    <path fill="#fbbd00"
                                        d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                                        data-original="#fbbd00" />
                                    <path fill="#0f9d58"
                                        d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                                        data-original="#0f9d58" />
                                    <path fill="#31aa52"
                                        d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                                        data-original="#31aa52" />
                                    <path fill="#3c79e6"
                                        d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                                        data-original="#3c79e6" />
                                    <path fill="#cf2d48"
                                        d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                                        data-original="#cf2d48" />
                                    <path fill="#eb4132"
                                        d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                                        data-original="#eb4132" />
                                </svg>
                                Continue with Google
                            </button>

                            <p className="text-lg !mt-8 text-center text-black">Don't have an account? <Link href="./signUp"
                                className="text-green hover:underline ml-1 whitespace-nowrap accent-orange">Register here</Link></p>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}