// Países disponibles en el checkout y la zona de envío que les corresponde

export const COUNTRY_ZONE_MAP: Record<string, string> = {
  'Ecuador': 'Ecuador Continental',
  'Estados Unidos': 'Estados Unidos y Canadá',
  'Canadá': 'Estados Unidos y Canadá',
  'España': 'Europa',
  'Francia': 'Europa',
  'Alemania': 'Europa',
  'Italia': 'Europa',
  'Portugal': 'Europa',
  'Países Bajos': 'Europa',
  'Bélgica': 'Europa',
  'Suiza': 'Europa',
  'Austria': 'Europa',
  'Suecia': 'Europa',
  'Noruega': 'Europa',
  'Dinamarca': 'Europa',
  'Finlandia': 'Europa',
  'Polonia': 'Europa',
  'Grecia': 'Europa',
};

export const countryOptions = [
  { label: 'Ecuador', value: 'Ecuador', flag: '🇪🇨' },
  { label: 'Estados Unidos', value: 'Estados Unidos', flag: '🇺🇸' },
  { label: 'Canadá', value: 'Canadá', flag: '🇨🇦' },
  { label: 'España', value: 'España', flag: '🇪🇸' },
  { label: 'Francia', value: 'Francia', flag: '🇫🇷' },
  { label: 'Alemania', value: 'Alemania', flag: '🇩🇪' },
  { label: 'Italia', value: 'Italia', flag: '🇮🇹' },
  { label: 'Portugal', value: 'Portugal', flag: '🇵🇹' },
  { label: 'Países Bajos', value: 'Países Bajos', flag: '🇳🇱' },
  { label: 'Bélgica', value: 'Bélgica', flag: '🇧🇪' },
  { label: 'Suiza', value: 'Suiza', flag: '🇨🇭' },
  { label: 'Austria', value: 'Austria', flag: '🇦🇹' },
  { label: 'Suecia', value: 'Suecia', flag: '🇸🇪' },
  { label: 'Noruega', value: 'Noruega', flag: '🇳🇴' },
  { label: 'Dinamarca', value: 'Dinamarca', flag: '🇩🇰' },
  { label: 'Finlandia', value: 'Finlandia', flag: '🇫🇮' },
  { label: 'Polonia', value: 'Polonia', flag: '🇵🇱' },
  { label: 'Grecia', value: 'Grecia', flag: '🇬🇷' },
];

export type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  identificationNumber: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mapsUrl: string;
};

export type CheckoutField = keyof CheckoutForm | 'zone';

export function formatPrice(val: number) {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(val);
}
