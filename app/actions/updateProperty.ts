'use server';

import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getUserSession } from '@/utils/getUserSession';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Types } from 'mongoose';


interface UpdatePropertyParams {
    propertyId: Types.ObjectId | string;
    formData: FormData;
  }

async function updateProperty({ propertyId, formData }: UpdatePropertyParams) {
    await connectDB();

    const sessionUser = await getUserSession();

    // Check for session
    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required');
        }

    const { userId } = sessionUser;

    const existingProperty = await Property.findById(propertyId);

    // Verify ownership
    if (existingProperty.owner.toString() !== userId) {
        throw new Error('Current user does not own this property.');
    }

    const propertyData = {
        type: formData.get('type'),
        name: formData.get('name'),
        description: formData.get('description'),
        location: {
            street: formData.get('location.street'),
            city: formData.get('location.city'),
            state: formData.get('location.state'),
            zipcode: formData.get('location.zipcode'),
        },
        beds: formData.get('beds'),
        baths: formData.get('baths'),
        square_feet: formData.get('square_feet'),
        amenities: formData.getAll('amenities'),
        rates: {
            weekly: formData.get('rates.weekly'),
            monthly: formData.get('rates.monthly'),
            nightly: formData.get('rates.nightly.'),
        },
        seller_info: {
            name: formData.get('seller_info.name'),
            email: formData.get('seller_info.email'),
            phone: formData.get('seller_info.phone'),
        },
        owner: userId,
    };

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        propertyData
    );

    revalidatePath('/', 'layout');

    redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;