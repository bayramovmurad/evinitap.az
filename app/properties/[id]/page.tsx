import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import PropertyDetails from '@/components/PropertyDetails';
import {PropertyType} from '@/types/PropertyType';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  await connectDB();
  const property = await Property.findById(params.id).lean<PropertyType>();


  return (
    <>
      <PropertyHeaderImage image={property?.images?.[0] || ""} />
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href={`/properties`}
            className="text-blue-500 hover:text-blue-600 flex items-center">
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </Link>
        </div>
      </section>
      <section className="bg-blue-50">
        <div className="container mx-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full">
            <PropertyDetails property={property} />
          </div>
        </div>
      </section>
    </>
  );
};
export default PropertyPage;
