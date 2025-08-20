const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: isProd ? '/coleen_pl' : '',
  assetPrefix: isProd ? '/coleen_pl/' : '',
  images: {
    unoptimized: true,
  },
  webpack: config => {
    config.module.rules.push(
      {
        test: /\.mdx/,
        type: "asset/source",
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      }
    );

    return config;
  },
};

module.exports = nextConfig;
