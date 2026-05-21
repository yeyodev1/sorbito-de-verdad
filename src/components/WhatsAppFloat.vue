<script setup lang="ts">
const message = '¡Hola! \u{1F44B} Quiero ver el cat\u00E1logo \u{1F6D2}';
const waLink = `https://api.whatsapp.com/send/?phone=593962861148&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
</script>

<template>
  <a
    :href="waLink"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-float"
    aria-label="Chatea con nosotros por WhatsApp"
  >
    <span class="whatsapp-float__pulse"></span>
    <i class="fa-brands fa-whatsapp whatsapp-float__icon"></i>
    <span class="whatsapp-float__tooltip">¡Hola! Quiero ver el catálogo 🛒</span>
  </a>
</template>

<style lang="scss" scoped>
.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: #25D366;
  color: #fff;
  border-radius: 50%;
  text-decoration: none;
  box-shadow:
    0 4px 16px rgba(37, 211, 102, 0.35),
    0 0 0 0 rgba(37, 211, 102, 0.3);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 768px) {
    bottom: 32px;
    right: 32px;
    width: 58px;
    height: 58px;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow:
      0 8px 28px rgba(37, 211, 102, 0.45),
      0 0 0 8px rgba(37, 211, 102, 0.12);

    .whatsapp-float__tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-12px) scale(1);
    }

    .whatsapp-float__pulse {
      animation-play-state: paused;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &__pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid rgba(37, 211, 102, 0.4);
    animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;

    @keyframes pulse-ring {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }
  }

  &__icon {
    font-size: 24px;
    line-height: 1;
    position: relative;
    z-index: 1;

    @media (min-width: 768px) {
      font-size: 28px;
    }
  }

  &__tooltip {
    position: absolute;
    right: calc(100% + 12px);
    top: 50%;
    transform: translateY(-50%) translateX(8px) scale(0.95);
    background: #1a1a1a;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    padding: 8px 14px;
    border-radius: 8px;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      visibility 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: #1a1a1a;
    }

    @media (min-width: 768px) {
      font-size: 14px;
      padding: 10px 16px;
    }
  }
}
</style>
