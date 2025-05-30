import PropertyEditForm from "@/components/PropertyEditForm";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import { PropertyType } from "@/types/PropertyType"; // Assuming you have this type exported somewhere

interface Params {
  id: string;
}

interface PropertyEditPageProps {
  params: Params;
}

const PropertyEditPage = async ({ params }: PropertyEditPageProps) => {
  await connectDB();

  const propertyDoc = await Property.findById(params.id).lean();

  if (!propertyDoc) {
    return (
      <h1 className="text-center text-2xl font-bold mt-10">
        Property Not Found
      </h1>
    );
  }

  const property = convertToSerializeableObject(propertyDoc) as PropertyType;

  return (
    <section className="bg-blue-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <PropertyEditForm property={property} />
        </div>
      </div>
    </section>
  );
};

export default PropertyEditPage;
