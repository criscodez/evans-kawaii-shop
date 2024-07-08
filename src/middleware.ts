import { withAuth } from "next-auth/middleware";
import { isAuthorized } from "@/lib/auth/roles";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {

      if (req.nextUrl.pathname === "/auth/signin") return true;

      // @ts-ignore
      if (req.nextUrl.pathname.startsWith("/dashboard")) return isAuthorized(req.nextUrl.pathname, token?.user.roles);

      return !!token;
    },
  },
});

export const config = { matcher: ["/dashboard/:path*"] }