import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import PropertyDetails from '@/components/PropertyDetails';
import {PropertyType} from '@/types/PropertyType';
import PropertyImages from '@/components/PropertyImages';
import NotFound from "@/app/not-found";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import PropertyContactForm from "@/components/SubmitMessageButton";
import { convertToSerializeableObject } from "@/utils/convertToObject";

interface PropertyPageProps {
  params: {
    id: string;
  };
}

const PropertyPage = async ({ params }: PropertyPageProps) => {
  await connectDB();
  if (!params?.id) {
    NotFound(); 
  }

  const propertiesDoc = await Property.findById(params.id).lean<PropertyType>();

  const property = convertToSerializeableObject(propertiesDoc);

  if (!property) {
    return <h1 className="text-xl font-bold mb-4">Property Not Found</h1>;
  }

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
        <div className="container m-auto py-10 px-6">
          <div className="grid-70-30 md:grid-cols-2 w-full">
            <PropertyDetails property={property} />

            {/* Sidebar */}
            <aside className="space-y-4">
              <BookmarkButton property={property} />
              <ShareButtons property={property} />
              <PropertyContactForm property={property} />
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={property?.images} />
    </>
  );
};
export default PropertyPage;
