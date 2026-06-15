import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useOrders, OrderStatus } from "@/context/OrderContext";

const STATUS_MESSAGES: Record<OrderStatus, { title: string; message: (num: string) => string } | null> = {
  received:   { title: "✅ Pedido confirmado!", message: (n) => `Seu pedido ${n} foi recebido e será preparado em breve.` },
  preparing:  { title: "👨‍🍳 Preparando seu pedido", message: (n) => `Seu pedido ${n} está sendo preparado agora.` },
  ready:      { title: "🎉 Pedido pronto!", message: (n) => `Seu pedido ${n} está pronto para retirada/entrega.` },
  delivering: { title: "🚴 Saiu para entrega!", message: (n) => `Seu pedido ${n} está a caminho. Logo chegará!` },
  delivered:  { title: "🏠 Pedido entregue!", message: (n) => `Seu pedido ${n} foi entregue. Bom apetite!` },
  cancelled:  { title: "❌ Pedido cancelado", message: (n) => `Seu pedido ${n} foi cancelado. Entre em contato pelo chat.` },
};

const STATUS_TYPES: Record<OrderStatus, any> = {
  received:   "order_received",
  preparing:  "order_preparing",
  ready:      "order_ready",
  delivering: "order_delivering",
  delivered:  "order_delivered",
  cancelled:  "order_cancelled",
};

export function OrderNotificationBridge() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { onStatusChange } = useOrders();

  useEffect(() => {
    const unsubscribe = onStatusChange((order, newStatus, prevStatus) => {
      if (newStatus === prevStatus) return;

      if (user?.role === "customer" && order.customerId === user.id) {
        const cfg = STATUS_MESSAGES[newStatus];
        if (cfg) {
          addNotification({
            type: STATUS_TYPES[newStatus],
            title: cfg.title,
            message: cfg.message(order.orderNumber),
            orderId: order.id,
            orderNumber: order.orderNumber,
          });
        }
      }

      if (user?.role === "admin" && newStatus === "received") {
        addNotification({
          type: "new_order_admin",
          title: "🔔 Novo pedido recebido!",
          message: `Pedido ${order.orderNumber} de ${order.customerName}. Toque para gerenciar.`,
          orderId: order.id,
          orderNumber: order.orderNumber,
        });
      }
    });

    return unsubscribe;
  }, [user, addNotification, onStatusChange]);

  return null;
}
