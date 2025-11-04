import type { Crop } from "react-image-crop";

export async function cropImageFile(file: File, crop: Crop): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        const pixelCrop = {
          x: Math.round(
            crop.unit === '%'
              ? (img.width * ((crop.x ?? 0) / 100)) * scaleX
              : (crop.x ?? 0) * scaleX
          ),
          y: Math.round(
            crop.unit === '%'
              ? (img.height * ((crop.y ?? 0) / 100)) * scaleY
              : (crop.y ?? 0) * scaleY
          ),
          width: Math.round(
            crop.unit === '%'
              ? (img.width * ((crop.width ?? 0) / 100)) * scaleX
              : (crop.width ?? 0) * scaleX
          ),
          height: Math.round(
            crop.unit === '%'
              ? (img.height * ((crop.height ?? 0) / 100)) * scaleY
              : (crop.height ?? 0) * scaleY
          ),
        };
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        // Always produce PNG regardless of input file type
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const croppedFile = new File([blob], `${baseName}.png`, { type: "image/png" });
            resolve(croppedFile);
          } else {
            reject(new Error("Canvas is empty"));
          }
        }, "image/png");
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(new Error("Error processing image"));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
  });
}
