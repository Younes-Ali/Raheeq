import {
  X,
  User,
  Phone,
  MapPin,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import StatusBadge from "../shared/StatusBadge";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} EGP`;

export default function OrderDetailsModal({
  order,
  onClose,
  onUpdate,
  onDelete,
  saving = false,
}) {
  if (!order) return null;

  let items = [];

  try {
    items = Array.isArray(order.items)
      ? order.items
      : JSON.parse(order.items || "[]");
  } catch {
    items = [];
  }

  const canDelete = ["delivered", "cancelled"].includes(
    String(order.status || "").toLowerCase(),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    onUpdate?.({
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#e9e1d2] bg-white p-5">
          <div>
            <h2 className="text-xl font-bold text-[#173f32]">
              Order #{order.order_no || order.id}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Order details and management
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <section>
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#173f32]">
              <User size={18} />
              Customer Information
            </h3>

            <div className="grid gap-4 rounded-xl bg-[#faf9f6] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Customer Name</p>
                <p className="mt-1 font-medium text-[#173f32]">
                  {order.customer_name || "—"}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone size={13} />
                  Phone
                </p>
                <p className="mt-1 font-medium text-[#173f32]">
                  {order.phone || "—"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={13} />
                  Address
                </p>
                <p className="mt-1 font-medium text-[#173f32]">
                  {order.address || "—"}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#173f32]">
              <ClipboardList size={18} />
              Order Items
            </h3>

            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="rounded-xl bg-[#faf9f6] p-4 text-sm text-gray-500">
                  No items information available.
                </p>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.id || item.product_id || index}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#faf9f6] p-4"
                  >
                    <div>
                      <p className="font-medium text-[#173f32]">
                        {item.name || item.product_name || "Product"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity || item.qty || 1}
                      </p>
                    </div>

                    <p className="font-semibold text-[#173f32]">
                      {formatPrice(
                        Number(item.price || 0) *
                          Number(item.quantity || item.qty || 1),
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#173f32] p-4 text-white">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold">
                {formatPrice(order.total)}
              </span>
            </div>
          </section>

          <section>
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#173f32]">
              <CreditCard size={18} />
              Order Management
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Order Status
                </label>

                <select
                  name="status"
                  value={order.status || "new"}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                >
                  <option value="new">New</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Payment Status
                </label>

                <select
                  name="payment_status"
                  value={order.payment_status || "unpaid"}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Payment Method
                </label>

                <p className="rounded-xl bg-[#faf9f6] px-4 py-3 text-sm text-[#173f32]">
                  {order.payment_method || "Not specified"}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Current Status
                </label>

                <div className="pt-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>
          </section>

          {order.notes && (
            <section>
              <h3 className="mb-2 font-semibold text-[#173f32]">Notes</h3>

              <p className="rounded-xl bg-[#faf9f6] p-4 text-sm text-gray-600">
                {order.notes}
              </p>
            </section>
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-[#e9e1d2] p-5">
          <div>
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete?.(order)}
                disabled={saving}
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                Delete Order
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#173f32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1b9c85]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
