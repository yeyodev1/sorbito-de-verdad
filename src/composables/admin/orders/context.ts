import { inject, provide, type InjectionKey } from 'vue';
import { useOrdersList } from './useOrdersList';
import { useConfirmDialog } from './useConfirmDialog';
import { usePayModal } from './usePayModal';
import { useReceiptModal } from './useReceiptModal';
import { usePaymentModal } from './usePaymentModal';
import { useOrderActions } from './useOrderActions';

/** Crea todo el estado de la gestión de órdenes y lo comparte con los hijos. */
export function createOrdersContext() {
  const list = useOrdersList();
  const confirm = useConfirmDialog();
  const pay = usePayModal();
  const receipt = useReceiptModal();
  const payment = usePaymentModal(list.updateCountsAfterChange);
  const actions = useOrderActions({
    showConfirm: confirm.showConfirm,
    openPayModal: pay.openPayModal,
    openReceiptModal: receipt.openReceiptModal,
    openPaymentModal: payment.openPaymentModal,
    draftNotes: list.draftNotes,
  });

  const ctx = { ...list, ...confirm, ...pay, ...receipt, ...payment, ...actions };
  provide(ORDERS_CONTEXT, ctx);
  return ctx;
}

export type OrdersContext = ReturnType<typeof createOrdersContext>;

const ORDERS_CONTEXT: InjectionKey<OrdersContext> = Symbol('orders-context');

export function useOrdersContext(): OrdersContext {
  const ctx = inject(ORDERS_CONTEXT);
  if (!ctx) throw new Error('useOrdersContext() must be used inside OrderManagement');
  return ctx;
}
