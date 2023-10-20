import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-screen w-screen ">
      <Head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/public/images/favicon.ico"
        />
        <link rel="shortcut icon" href="/public/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/public/images/favicon.ico"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/public/images/favicon.ico"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/public/images/favicon.ico"
        />
      </Head>
      <body className="bg-background text-primary-foreground">
        {/* <body className="w-screen bg-primary text-primary-foreground"> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
