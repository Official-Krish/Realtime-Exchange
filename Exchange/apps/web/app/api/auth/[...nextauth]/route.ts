import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { User } from 'next-auth';
import prisma from '../../../../../../packages/db/src';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { Adapter } from 'next-auth/adapters';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
        } & User;
    }

    interface JWT {
        uid: string;
    }
}

const handler = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                name: { label: 'Name', type: 'text', placeholder: 'Name' },
                email: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                let user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.email,
                            name: credentials.name,
                            password: await bcrypt.hash(credentials.password, 10),
                        },
                    });
                    return {
                        id: newUser.id.toString(),
                        email: newUser.email,
                        name: newUser.name,
                    } as User;
                } else {
                    const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isCorrectPassword) {
                        throw new Error('Invalid credentials');
                    }
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                    } as User;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "secr3t",
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.uid) {
                session.user.id = token.uid as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
});

export { handler as GET, handler as POST };
