import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import Menu from "./Menu";


const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return <Menu session={session} />
}

export default Navbar;