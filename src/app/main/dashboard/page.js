import Image from "next/image";
import monthlyCookie from 'public/images/monthly_cookie.jpg';

export default function Dashboard() {
    return (
        <div className="mt-12 mb-6 px-2">
            <div className="bg-green relative z-0 max-w-[100rem] shadow-default mx-auto rounded-default overflow-hidden mb-8">
                <div className="grid sm:grid-cols-2 max-sm:gap-6">
                    <div className="text-center p-6 flex flex-col justify-center items-center">
                        <h3 className="font-extrabold text-5xl text-white leading-tight">
                            Monthly Cookie
                        </h3>
                        <h6 className="text-lg text-white mt-4">
                            Predicted best selling cookies this month...
                        </h6>
                        <h6 className="text-3xl text-white mt-4 underline decoration-wavy decoration-orange decoration-2">
                            Thin Mints
                        </h6>
                    </div>
                    <div className="flex justify-end max-sm:justify-center items-center p-2 bg-gradient-to-b from-orange to-orange-light rounded-bl-[230px] max-sm:rounded-bl-none w-full h-full">
                        <div className="h-72 w-72 rounded-full bg-gradient-to-tr from-orange to-orange-light p-5">
                            <Image
                                src={monthlyCookie}
                                className="w-full h-full rounded-full object-contain border-8 border-white bg-white"
                                alt="Monthly Cookie"
                            />
                        </div>
                    </div>
                </div>
                <div className="absolute -top-[50px] -left-[50px] w-28 h-28 rounded-full bg-orange opacity-40 shadow-lg" />
                <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-orange opacity-40 shadow-lg" />
            </div>
            <div className="bg-white px-4 py-12 rounded-default shadow-default max-w-[100rem] m-auto">
                <div className="max-sm:max-w-sm mx-auto">
                    <h2 className="text-green text-4xl max-sm:text-2xl font-extrabold mb-8">
                        <i className="fa-solid fa-chart-line" />
                        Current Statistics
                    </h2>
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5">
                        <div className="bg-white rounded-default border shadow-default px-7 py-8">
                            <p className="text-black text-base font-semibold mb-1">
                                Revenue this Month
                            </p>
                            <h3 className="text-green text-3xl font-extrabold">$400+</h3>
                        </div>
                        <div className="bg-white rounded-default border shadow-default px-7 py-8">
                            <p className="text-black text-base font-semibold mb-1">
                                Boxes Sold this Month
                            </p>
                            <h3 className="text-green text-3xl font-extrabold">57</h3>
                        </div>
                        <div className="bg-white rounded-default border shadow-default px-7 py-8">
                            <p className="text-black text-base font-semibold mb-1">
                                Current Inventory
                            </p>
                            <h3 className="text-green text-3xl font-extrabold">343</h3>
                        </div>
                        <div className="bg-white rounded-default border shadow-default px-7 py-8">
                            <p className="text-black text-base font-semibold mb-1">
                                Hottest Seller
                            </p>
                            <h3 className="text-green text-3xl font-extrabold">Thin Mints</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}