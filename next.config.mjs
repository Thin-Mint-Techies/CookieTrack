/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/login/signIn",
                permanent: true, // Set to false if this is a temporary redirect
            },
        ];
    },
};

export default nextConfig;