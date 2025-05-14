import PropertyCard from "@/components/PropertyCard";
import properties from "@/properties.json";
import Link from "next/link";

const HomeProperties = () => {
  const recentPropertes = properties.slice(0, 3);

  return (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <h2 className="text-3xl font-bold text-blue-500 mb-6">
            Recent Properties
          </h2>
          {properties.length === 0 ? (
            "No properties found"
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPropertes.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="m-auto max-w-lg my-10 px-6">
        <Link className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700" href="/properties">Show All Properties</Link>
      </section>
    </>
  );
};
export default HomeProperties;
