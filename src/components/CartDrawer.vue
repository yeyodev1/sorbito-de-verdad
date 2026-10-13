<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const cartStore = useCartStore();
const uiStore = useUIStore();
const router = useRouter();

const isOpen = computed(() => uiStore.isCartOpen);
const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const totalItems = computed(() => cartStore.totalItems);
const isEmpty = computed(() => cartStore.isEmpty);

function goToCheckout() {
  uiStore.closeCart();
  router.push('/checkout');
}

function goToShop() {
  uiStore.closeCart();
  router.push('/tienda');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) uiStore.closeCart();
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="cd-overlay" @click="uiStore.closeCart()" />
    </Transition>

    <Transition name="slide-right">
      <aside v-if="isOpen" class="cd" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <header class="cd__header">
          <h2 class="cd__title">
            Tu carrito
            <span v-if="!isEmpty" class="cd__count">{{ totalItems }}</span>
          </h2>
          <button class="cd__close" @click="uiStore.closeCart()" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        <div v-if="isEmpty" class="cd__empty">
          <div class="cd__empty-icon"><i class="fa-solid fa-mug-hot"></i></div>
          <h3 class="cd__empty-title">Tu carrito está vacío</h3>
          <p class="cd__empty-text">Descubre nuestras tazas artesanales y elige la que más te inspire.</p>
          <button class="btn-primary" @click="goToShop">Ver tienda</button>
        </div>

        <template v-else>
          <ul class="cd__list">
            <li v-for="item in items" :key="`${item.product._id}-${item.selectedSize?.name}`" class="cd-item">
              <RouterLink :to="`/tienda/${item.product.slug}`" class="cd-item__media" @click="uiStore.closeCart()">
                <img :src="item.product.mainImage || '/placeholder-cup.jpg'" :alt="item.product.name" loading="lazy" />
              </RouterLink>
              <div class="cd-item__info">
                <div class="cd-item__top">
                  <RouterLink :to="`/tienda/${item.product.slug}`" class="cd-item__name" @click="uiStore.closeCart()">
                    {{ item.product.name }}
                  </RouterLink>
                  <button class="cd-item__remove" @click="cartStore.removeFromCart(item.product._id, item.selectedSize?.name)" :aria-label="`Eliminar ${item.product.name}`">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
                <span v-if="item.selectedSize" class="cd-item__size">{{ item.selectedSize.name }}</span>
                <div class="cd-item__bottom">
                  <div class="qty">
                    <button class="qty__btn" @click="cartStore.updateQuantity(item.product._id, item.quantity - 1, item.selectedSize?.name)" aria-label="Reducir cantidad">−</button>
                    <span class="qty__num">{{ item.quantity }}</span>
                    <button class="qty__btn" @click="cartStore.updateQuantity(item.product._id, item.quantity + 1, item.selectedSize?.name)" aria-label="Aumentar cantidad">+</button>
                  </div>
                  <span class="cd-item__price">{{ formatPrice((item.selectedSize?.price ?? item.product.price) * item.quantity) }}</span>
                </div>
              </div>
            </li>
          </ul>

          <footer class="cd__footer">
            <div class="cd__subtotal">
              <span>Subtotal</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
            </div>
            <p class="cd__note">El envío se calcula según tu país en el siguiente paso.</p>
            <button class="btn-primary btn-lg btn-block cd__pay" @click="goToCheckout">
              <i class="fa-solid fa-lock"></i>
              Pagar ahora · {{ formatPrice(subtotal) }}
            </button>
            <button class="cd__continue" @click="uiStore.closeCart()">Seguir comprando</button>
            <div class="cd__trust">
              <span><i class="fa-solid fa-shield-halved"></i> Pago seguro</span>
              <span><i class="fa-solid fa-truck-fast"></i> Envío a todo el país</span>
            </div>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.cd-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background-color: rgba(20, 14, 10, 0.5);
  backdrop-filter: blur(2px);
}

.cd {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1101;
  width: min(440px, 100vw);
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  box-shadow: var(--shadow-lg);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem 1rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.375rem;
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 0.4rem;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: var(--color-muted);
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.875rem;
    padding: 3rem 2rem;
    text-align: center;
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    font-size: 1.75rem;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  &__empty-title {
    font-size: 1.25rem;
  }

  &__empty-text {
    max-width: 280px;
    font-size: 0.9375rem;
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0.5rem 1.25rem;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
    background-color: var(--color-bg-card);
    border-top: 1px solid var(--color-border);
  }

  &__subtotal {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.9375rem;
    color: var(--color-muted);

    strong {
      font-size: 1.25rem;
      color: var(--color-primary);
      font-variant-numeric: tabular-nums;
    }
  }

  &__note {
    font-size: 0.75rem;
    line-height: 1.5;
  }

  &__pay {
    margin-top: 0.25rem;
  }

  &__continue {
    min-height: 40px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover { color: var(--color-primary); }
  }

  &__trust {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.75rem;
    color: var(--color-muted);

    i { color: var(--color-accent); margin-right: 0.25rem; }
  }
}

.cd-item {
  display: flex;
  gap: 0.875rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child { border-bottom: none; }

  &__media {
    flex-shrink: 0;
    width: 84px;
    height: 96px;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-primary);

    &:hover { color: var(--color-accent); }
  }

  &__remove {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: -0.25rem -0.375rem 0 0;
    color: var(--color-muted);
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-error);
      background-color: var(--color-error-light);
    }
  }

  &__size {
    align-self: flex-start;
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border-radius: $radius-full;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.375rem;
  }

  &__price {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: $radius-full;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
    color: var(--color-primary);
    border-radius: 50%;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  &__num {
    min-width: 24px;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}
</style>
