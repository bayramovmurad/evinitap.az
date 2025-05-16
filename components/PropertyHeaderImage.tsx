// components/PropertyHeaderImage.tsx
import Image from "next/image";

interface PropertyHeaderImageProps {
  image: string;
}

const PropertyHeaderImage = ({ image }: PropertyHeaderImageProps) => {
  return (
    <section>
      <div className="container-xl m-auto">
        <div className="grid-grid-cols-1">
          <Image
            src={`/images/properties/${image}`}
            alt=""
            height={0}
            width={0}
            sizes="100vw"
            className="object-cover h-[400px] w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
