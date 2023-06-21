import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="w-screen overflow-hidden">
      <Head />
      <body className="w-screen bg-primary text-primary-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
