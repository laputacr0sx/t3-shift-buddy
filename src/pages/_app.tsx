import { ClerkProvider } from '@clerk/nextjs';

import { type AppProps } from 'next/app';
import { api } from '~/utils/api';
import '~/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '~/components/ui/theme-provider';
import { type NextPage } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Head from 'next/head';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NavigationBar } from '~/components/NavigationBar';

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    return (
        <ClerkProvider {...pageProps}>
            <Head>
                <title>出更易</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="image/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="image/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="image/favicon-16x16.png"
                />
                <link rel="manifest" href="image/site.webmanifest" />
                <desc></desc>
            </Head>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Toaster />
                <ReactQueryDevtools />
                <NavigationBar />
                <Component {...pageProps} />
            </ThemeProvider>
            <Analytics />
            <SpeedInsights />
        </ClerkProvider>
    );
};

export default api.withTRPC(MyApp);
