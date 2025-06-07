'use server';

import connectDB from '@/config/database';
import User from '@/models/User';
import { getUserSession } from '@/utils/getUserSession';

interface SessionUser {
    userId: string;
}

interface BookmarkStatusResponse {
    isBookmarked: boolean;
}

async function checkBookmarkStatus(propertyId: string): Promise<BookmarkStatusResponse | { error: string }> {
    await connectDB();

    const sessionUser: SessionUser | null = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        return { error: 'User ID is required' };
    }

    const { userId } = sessionUser;

    const user = await User.findById(userId);

    if (!user) {
        return { error: 'User not found' };
    }

    const isBookmarked: boolean = user.bookmarks.includes(propertyId);

    return { isBookmarked };
}

export default checkBookmarkStatus;
