"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import deleteProperty from "@/app/actions/deleteProperty";
import { toast } from "react-toastify";
import {PropertyType} from '@/types/PropertyType';

interface ProfilePropertiesProps {
  properties: PropertyType[];
}

const ProfileProperties = ({
  properties: initialProperties,
}: ProfilePropertiesProps) => {
  const [properties, setProperties] =
    useState<PropertyType[]>(initialProperties);

  const handleDeleteProperty = async (propertyId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      const deletePropertyById = deleteProperty.bind(null, propertyId);
      await deletePropertyById();
      toast.success("Property Deleted");

      setProperties(
        properties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      toast.error("Failed to delete property");
      console.error(error);
    }
  };

  return (
    <>
      {properties.map((property) => (
        <div key={property._id} className="mb-10">
          <Link href={`/properties/${property._id}`}>
            <Image
              className="h-32 w-full rounded-md object-cover"
              src={property.images?.[0] || "/images/default-property.jpg"}
              alt={property.name}
              width={500}
              height={100}
              priority={true}
            />
          </Link>
          <div className="mt-2">
            <p className="text-lg font-semibold">{property.name}</p>
            <p className="text-gray-600">
              Address: {property.location.street} {property.location.city}{" "}
              {property.location.state}
            </p>
            <div className="mt-1">
              <span className="mr-2">Beds: {property.beds}</span>
              <span className="mr-2">Baths: {property.baths}</span>
              <span>Sq Ft: {property.square_feet}</span>
            </div>
          </div>
          <div className="mt-2">
            <Link
              href={`/properties/${property._id}/edit`}
              className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600">
              Edit
            </Link>
            <button
              onClick={() => handleDeleteProperty(property._id)}
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
              type="button">
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfileProperties;
