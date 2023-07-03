import React from "react";

import Link from "next/link";

export default function Custom404() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-sky-950">
      <h1 className="text-9xl font-extrabold tracking-widest text-slate-200">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-red-700 px-2 text-sm">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          className={
            "group relative inline-block text-sm font-medium text-red-700 focus:outline-none focus:ring active:text-orange-500"
          }
          href={"/"}
        >
          <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-red-700 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
          <span className="relative block border border-current bg-sky-950 px-8 py-3">
            Go Home
          </span>
        </Link>
      </button>
    </main>
  );
}
