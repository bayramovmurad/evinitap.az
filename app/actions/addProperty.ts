'use server';
import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getUserSession } from '@/utils/getUserSession';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { PropertyType } from '@/types/PropertyType'; 

async function addProperty(formData: FormData): Promise<void> {
    await connectDB();

    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required');
    }

    const { userId } = sessionUser;

    // Access all values for amenities and images
    const amenities = formData.getAll('amenities') as string[];
    const images = formData.getAll('images').filter((image) => (image as File).name !== '');

    // Create the propertyData object with embedded seller_info
    const propertyData: Omit<PropertyType, '_id' | 'createdAt' | 'updatedAt' | 'is_featured'> & {
        owner: string;
        beds: number;
        baths: number;
        square_feet: number;
    } = {
        type: formData.get('type') as string,
        name: formData.get('name') as string,
        description: formData.get('description') as string || undefined,
        location: {
            street: formData.get('location.street') as string || undefined,
            city: formData.get('location.city') as string || undefined,
            state: formData.get('location.state') as string || undefined,
            zipcode: formData.get('location.zipcode') as string || undefined,
        },
        beds: Number(formData.get('beds')),
        baths: Number(formData.get('baths')),
        square_feet: Number(formData.get('square_feet')),
        amenities: amenities.length > 0 ? amenities : undefined,
        rates: {
            nightly: formData.get('rates.nightly') ? Number(formData.get('rates.nightly')) : undefined,
            weekly: formData.get('rates.weekly') ? Number(formData.get('rates.weekly')) : undefined,
            monthly: formData.get('rates.monthly') ? Number(formData.get('rates.monthly')) : undefined,
        },
        seller_info: {
            name: formData.get('seller_info.name') as string || undefined,
            email: formData.get('seller_info.email') as string || undefined,
            phone: formData.get('seller_info.phone') as string || undefined,
        },
        owner: userId,
    };

    const imageUrls: string[] = [];

    for (const imageFile of images) {
        const file = imageFile as File;
        const imageBuffer = await file.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        // Convert the image data to base64
        const imageBase64 = imageData.toString('base64');

        // Make request to upload to Cloudinary
        const result: UploadApiResponse = await cloudinary.uploader.upload(
            `data:${file.type};base64,${imageBase64}`,
            {
                folder: 'evinitap',
            }
        );

        imageUrls.push(result.secure_url);
    }

    if (imageUrls.length > 0) {
        propertyData.images = imageUrls;
    }

    const newProperty = new Property(propertyData);
    await newProperty.save();

    revalidatePath('/', 'layout');

    redirect(`/properties/${newProperty._id}`);
}

export default addProperty;