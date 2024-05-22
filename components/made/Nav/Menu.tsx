"use client"

import { FC } from 'react';
import { Session } from 'next-auth';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type MenuProps = {
    session: Session | null;
};

const Menu: FC<MenuProps> = ({ session }) => {    
  return (
    <NavigationMenu className='flex justify-between items-center w-screen max-w-screen h-fit bg-zinc-100 py-1 px-4 md:px-8 border-b border-s-zinc-200 fixed z-10 inset-0'>
        <NavigationMenuList>
            <NavigationMenuItem>
                <Link href="/">
                    <Image src="/minify.png" alt='Minify' width={70} height={70}></Image>
                </Link>
            </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList>
            {!!session ? (
                <NavigationMenuItem asChild>
                    <Button onClick={() => signOut()}>
                        Sign out
                    </Button>
                </NavigationMenuItem>
            ) : (
                <>
                    <NavigationMenuItem>
                        <Button asChild>
                            <Link href={"/login"}>
                                Login
                            </Link>
                        </Button>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Button asChild>
                            <Link href={"/register"}>
                                Register
                            </Link>
                        </Button>
                    </NavigationMenuItem>
                </>
            )}
        </NavigationMenuList>
    </NavigationMenu>
  )
};

export default Menu;