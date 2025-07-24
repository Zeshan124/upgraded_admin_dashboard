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
    outputFileTracing: true, // Enable better file tracing
  },

  // Output configuration to prevent service files from being treated as serverless functions
  output: 'standalone',

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

    // Server-side configuration to exclude service files from being treated as API routes
    if (isServer) {
      // Add webpack rule to ignore service files in root api/ directory
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      
      // Ignore all service files in root api/ directory
      config.module.rules.push({
        test: /^(?!.*pages\/api).*\/api\/.*Service\.js$/,
        use: 'ignore-loader'
      });

      // Also ignore axiosInstance files
      config.module.rules.push({
        test: /\/api\/axiosInstance\.js$/,
        use: 'ignore-loader'
      });
    }

    // Better module resolution
    config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

    // Disable caching for problematic modules during development
    if (dev) {
      config.cache = false;
    }

    // Ignore service files in the build process for serverless function detection
    config.ignoreWarnings = [
      /.*Service\.js/,
      /axiosInstance\.js/
    ];

    return config;
  },

  // Serverless function configuration
  serverRuntimeConfig: {
    // Only these should be treated as serverless functions
    apiRoutes: [
      '/api/analytics',
      '/api/login', 
      '/api/sendNotification'
    ]
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

  // Additional configuration to prevent false serverless function detection
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Exclude patterns that should not be treated as API routes
  excludeDefaultMomentLocales: true,
};

module.exports = nextConfig;