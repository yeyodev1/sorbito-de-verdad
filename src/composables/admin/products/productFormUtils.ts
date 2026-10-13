export interface AdminCategory {
  _id: string;
  name: string;
}

export interface ImageItem {
  url: string;
  publicId?: string;
}

export interface SizeItem {
  name: string;
  price: string | number;
}

export interface ProductFormState {
  name: string;
  shortDescription: string;
  description: string;
  sku: string;
  price: string | number;
  compareAtPrice: string | number;
  sizes: SizeItem[];
  stock: string | number;
  category: string;
  productCollection: string;
  tags: string[];
  isFeatured: boolean;
  allowBackorder: boolean;
  isActive: boolean;
  images: ImageItem[];
  mainImage: string;
}

export function emptyProductForm(): ProductFormState {
  return {
    name: '',
    shortDescription: '',
    description: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    sizes: [],
    stock: '',
    category: '',
    productCollection: '',
    tags: [],
    isFeatured: false,
    allowBackorder: false,
    isActive: true,
    images: [],
    mainImage: '',
  };
}

// Format helpers — strip non-numeric chars except decimal point
export function sanitizePrice(val: string): number {
  const clean = String(val).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function sanitizeInt(val: string): number {
  const clean = String(val).replace(/[^0-9]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/** Normaliza un precio escrito a "0.00" o vacío. */
export function formatPriceInput(raw: string | number): string {
  const num = sanitizePrice(String(raw));
  return num > 0 ? num.toFixed(2) : '';
}

/** SKU automático a partir del nombre: SDV-<iniciales>-<3 dígitos>. */
export function generateSku(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.map((w: string) => w[0]?.toUpperCase() || '').join('').slice(0, 5);
  const num = String(Math.floor(Math.random() * 900) + 100);
  return initials ? `SDV-${initials}-${num}` : '';
}

type ApiProduct = Record<string, any>;

export function productToForm(product: ApiProduct): ProductFormState {
  const price = product.price || 0;
  const compareAtPrice = product.compareAtPrice || 0;
  return {
    name: product.name || '',
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    sku: product.sku || '',
    price: price > 0 ? price.toFixed(2) : '',
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice.toFixed(2) : '',
    sizes: (product.sizes || []).map((s: { name: string; price: number }) => ({
      name: s.name,
      price: s.price > 0 ? s.price.toFixed(2) : '',
    })),
    stock: product.stock ?? 0,
    category: typeof product.category === 'object' ? product.category?._id : product.category || '',
    productCollection: product.productCollection || '',
    tags: product.tags || [],
    isFeatured: product.isFeatured || false,
    allowBackorder: product.allowBackorder || false,
    isActive: product.isActive !== false,
    images: (product.images || []).map((img: string | ImageItem) =>
      typeof img === 'string' ? { url: img } : img
    ),
    mainImage: product.mainImage || '',
  };
}

export function buildProductPayload(form: ProductFormState, priceNum: number) {
  return {
    ...form,
    price: priceNum,
    compareAtPrice: sanitizePrice(String(form.compareAtPrice)),
    sizes: form.sizes
      .filter(s => s.name.trim() && sanitizePrice(String(s.price)) > 0)
      .map(s => ({ name: s.name.trim(), price: sanitizePrice(String(s.price)) })),
    stock: sanitizeInt(String(form.stock)),
    images: form.images.map((img) => img.url),
  };
}
