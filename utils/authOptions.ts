import connectDB from '@/config/database';
import User from '@/models/User';
import GoogleProvider from 'next-auth/providers/google';
import type { Profile, Session } from 'next-auth'

interface GoogleProfile extends Profile {
    picture?: string;
  }

interface SessionWithUserId extends Session {
    user: {
        id?: string;
        email?: string;
        name?: string;
        image?: string;
    };
  }

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_SECRET_KEY || "",
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: "code"
                }
            }
        })
    ],
    callbacks:{
        async signIn({ profile }: { profile: GoogleProfile }) {
            await connectDB();



            const userExists = await User.findOne({email: profile.email});
            if(!userExists){
                const username = profile?.name?.slice(0,20);

                await User.create({
                    email: profile.email,
                    username,
                    image: profile.picture
                })
            }

            return profile;
        },
        async session({ session }: { session: SessionWithUserId }){
            const user = await User.findOne({email:session.user.email});

                session.user.id = user._id.toString();

            return session;
        }
    }
};