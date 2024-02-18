/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    i18n: {
        locales: ['en'],
        defaultLocale: 'en'
    },

    experimental: { serverComponentsExternalPackages: ['@react-pdf/renderer'] },
    webpack: (config, options) => {
        config.resolve.fallback = {
            // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped.
            ...config.resolve.fallback,

            fs: false // the solution
        };
        return config;
    }
};
export default config;
