import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email as string },
              { username: credentials.email as string },
            ],
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.username,
          image: user.image,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Fetch the DB user to get credits, role, etc.
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.credits = dbUser.credits;
          token.username = dbUser.username;
          token.referralCode = dbUser.referralCode;
        } else {
          token.id = user.id;
        }
        // Flag that this is a fresh login (for the client to detect)
        if (account?.provider === "google") {
          token.isNewLogin = true;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).customToken = Buffer.from(JSON.stringify({
          id: token.id,
          email: session.user.email,
          role: token.role || 'USER',
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        })).toString('base64');
        (session as any).dbUser = {
          id: token.id,
          email: session.user.email,
          username: token.username,
          name: session.user.name,
          credits: token.credits || 0,
          role: token.role || 'USER',
          referralCode: token.referralCode || null,
        };
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Upsert user for Google OAuth
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              username: user.email!.split("@")[0],
              name: user.name,
              image: user.image,
              credits: 100, // Welcome bonus
            },
          });
        }
      }
      return true;
    },
  },
});
