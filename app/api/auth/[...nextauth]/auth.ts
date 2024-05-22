import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import { sql } from "@vercel/postgres";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
        signOut: "/logout"
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
    ],
    callbacks: {
        async session(sessionParams) {
            const { session, token } = sessionParams

            session.user = { ...session.user, id: token.sub || ""}

            return session;
        }
    }
}

export default authOptions