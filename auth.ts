import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import {writeClient} from "@/sanity/lib/write-client";
import {client} from "@/sanity/lib/client";
import {AUTHOR_BY_GOOGLE_SUB_QUERY} from "@/sanity/lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name, picture, sub } = profile as {
        email: string;
        name: string;
        picture: string;
        sub: string;
      };

      const username = email.split("@")[0];

      const existingUser = await client.fetch(AUTHOR_BY_GOOGLE_SUB_QUERY, { id: sub });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: sub,
          name,
          email,
          username,
          image: picture,
          bio: "",
        });
      }

      return true;
    },
  async jwt({token, account, profile}) {
    if (account && profile) {
      const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GOOGLE_SUB_QUERY, {id: profile.sub});

      token.id = user?._id;
    }

    return token;
  },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});