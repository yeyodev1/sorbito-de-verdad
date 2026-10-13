// ── Card images ───────────────────────────────────────────────────────────
export const SENEFELDER_LOGO = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775354051/sorbito-de-verdad/collaborators/senefelder-logo.png';
export const FRANZ_IMG       = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775351847/sorbito-de-verdad/products/ergzx1oqfuyxjdr07jpc.jpg';
export const DOGA_IMG        = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775351850/sorbito-de-verdad/products/mgw2nzrguzruderiy2dn.jpg';
// Real Bakano logo (white version) + team group photo as background
export const BAKANO_LOGO     = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775355499/sorbito-de-verdad/collaborators/bakano-logo-real.png';
export const BAKANO_TEAM_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775355503/sorbito-de-verdad/collaborators/bakano-team-photo.jpg';

export const collaborators = [
  {
    id: 'senefelder',
    eyebrow: 'Empaques & Artes Gráficas',
    name: 'Senefelder',
    tagline: 'Ellos hacen los empaques de cada taza.',
    description: 'Industria gráfica ecuatoriana con más de 100 años de historia, certificada ISO 9001:2015. Cada caja, cada empaque que protege y presenta tu taza lleva su sello de calidad.',
    url: 'https://www.senefelder.com',
    logo: SENEFELDER_LOGO,
    logoFilter: 'brightness(0) invert(1)',
    bgColor: '#0D1117',
    bgImage: null,
    accentColor: '#E8B84B',
    country: 'Ecuador',
    cta: 'senefelder.com',
  },
  {
    id: 'franz',
    eyebrow: 'Diseño de cada taza',
    name: 'Franz Del Castillo',
    tagline: 'Él diseñó cada taza que ves aquí.',
    description: 'Diseñador ecuatoriano que dio vida a los íconos de cada colección: las gafas de Boscan, las pestañas de La Moni. Su trazo convierte cerámica en identidad.',
    url: 'https://www.instagram.com/franzdelcastillo/',
    logo: null,
    logoFilter: null,
    bgImage: FRANZ_IMG,
    bgColor: null,
    accentColor: '#A855F7',
    country: 'Ecuador',
    cta: '@franzdelcastillo',
  },
  {
    id: 'doga',
    eyebrow: 'Las manos artesanas',
    name: 'Doga Designs',
    tagline: 'Sus manos moldean cada taza, una por una.',
    description: 'Las artesanas ecuatorianas que moldean, pintan y hornean cada taza de forma individual. Sin producción en masa — cada pieza es única, hecha a mano con dedicación.',
    url: 'https://www.instagram.com/doga.designs/',
    logo: null,
    logoFilter: null,
    bgImage: DOGA_IMG,
    bgColor: null,
    accentColor: '#C8956C',
    country: 'Ecuador',
    cta: '@doga.designs',
  },
  {
    id: 'bakano',
    eyebrow: 'Consultoría & Tecnología Digital',
    name: 'Bakano',
    tagline: 'Nosotros hacemos procesos de marketing y ventas. Conectamos a tus clientes potenciales con tu canal de transacción para que tu negocio crezca.',
    description: 'La agencia #1 en Ecuador que se obsesiona con que sus clientes facturen más. +40 negocios con experiencia real. Detrás de que puedas encontrar y comprar tu taza desde aquí.',
    url: 'https://bakano.ec/',
    logo: BAKANO_LOGO,
    logoFilter: 'none',                      // already white logo
    bgImage: BAKANO_TEAM_IMG,
    bgColor: null,
    accentColor: '#C8956C',
    country: 'Ecuador',
    cta: 'bakano.ec',
  },
];
