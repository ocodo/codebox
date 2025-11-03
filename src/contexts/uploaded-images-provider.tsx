import { createContext, useContext, useState, type FC, type ReactNode } from "react";

interface UploadedImagesContextType {
  uploadedImages: File[];
  setUploadedImages: (newValue: File[]) => void;
  url: string;
  setUrl: (newValue: string) => void;
}

const UploadedImagesContext = createContext<UploadedImagesContextType | undefined>(undefined);

export const useUploadedImages = () => {
  const context = useContext(UploadedImagesContext);
  if (!context) {
    throw new Error("useUploadedImages must be used within a UploadedImagesProvider")
  }
  return context;
}

interface UploadedImagesProviderProps {
  children: ReactNode;
}

export const UploadedImagesProvider: FC<UploadedImagesProviderProps> = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [url, setUrl] = useState<string>('')

  return <UploadedImagesContext.Provider value={{
    uploadedImages,
    setUploadedImages,
    url,
    setUrl,
  }}>
    {children}
  </UploadedImagesContext.Provider>
}
