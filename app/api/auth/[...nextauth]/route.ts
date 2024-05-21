import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import { sql } from "@vercel/postgres";

const handler = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: {},
              password: {}
            },
            async authorize(credentials, req) {
                if (!credentials) return null;
                
                const res = await sql`
                    SELECT * FROM users WHERE email=${credentials.email}
                `
                const user = res.rows[0];

                const passOk = await bcrypt.compare(credentials.password || "", user.password);
                
                console.log("passOk", passOk)
                
                if (passOk) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                }
                
                return null;
            }
          })
    ]
})

export { handler as GET, handler as POST}