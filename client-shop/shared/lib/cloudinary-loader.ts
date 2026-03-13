interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality: _quality }: CloudinaryLoaderParams): string {
  if (!src.includes("res.cloudinary.com")) {
    return src;
  }

  const w = Math.min(width, 800);
  const transformation = `w_${w},c_limit,fl_preserve_transparency,q_100`;

  const cleanSrc = src.replace(/\/image\/upload\/[^/]+\//, "/image/upload/");
  return cleanSrc.replace("/image/upload/", `/image/upload/${transformation}/`);
}