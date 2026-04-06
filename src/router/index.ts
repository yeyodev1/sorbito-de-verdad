import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'Tazas Artesanales Personalizadas en Ecuador',
      description: 'Tazas artesanales personalizadas hechas a mano en Ecuador. Colecciones Boscan y La Moni. Diseño único, cerámica artesanal y envío a todo el país.',
    },
  },
  {
    path: '/tienda',
    name: 'Shop',
    component: () => import('../views/ShopView.vue'),
    meta: {
      title: 'Tienda — Compra Tazas Artesanales',
      description: 'Compra tazas artesanales personalizadas en Ecuador. 4 modelos únicos: Boscan, La Moni, Rústica y Colección completa. Envío a domicilio.',
    },
  },
  {
    path: '/tienda/:slug',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: {
      title: 'Producto',
      description: 'Taza artesanal personalizada hecha a mano en Ecuador. Diseño único, cerámica de calidad. Compra en Sorbito de Verdad.',
    },
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
    meta: { title: 'Carrito de Compras', noindex: true },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { title: 'Finalizar Compra', noindex: true },
  },
  {
    path: '/rastrear',
    name: 'TrackOrder',
    component: () => import('../views/TrackOrderView.vue'),
    meta: {
      title: 'Rastrear Pedido',
      description: 'Rastrea tu pedido de Sorbito de Verdad. Ingresa tu número de pedido o correo electrónico para ver el estado de tu envío.',
    },
  },
  {
    path: '/pay-response',
    name: 'PayResponse',
    component: () => import('../views/PayResponseView.vue'),
    meta: { title: 'Verificando Pago' },
  },
  {
    path: '/pago/pendiente',
    name: 'PaymentPending',
    component: () => import('../views/PaymentPendingView.vue'),
    meta: { title: 'Pago Pendiente' },
  },
  {
    path: '/pago/confirmado',
    name: 'PaymentSuccess',
    component: () => import('../views/PaymentSuccessView.vue'),
    meta: { title: 'Pago Confirmado' },
  },
  {
    path: '/pago/rechazado',
    name: 'PaymentRejected',
    component: () => import('../views/PaymentRejectedView.vue'),
    meta: { title: 'Pago Rechazado' },
  },
  {
    path: '/nosotros',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'Nuestra Historia — Tazas Artesanales en Ecuador',
      description: 'Conoce la historia de Sorbito de Verdad. Tazas artesanales hechas a mano en Ecuador con diseño, cerámica y pasión. 100% talento ecuatoriano.',
    },
  },
  {
    path: '/aliados',
    name: 'Aliados',
    component: () => import('../views/AliadosView.vue'),
    meta: {
      title: 'Nuestros Aliados — Talento Ecuatoriano',
      description: 'Los aliados detrás de Sorbito de Verdad: Senefelder (packaging), Franz Del Castillo (diseño), Doga Designs (cerámica) y Bakano (tecnología).',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Iniciar Sesión', guestOnly: true },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPasswordView.vue'),
    meta: { title: 'Nueva Contraseña' },
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: 'Mi Perfil', requiresAuth: true },
  },
  {
    path: '/mis-pedidos/:id',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetailView.vue'),
    meta: { title: 'Detalle del Pedido', requiresAuth: true },
  },
  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { title: 'Dashboard', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/productos',
    name: 'AdminProducts',
    component: () => import('../views/admin/ProductManagement.vue'),
    meta: { title: 'Gestión de Productos', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/productos/nuevo',
    name: 'AdminProductNew',
    component: () => import('../views/admin/ProductForm.vue'),
    meta: { title: 'Nuevo Producto', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/productos/:id',
    name: 'AdminProductEdit',
    component: () => import('../views/admin/ProductForm.vue'),
    meta: { title: 'Editar Producto', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/categorias',
    name: 'AdminCategories',
    component: () => import('../views/admin/CategoryManagement.vue'),
    meta: { title: 'Categorías', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/ordenes',
    name: 'AdminOrders',
    component: () => import('../views/admin/OrderManagement.vue'),
    meta: { title: 'Órdenes', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsers',
    component: () => import('../views/admin/UserManagement.vue'),
    meta: { title: 'Usuarios', requiresAuth: true, requiresAdmin: true, requiresOwner: true },
  },
  {
    path: '/admin/envios',
    name: 'AdminShipping',
    component: () => import('../views/admin/ShippingManagement.vue'),
    meta: { title: 'Zonas de Envío', requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem('access_token')
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta?.guestOnly)

  // Update document title
  const baseTitle = 'Sorbito de Verdad'
  document.title = to.meta?.title
    ? `${to.meta.title} | ${baseTitle}`
    : `${baseTitle} — Tazas Artesanales en Ecuador`

  // Update meta description
  const desc = (to.meta?.description as string | undefined) ||
    'Tazas artesanales personalizadas hechas a mano en Ecuador. Colecciones Boscan y La Moni. Envío a todo el país.'
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', desc)

  // Update og:title and og:description
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', document.title)
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', desc)

  // noindex for private/checkout pages
  let robotsMeta = document.querySelector('meta[name="robots"]')
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta')
    robotsMeta.setAttribute('name', 'robots')
    document.head.appendChild(robotsMeta)
  }
  robotsMeta.setAttribute('content', to.meta?.noindex ? 'noindex, nofollow' : 'index, follow')

  if (requiresAuth && !hasToken) {
    return next({ path: '/login', query: { redirect: to.fullPath }, replace: true })
  }

  const requiresAdmin = to.matched.some((record) => record.meta?.requiresAdmin)
  if (requiresAdmin) {
    const stored = localStorage.getItem('sorbito_user')
    const user = stored ? JSON.parse(stored) : null
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return next({ path: '/', replace: true })
    }
  }

  if (guestOnly && hasToken) {
    return next({ path: '/', replace: true })
  }

  next()
})

export default router
