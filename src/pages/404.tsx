import React from 'react';
import {StatusCodes, getReasonPhrase} from 'http-status-codes';

interface CustomErrorProps {
    statusCode: StatusCodes;
}

export default function Custom404({statusCode}: CustomErrorProps) {
    return (
        <main className="flex h-screen w-full flex-col items-center justify-center bg-red-950">
            <h1 className="text-9xl font-extrabold tracking-widest text-slate-200">
                {statusCode}
            </h1>
            <div className="absolute rotate-12 rounded bg-rose-700 px-2 text-xl">
                {statusCode && getReasonPhrase(statusCode)}
            </div>
            {/* <button className="mt-5"> */}
            {/*     <Link */}
            {/*         className={ */}
            {/*             'group relative inline-block text-sm font-medium text-red-700 focus:outline-none focus:ring active:text-orange-500' */}
            {/*         } */}
            {/*         href={'/'} */}
            {/*     > */}
            {/*         <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-amber-700 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span> */}
            {/*         <span className="relative block border border-current bg-rose-200 px-8 py-3"> */}
            {/*             返回調更易 */}
            {/*         </span> */}
            {/*     </Link> */}
            {/* </button> */}
            <button
                className={
                    'group relative inline-block text-sm font-medium text-red-700 focus:outline-none focus:ring active:text-orange-500'
                }
                onClick={() => {
                    function close_window() {
                        // if (confirm('關閉並返回調更易？')) {
                        // }
                        close();
                    }

                    close_window();
                    return false;
                }}
            >
                <span
                    className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-amber-700 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <span className="relative block border border-current bg-rose-200 px-8 py-3">
                    返回調更易
                </span>
            </button>
        </main>
    );
}
