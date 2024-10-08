import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { User } from 'next-auth';
import prisma from '../../../../../../packages/db/src';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { Adapter } from 'next-auth/adapters';

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
            //@ts-ignore
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                let user = await prisma.user.findFirst({
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
                } else {
                    const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isCorrectPassword) {
                        throw new Error('Invalid credentials');
                    }
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET || "secr3t",
});
export { handler as GET, handler as POST };
