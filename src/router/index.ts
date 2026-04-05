import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Inicio' },
  },
  {
    path: '/tienda',
    name: 'Shop',
    component: () => import('../views/ShopView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/tienda/:slug',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { title: 'Producto' },
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('../views/CartView.vue'),
    meta: { title: 'Carrito' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { title: 'Finalizar Compra', requiresAuth: true },
  },
  {
    path: '/nosotros',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'Nosotros' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Iniciar Sesión', guestOnly: true },
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: 'Mi Perfil', requiresAuth: true },
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
  if (to.meta?.title) {
    document.title = `${to.meta.title} — Sorbito de Verdad`
  }

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
