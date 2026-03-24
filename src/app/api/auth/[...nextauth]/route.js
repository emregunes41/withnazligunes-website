import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "MEMBER",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen email ve şifrenizi girin.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Bu email ile kayıtlı kullanıcı bulunamadı.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Hatalı şifre.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          age: user.age,
          phone: user.phone,
          trialStartDate: user.trialStartDate,
          isTrialUsed: user.isTrialUsed,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.gender = user.gender;
        token.age = user.age;
        token.phone = user.phone;
        token.trialStartDate = user.trialStartDate;
        token.isTrialUsed = user.isTrialUsed;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
        token.gender = session.gender;
        token.age = session.age;
        token.phone = session.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.gender = token.gender;
        session.user.age = token.age;
        session.user.phone = token.phone;
        session.user.trialStartDate = token.trialStartDate;
        session.user.isTrialUsed = token.isTrialUsed;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // We will use a modal on the home page
  },
  secret: process.env.NEXTAUTH_SECRET || "nextauth-secret-key-2026-pino-withnazli",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
