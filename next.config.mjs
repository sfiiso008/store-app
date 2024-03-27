/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			'images.unsplash.com',
			'i.imgur.com',
			'sfiso-mbonane-memories-app.s3.amazonaws.com',
		],
	},
};

export default nextConfig;
