/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    title: "QistBazaar",
    titleDescription: "Admin Template",
  },

  // Transpile packages - use CommonJS modules to avoid ES module issues
  transpilePackages: [
    "antd",
    "rc-util",
    "rc-picker",
    "rc-select",
    "rc-table",
    "rc-tree",
    "@ant-design/icons",
  ],

  // Enhanced experimental settings
  experimental: {
    esmExternals: false, // Keep false for better compatibility
  },

  // Enhanced webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Fix module resolution for both client and server
    config.resolve.alias = {
      ...config.resolve.alias,
      // Force use of lib versions instead of es modules
      "antd/es": "antd/lib",
      "rc-picker/es": "rc-picker/lib",
      "rc-util/es": "rc-util/lib",
      "@ant-design/icons/es": "@ant-design/icons/lib",
    };

    // Client-side fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Better module resolution
    config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

    // Disable caching for problematic modules during development
    if (dev) {
      config.cache = false;
    }

    return config;
  },

  // Image configuration
  images: {
    domains: [],
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },

  // SCSS configuration
  sassOptions: {
    includePaths: ["./styles"],
  },

  // Disable strict mode temporarily to avoid double rendering issues
  reactStrictMode: false,
};

module.exports = nextConfig;