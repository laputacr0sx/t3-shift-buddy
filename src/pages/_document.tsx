import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="">
      <Head />
      <body className="bg-primary text-primary-foreground">
        {/* <body className="w-screen bg-primary text-primary-foreground"> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
