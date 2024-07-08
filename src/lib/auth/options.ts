import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "empleadouser" },
        password: { label: "Contraseña", type: "password", placeholder: "********" },
      },
      async authorize(credentials, req) {
        if (!credentials) throw new Error('No se han proporcionado credenciales.')

        const userFound = await db.user.findUnique({
            where: {
                username: credentials.username
            },
            include: {
              roles: true
            }
        })

        if (!userFound) throw new Error('No se ha encontrado el usuario.')

        const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

        if (!matchPassword) throw new Error('La contraseña no coincide.')

        return {
            id: userFound.id,
            username: userFound.username,
            image: userFound.image,
            empleadoId: userFound.empleadoId,
            roles: userFound.roles.map(role => role.role)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {
      if (user) token.user = user
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.id = token.user.id
      // @ts-ignore
      session.user.username = token.user.username
      // @ts-ignore
      session.user.empleadoId = token.user.empleadoId
      // @ts-ignore
      session.user.image = token.user.image
      // @ts-ignore
      session.user.roles = token.user.roles
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  }
};
 
export const handler = NextAuth(authOptions)