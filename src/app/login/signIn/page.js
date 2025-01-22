import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Form from 'next/form';
import GoogleSignIn from '@/components/buttons/google';

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

                            <GoogleSignIn/>

                            <p className="text-lg !mt-8 text-center text-black">Don't have an account? <Link href="./signUp"
                                className="text-green hover:underline ml-1 whitespace-nowrap accent-orange">Register here</Link></p>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}