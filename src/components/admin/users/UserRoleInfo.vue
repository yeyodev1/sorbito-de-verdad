<template>
  <!-- Role info -->
  <div class="um__role-info">
    <div class="um__role-card">
      <div class="um__role-icon um__role-icon--owner">
        <i class="fa-solid fa-crown"></i>
      </div>
      <div>
        <h4 class="um__role-title">Owner</h4>
        <p class="um__role-desc">Acceso total. Puede crear/eliminar admins, gestionar todo el sistema.</p>
      </div>
    </div>
    <div class="um__role-card">
      <div class="um__role-icon um__role-icon--admin">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <div>
        <h4 class="um__role-title">Admin</h4>
        <p class="um__role-desc">Gestionar productos, categorías y órdenes. No puede gestionar usuarios.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.um {
  &__role-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__role-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;
  }

  &__role-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;

    &--owner {
      background-color: rgba($admin-accent, 0.15);
      color: $admin-accent;
    }

    &--admin {
      background-color: rgba($admin-info, 0.15);
      color: $admin-info;
    }
  }

  &__role-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0 0 0.25rem;
  }

  &__role-desc {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0;
    line-height: 1.5;
  }
}
</style>
