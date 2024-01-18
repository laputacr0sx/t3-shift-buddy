import { forwardRef } from 'react';
import Link from 'next/link';

import { cn } from '~/lib/utils';
// import { Icons } from "~/components/icons";
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
import { Button } from './ui/button';

const components: { title: string; href: string; description: string }[] = [
    {
        title: '出更易',
        description: '查詢各週份Standard Roster。',
        href: '/'
    },
    {
        title: '搵更易',
        description: '列出現行更表明細。',
        href: '/allShifts'
    }
];

export function NavigationMenuDemo() {
    const { isSignedIn, user } = useUser();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <SignedOut>
                        <SignInButton afterSignInUrl="/">
                            <User className="m-2" size={18} />
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    {isSignedIn ? (
                        <p className="font-sans font-semibold">
                            {user.fullName}
                        </p>
                    ) : null}
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>功能</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
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
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
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
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
