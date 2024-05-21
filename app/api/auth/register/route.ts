import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

const userSchema = z.object({
    name: z.string().min(2, "Name must be 2 characters long.").max(250, "Name can't be more then 250 characters long."),
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(8, "Password must be 8 characters long.")
  });

export const POST = async (req: Request) => {
    try {
        const { name, email, password } = await req.json();

        userSchema.parse({ name, email, password })

        const hashPass = await bcrypt.hash(password, 10);

        const res = await sql`
            INSERT INTO users (name, email, password) 
            VALUES (${name}, ${email}, ${hashPass})
        `

        return NextResponse.json({ 
            message: "Successful registration!",
            data: { name, email }
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error)
            
            return NextResponse.json({ error })
        }

        return NextResponse.error();
    }
}