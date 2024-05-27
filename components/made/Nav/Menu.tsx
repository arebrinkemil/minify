'use client'

import { FC } from 'react'
import { Session } from 'next-auth'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ModeToggle } from './ToggleMode'
import { Link as LinkLogo } from 'lucide-react'

type MenuProps = {
  session: Session | null
}

const Menu: FC<MenuProps> = ({ session }) => {
  return (
    <NavigationMenu className='max-w-screen fixed inset-0 z-10 flex h-[79px] w-screen items-center justify-between border-b border-s-zinc-200 bg-background px-4 py-1 md:px-8'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href='/'>
            <LinkLogo className='' size={45} />
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        {!!session ? (
          <>
            <NavigationMenuItem>
              <Button asChild>
                <Link href={'/dashboard'}>Dashboard</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem asChild>
              <Button onClick={() => signOut()}>Sign out</Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <Button asChild>
                <Link href={'/login'}>Login</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild>
                <Link href={'/register'}>Register</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Menu
