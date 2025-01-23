'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Form from 'next/form';
import GoogleSignIn from '@/components/buttons/google';
import { signInWithEmail } from '@/app/lib/firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/toasts/toast-holder';

export default function SignIn() {
    const router = useRouter();
    const showToast = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleEmailSignIn = async (email, password) => {
        try {
            await signInWithEmail(email, password, rememberMe);
            router.push("/main/dashboard");
        } catch (error) {
            showToast("Error Signing In", error, true, true, 5);
        }
    };

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
                                    <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full text-base text-black border border-gray px-4 py-3 rounded-default accent-green"
                                        placeholder="E.g. cookies@gmail.com " />
                                    <FontAwesomeIcon icon={faEnvelope} className="w-[18px] h-[18px] absolute right-4"></FontAwesomeIcon>
                                </div>
                            </div>
                            <div>
                                <label className="text-black text-lg mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full text-base text-black border border-gray px-4 py-3 rounded-default accent-green"
                                        placeholder="**********" />
                                    <FontAwesomeIcon icon={faLock} className="w-[18px] h-[18px] absolute right-4"></FontAwesomeIcon>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center cursor-pointer">
                                    <input name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
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
                                <button type="button" onClick={handleEmailSignIn}
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