'use server';

import connectDB from '@/config/database';
import User from '@/models/User';
import { getUserSession } from '@/utils/getUserSession';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';

interface SessionUser {
    userId: string;
}

interface BookmarkResponse {
    message: string;
    isBookmarked: boolean;
}

async function bookmarkProperty(propertyId: string): Promise<BookmarkResponse | { error: string }> {
    await connectDB();

    const sessionUser: SessionUser | null = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        return { error: 'User ID is required' };
    }

    const { userId } = sessionUser;

    // Find user in database
    const user = await User.findById(userId);

    if (!user) {
        return { error: 'User not found' };
    }

    // Check if property is bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId as unknown as Types.ObjectId);
    let message: string;

    if (isBookmarked) {
        user.bookmarks.pull(propertyId);
        message = 'Bookmark removed successfully';
        isBookmarked = false;
    } else {
        user.bookmarks.push(propertyId);
        message = 'Bookmark added successfully';
        isBookmarked = true;
    }

    await user.save();
    revalidatePath('/properties/saved', 'page');

    return { message, isBookmarked };
}

export default bookmarkProperty;
