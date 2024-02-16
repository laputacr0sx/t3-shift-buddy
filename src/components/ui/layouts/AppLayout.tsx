import Navbar from '~/components/ui/layouts/Navbar';
import { type ReactNode } from 'react';

interface PropType {
    children: ReactNode;
}

export default function Layout({ children }: Readonly<PropType>) {
    return (
        <main className="relative flex min-h-[calc(100%+3.5rem)] w-screen flex-col items-center justify-center px-4 pb-14 xs:min-h-fit xs:pb-0">
            {/* min-w-full  min-h-fit*/}
            {children}
            <Navbar />
        </main>
    );
}
