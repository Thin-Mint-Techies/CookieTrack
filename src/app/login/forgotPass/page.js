import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Form from 'next/form';

export default function ForgotPassword() {
    return (
        <div className="font-sans flex items-center min-h-[calc(100vh-158px)] p-4">
            <div className="w-full max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 bg-white shadow-default w-full sm:p-8 p-6 rounded-default relative">
                    <div>
                        <div className="mb-10">
                            <h3 className="text-green text-3xl">Forgot Your Password?</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-orange" />
                                <h4 className="text-black text-lg">
                                    Enter the email address associated with your account.
                                </h4>
                            </div>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-orange" />
                                <h4 className="text-black text-lg">
                                    Check your email inbox for a link to reset your password.
                                </h4>
                            </div>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-orange" />
                                <h4 className="text-black text-lg">
                                    Change your password and sign back in!
                                </h4>
                            </div>
                        </div>
                    </div>
                    <Form className="md:max-w-sm w-full mx-auto">
                        <div className="mb-8">
                            <h3 className="text-green text-3xl">Reset Your Password</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div>
                                    <label className="text-black text-lg mb-2 block">
                                        Email Address
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            id="forgot-pass-email"
                                            name="email"
                                            type="email"
                                            required=""
                                            className="w-full text-base text-black border border-gray px-4 py-3 rounded-default accent-green"
                                            placeholder="E.g. cookies@gmail.com "
                                        />
                                        <FontAwesomeIcon icon={faEnvelope} className="w-[18px] h-[18px] absolute right-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button
                                id="reset-password"
                                type="button"
                                className="w-full py-3 px-6 text-xl tracking-wide rounded-default bg-green hover:bg-green-light text-white accent-orange"
                            >
                                Reset Password
                            </button>
                        </div>
                        <p className="text-base text-black mt-6 text-center">
                            Dont have an account?{" "}
                            <Link
                                href="./signUp"
                                className="text-green hover:underline ml-1 accent-orange"
                            >
                                Create one here
                            </Link>
                        </p>
                    </Form>
                    <div className="divider absolute left-0 right-0 mx-auto w-1 h-full border-l border-black max-md:hidden"></div>
                </div>
            </div>
        </div>

    );
}