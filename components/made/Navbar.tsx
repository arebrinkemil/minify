import Link from "next/link";
import { getServerSession } from "next-auth";
import { Button } from "../ui/button";
import Logout from "./Logout";

const Navbar = async () => {
    const session = await getServerSession();

    return (
        <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 ">
            {!!session ? (
                <Logout>Logout</Logout>
            ) : (
                <Button asChild>
                    <Link href={"/login"}>Login</Link>
                </Button>
            )}
        </div>
    )

}

export default Navbar;