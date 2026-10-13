<template>
  <section class="co__section co__section--pay">
    <h2 class="co__section-title"><span class="co__step">3</span> Pago</h2>
    <div class="co__pay-info">
      <i class="fa-solid fa-credit-card"></i>
      <div>
        <strong>Tarjeta de crédito o débito</strong>
        <p>Al tocar “Pagar” se abre PayPhone, la pasarela segura, para ingresar tu tarjeta.</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './fields';

.co {
  &__pay-info {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

    > i {
      margin-top: 0.15rem;
      font-size: 1.25rem;
      color: var(--color-accent);
    }

    strong { font-size: 0.9375rem; }
    p { font-size: 0.8125rem; line-height: 1.55; }
  }
}
</style>
