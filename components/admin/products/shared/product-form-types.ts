export interface ProductImageDraft {
  id: string;
  fileKey: string;
  file: File;
  previewUrl: string;
  isPrimary: boolean;
}

export interface ExistingProductImage {
  id: string;
  url: string;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariantDraft {
  id: string;
  colorId: string;
  sku: string;
  stock: string;
  reservedStock: string;
}