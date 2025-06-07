"use client";
import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { useSession } from "next-auth/react";
import bookmarkProperty from "@/app/actions/bookmarkProperty";
import checkBookmarkStatus from "@/app/actions/ckeckBookmarkStatus";
import { toast } from "react-toastify";

interface Property {
  _id: string;
}

interface BookmarkButtonProps {
  property: Property;
}

interface BookmarkStatusResponse {
  error?: string;
  isBookmarked?: boolean;
}

interface BookmarkPropertyResponse {
  error?: string;
  isBookmarked?: boolean;
  message?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ property }) => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;
  

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res: BookmarkStatusResponse = await checkBookmarkStatus(
          property._id
        );
        if (res.error) {
          toast.error(res.error);
        }
        if (res.isBookmarked !== undefined) {
          setIsBookmarked(res.isBookmarked);
        }
      } catch (error) {
        toast.error("Failed to fetch bookmark status");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkStatus();
  }, [property._id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error("You need to sign in to bookmark a property");
      return;
    }

    try {
      const res: BookmarkPropertyResponse = await bookmarkProperty(
        property._id
      );
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.isBookmarked !== undefined) {
        setIsBookmarked(res.isBookmarked);
      }
      if (res.message) {
        toast.success(res.message);
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return isBookmarked ? (
    <button
      onClick={handleClick}
      className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
      <FaBookmark className="mr-2" /> Remove Bookmark
    </button>
  ) : (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
