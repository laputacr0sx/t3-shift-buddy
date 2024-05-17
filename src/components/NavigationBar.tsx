import { forwardRef } from 'react';
import Link from 'next/link';

import { cn } from '~/lib/utils';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '~/components/ui/navigation-menu';
import { ModeToggle } from './ModeToggle';
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser
} from '@clerk/nextjs';

import { User } from 'lucide-react';

interface DutyAppPages {
    title: string;
    href: string;
    description: string;
}
const dutyAppPages: DutyAppPages[] = [
    {
        title: '出更易',
        description: '按日子查詢更份。',
        href: '/'
    },
    {
        title: '記更易',
        description: '紀錄各週份Standard Roster。',
        href: '/ezduty'
    },
    {
        title: '用戶資料',
        description: '查詢或更改用戶資料。',
        href: '/user'
    }
];

const externalPages: DutyAppPages[] = [
    {
        title: 'OKMALL',
        description: '開啟MTR OKMALL分頁。',
        href: 'https://okmall.mtr.com.hk/'
    },
    {
        title: 'ESS',
        description: '開啟ESS分頁',
        href: 'https://okmall.mtr.com.hk/'
    }
];

export function NavigationBar() {
    const { isSignedIn, user } = useUser();

    return (
        <NavigationMenu className="mx-2 my-1" id="top-bar">
            <NavigationMenuList>
                {/* <NavigationMenuItem> */}
                {/*     <SignedOut> */}
                {/*         <SignInButton afterSignInUrl="/ezduty"> */}
                {/*             <User className="m-2" size={18} /> */}
                {/*         </SignInButton> */}
                {/*     </SignedOut> */}
                {/*     <SignedIn> */}
                {/*         <UserButton afterSignOutUrl="/" /> */}
                {/*     </SignedIn> */}
                {/* </NavigationMenuItem> */}
                {/* <NavigationMenuItem> */}
                {/*     {isSignedIn ? ( */}
                {/*         <p className="font-sans font-semibold"> */}
                {/*             {user.username} */}
                {/*         </p> */}
                {/*     ) : null} */}
                {/* </NavigationMenuItem> */}
                {/* <NavigationMenuItem> */}
                {/*     <NavigationMenuTrigger>功能</NavigationMenuTrigger> */}
                {/*     <NavigationMenuContent> */}
                {/*         <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] "> */}
                {/*             {dutyAppPages.map((page) => ( */}
                {/*                 <ListItem */}
                {/*                     key={page.title} */}
                {/*                     title={page.title} */}
                {/*                     href={page.href} */}
                {/*                 > */}
                {/*                     {page.description} */}
                {/*                 </ListItem> */}
                {/*             ))} */}
                {/*         </ul> */}
                {/*     </NavigationMenuContent> */}
                {/* </NavigationMenuItem> */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>外部連結</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {externalPages.map((page) => (
                                <ListItem
                                    key={page.title}
                                    title={page.title}
                                    href={page.href}
                                    target="_blank"
                                >
                                    {page.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href as string}
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
