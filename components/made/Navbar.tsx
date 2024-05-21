import { getServerSession } from "next-auth";
import { Button } from "../ui/button";
import Image from 'next/image';
import Link from 'next/link';
import Logout from "./Logout";
import authOptions from "@/app/api/auth/[...nextauth]/auth";


const Navbar = async () => {
    const session = await getServerSession(authOptions);

    console.log("from nav", session)

    return (
        <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0 flex flex-row justify-between">
            <Link href="/">
                <Image src="/minify.png" alt='Minify' width={70} height={70}></Image>
            </Link>
            <div className='flex flex-row gap-6 pt-5 mr-5'>
                {!!session ? (
                    <Logout>Logout</Logout>
                ) : (
                  <>
                    <Button asChild>
                        <Link href={"/login"}>Login</Link>
                    </Button>
                    <Link href="/register"><div>Register</div></Link>
                  </>
                )}
            </div>
        </div>
    )
}

export default Navbar;