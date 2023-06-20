import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className=" h-screen w-screen">
      <Head />
      <body className="h-screen w-screen bg-primary text-primary-foreground ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
