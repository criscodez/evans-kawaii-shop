import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      empleadoId: string;
      image: string;
      roles: string[];
      [key: string]: string;
    };
  }
}