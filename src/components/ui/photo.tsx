import Image, { type ImageProps } from "next/image";
import { img } from "@/lib/images";

type Props = Omit<ImageProps, "src" | "width" | "height" | "placeholder" | "blurDataURL"> & {
  name: string;
  fill?: boolean;
};

/** next/image wrapper for the pre-optimised images in /public/images */
export function Photo({ name, fill, sizes = "100vw", alt, ...rest }: Props) {
  const i = img(name);
  if (fill) {
    return <Image src={i.src} alt={alt} fill sizes={sizes} placeholder="blur" blurDataURL={i.blurDataURL} {...rest} />;
  }
  return (
    <Image
      src={i.src}
      alt={alt}
      width={i.width}
      height={i.height}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={i.blurDataURL}
      {...rest}
    />
  );
}
