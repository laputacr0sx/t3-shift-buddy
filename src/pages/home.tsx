import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild
} from '@headlessui/react';
import {
    Bars3Icon,
    Cog6ToothIcon,
    HomeIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ModeToggle } from '~/components/ModeToggle';
import PageTitle from '~/components/PageTitle';
import SevenSlotsSearchForm from '~/components/SevenSlotsSearchForm';
import TableLoading from '~/components/TableLoading';
import { api } from '~/utils/api';

const navigation = [
    { name: '出更易', href: '/', icon: HomeIcon, current: true }
];

const externalLinks = [
    {
        id: 1,
        name: 'OKMALL',
        href: 'https://okmall.mtr.com.hk/',
        initial: 'O',
        current: false
    },
    {
        id: 2,
        name: 'ESS',
        href: 'https://okmall.mtr.com.hk/',
        initial: 'E',
        current: false
    }
];

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function HomePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        data: weekDetails,
        isLoading: weekDetailsLoading,
        error: weekDetailsError
    } = api.timetableController.getSuitableTimetables.useQuery();

    if (weekDetailsLoading) return <TableLoading />;
    if (weekDetailsError) return <>Something Went Wrong</>;

    return (
        <>
            <div>
                <Dialog
                    open={sidebarOpen}
                    onClose={setSidebarOpen}
                    className="relative z-50 lg:hidden"
                >
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                    <button
                                        type="button"
                                        onClick={() => setSidebarOpen(false)}
                                        className="-m-2.5 p-2.5"
                                    >
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>
                                        <XMarkIcon
                                            aria-hidden="true"
                                            className="h-6 w-6 text-white"
                                        />
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <Image
                                        alt="出更易"
                                        src="/image/favicon.ico"
                                        width={32}
                                        height={32}
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul
                                        role="list"
                                        className="flex flex-1 flex-col gap-y-7"
                                    >
                                        <li>
                                            <ul
                                                role="list"
                                                className="-mx-2 space-y-1"
                                            >
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-indigo-700 text-white'
                                                                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    item.current
                                                                        ? 'text-white'
                                                                        : 'text-indigo-200 group-hover:text-white',
                                                                    'h-6 w-6 shrink-0'
                                                                )}
                                                            />
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="text-xs font-semibold leading-6 text-indigo-200">
                                                External Links
                                            </div>
                                            <ul
                                                role="list"
                                                className="-mx-2 mt-2 space-y-1"
                                            >
                                                {externalLinks.map((team) => (
                                                    <li key={team.name}>
                                                        <a
                                                            href={team.href}
                                                            className={classNames(
                                                                team.current
                                                                    ? 'bg-indigo-700 text-white'
                                                                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                                            )}
                                                        >
                                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                                                {team.initial}
                                                            </span>
                                                            <span className="truncate">
                                                                {team.name}
                                                            </span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        {/* <li className="mt-auto"> */}
                                        {/*     <a */}
                                        {/*         href="#" */}
                                        {/*         className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white" */}
                                        {/*     > */}
                                        {/*         <Cog6ToothIcon */}
                                        {/*             aria-hidden="true" */}
                                        {/*             className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white" */}
                                        {/*         /> */}
                                        {/*         Settings */}
                                        {/*     </a> */}
                                        {/* </li> */}
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <Image
                                alt="出更易"
                                src="/image/favicon.ico"
                                height={32}
                                width={32}
                                className="h-8 w-auto"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul
                                role="list"
                                className="flex flex-1 flex-col gap-y-7"
                            >
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-indigo-700 text-white'
                                                            : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            item.current
                                                                ? 'text-white'
                                                                : 'text-indigo-200 group-hover:text-white',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-indigo-200">
                                        External Links
                                    </div>
                                    <ul
                                        role="list"
                                        className="-mx-2 mt-2 space-y-1"
                                    >
                                        {externalLinks.map((team) => (
                                            <li key={team.name}>
                                                <a
                                                    href={team.href}
                                                    className={classNames(
                                                        team.current
                                                            ? 'bg-indigo-700 text-white'
                                                            : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                                    )}
                                                >
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                                        {team.initial}
                                                    </span>
                                                    <span className="truncate">
                                                        {team.name}
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                {/* <li className="mt-auto"> */}
                                {/*     <a */}
                                {/*         href="#" */}
                                {/*         className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white" */}
                                {/*     > */}
                                {/*         <Cog6ToothIcon */}
                                {/*             aria-hidden="true" */}
                                {/*             className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white" */}
                                {/*         /> */}
                                {/*         Settings */}
                                {/*     </a> */}
                                {/* </li> */}
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon
                                aria-hidden="true"
                                className="h-6 w-6 text-foreground"
                            />
                        </button>

                        {/* Separator */}
                        <div
                            aria-hidden="true"
                            className="h-6 w-px bg-gray-900/10 lg:hidden"
                        />

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            {/* <form */}
                            {/*     action="#" */}
                            {/*     method="GET" */}
                            {/*     className="relative flex flex-1 bg-background/70" */}
                            {/* > */}
                            {/*     <label */}
                            {/*         htmlFor="search-field" */}
                            {/*         className="sr-only" */}
                            {/*     > */}
                            {/*         Search */}
                            {/*     </label> */}
                            {/*     <MagnifyingGlassIcon */}
                            {/*         aria-hidden="true" */}
                            {/*         className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" */}
                            {/*     /> */}
                            {/*     <input */}
                            {/*         id="search-field" */}
                            {/*         name="search" */}
                            {/*         type="search" */}
                            {/*         placeholder="Search..." */}
                            {/*         className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" */}
                            {/*     /> */}
                            {/* </form> */}
                            <div className="flex w-full items-center justify-end gap-x-4 lg:gap-x-6">
                                {/* Separator */}
                                <div
                                    aria-hidden="true"
                                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-foreground/10"
                                />

                                <ModeToggle />
                                <SignedOut>
                                    <SignInButton afterSignInUrl="/">
                                        <User className="m-2" size={18} />
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <UserButton afterSignOutUrl="/" />
                                </SignedIn>
                            </div>
                        </div>
                    </div>

                    <main className="bg-background py-10">
                        <PageTitle>出更易</PageTitle>
                        <SevenSlotsSearchForm defaultData={weekDetails} />
                    </main>
                </div>
            </div>
        </>
    );
}
