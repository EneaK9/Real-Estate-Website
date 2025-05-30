import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
		domains: ["example.com", "via.placeholder.com", "amazonaws.com"],
	},
};

export default nextConfig;
