import { useEffect, useMemo, useState } from "react";
import { styles as s } from "../assets/dummyStyles.js";

import {
  Search,
  ChevronDown,
  ChevronUp,
  Truck,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  User,
  MapPin,
  Mail,
  Phone,
  Edit,
  X,
  Package,
  RefreshCw,
  CreditCardIcon,
} from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const statusOptions = [
  {
    value: "Pending",
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    iconColor: "text-yellow-500",
  },
  {
    value: "Processing",
    label: "Processing",
    icon: RefreshCw,
    color: "bg-blue-100 text-blue-800",
    iconColor: "text-blue-500",
  },
  {
    value: "Shipped",
    label: "Shipped",
    icon: Truck,
    color: "bg-indigo-100 text-indigo-800",
    iconColor: "text-indigo-500",
  },
  {
    value: "Delivered",
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    iconColor: "text-green-500",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
    iconColor: "text-red-500",
  },
];

const tabs = [
  { id: "all", label: "All Orders" },
  ...statusOptions.map((o) => ({ id: o.value, label: o.label })),
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    pendingPayment: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = {
          ...(searchTerm && { Search: searchTerm }),
          ...(activeTab !== "all" && { status: activeTab }),
        };
        const { data } = await axios.get(`${BASE_URL}/api/order`, { params });
        setOrders(data.orders);
        setCounts(data.counts);
      } catch (error) {
        console.error("Failed to fetch Orders", error);
      }
    };
    fetchOrders();
  }, [searchTerm, activeTab]);

  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return orders;
    return [...orders].sort((a, b) => {
      const aVal =
        sortConfig.key === "date"
          ? new Date(a[sortConfig.key])
          : a[sortConfig.key];
      const bVal =
        sortConfig.key === "date"
          ? new Date(b[sortConfig.key])
          : b[sortConfig.key];
      return sortConfig.direction === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal > bVal
        ? -1
        : 1;
    });
  }, [orders, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const viewOrder = async (orderId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/order/${orderId}`);
      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to fetch orders Details", error);
    }
  };

  //Update Order Details
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/order/${id}`, {
        orderStatus: newStatus,
      });

      const params = {
        ...(searchTerm && { Search: searchTerm }),
        ...(activeTab !== "all" && { status: activeTab }),
      };
      const { data } = await axios.get(`${BASE_URL}/api/order`, { params });
      setOrders(data.orders);
      setCounts(data.counts);

      if (selectedOrder?._id === id) {
        const { data: fresh } = await axios.get(`${BASE_URL}/api/order/${id}`);
        setSelectedOrder(fresh);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const StatusBadge = ({ status }) => {
    const opt = statusOptions.find((o) => o.value === status);
    if (!opt) return null;
    const Icon = opt.icon;
    return (
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${opt.color}`}
      >
        <Icon className={`w-4 h-4 ${opt.iconColor}`} />
        <span>{opt.label}</span>
      </div>
    );
  };

  const stats = [
    {
      label: "Total Orders",
      value: counts.totalOrders,
      icon: Package,
      color: "bg-indigo-100",
      iconColor: "text-[#43C6AC]",
    },
    {
      label: "Processing",
      value: counts.processing,
      icon: RefreshCw,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Delivered",
      value: counts.delivered,
      icon: CheckCircle,
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Pending Payment",
      value: counts.pendingPayment,
      icon: CreditCard,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className={s.pageBackground}>
      <div className={s.container}>
        <div className="mb-8">
          <h1 className={s.headerTitle}>Order Management</h1>
          <p className={s.headerSubtitle}>
            Track and Manage all Customer Orders
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div className={s.statsCard} key={i}>
              <div className={s.statsCardContent}>
                <div>
                  <p className={s.statsCardLabel}>{stat.label}</p>
                  <p className={s.statsCardValue}>{stat.value}</p>
                </div>

                <div className={s.statsIconContainer(stat.color)}>
                  <stat.icon className={s.statsIcon(stat.iconColor)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={s.controls.container}>
          <div className={s.controls.inner}>
            <div className={s.controls.tabsContainer}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={s.controls.tabButton(activeTab === tab.id)}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={s.controls.search.container}>
              <div className={s.controls.search.icon}>
                <Search className="w-4 h-4 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Search Orders, Customers, or Books"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={s.controls.search.input}
              />
            </div>
          </div>
        </div>

        <div className={s.table.container}>
          <div className="overflow-x-auto">
            <table className={s.table.tableClass}>
              <thead className={s.table.head}>
                <tr>
                  {["id", "customer", "date", "amount"].map((key) => (
                    <th
                      key={key}
                      className={s.table.header}
                      onClick={() => handleSort(key)}
                    >
                      <div className={s.table.headerContent}>
                        {key === "id"
                          ? "Order Id"
                          : key.charAt(0).toUpperCase() + key.slice(1)}

                        {/* Sort Icon */}
                        <span className="ml-1 opacity-0 group-hover:opacity-100">
                          {sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}

                  <th className={s.table.header}>Payment</th>
                  <th className={s.table.header}>Status</th>
                  <th className={`${s.table.header} text-right`}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order._id} className={s.table.row}>
                    <td className={`${s.table.cell} ${s.table.idCell}`}>
                      {order.orderId}
                    </td>
                    <td className={`${s.table.cell} ${s.table.customerCell}`}>
                      {order.shippingAddress.fullName}
                    </td>
                    <td className={`${s.table.cell} ${s.table.dateCell}`}>
                      {new Date(order.placedAt).toLocaleDateString()}
                    </td>
                    <td className={`${s.table.cell} ${s.table.amountCell}`}>
                      ₹{order.finalAmount.toFixed(2)}
                    </td>
                    <td className={s.table.cell}>
                      <div
                        className={s.table.paymentBadge(
                          order.paymentMethod === "Online Payment"
                        )}
                      >
                        {order.paymentMethod === "Online Payment" ? (
                          <CreditCard className="w-4 h-4" />
                        ) : (
                          <DollarSign className="w-4 h-4" />
                        )}
                        <span>
                          {order.paymentMethod === "Online Payment"
                            ? "Online"
                            : "COD"}
                        </span>
                      </div>
                    </td>
                    <td className={s.table.cell}>
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className={`${s.table.cell} text-right`}>
                      <button
                        onClick={() => viewOrder(order._id)}
                        className={s.table.viewButton}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!sortedOrders.length && (
              <div className={s.emptyState.container}>
                <div className={s.emptyState.iconContainer}>
                  <BookOpen className={s.emptyState.icon} />
                </div>

                <h3 className={s.emptyState.title}>No orders Found</h3>
                <p className={s.emptyState.message}>
                  Try Adjusting your Search or Filters
                </p>
              </div>
            )}

            <div className={s.table.footer}>
              <div className={s.table.footerText}>
                Showing{" "}
                <span className="font-medium">{sortedOrders.length}</span> of{" "}
                <span className="font-medium">{counts.totalOrders}</span> orders
              </div>

              <div className={s.table.footerLegend}>
                {[
                  { label: "Online Payment", color: "bg-purple-500" },
                  { label: "Cash on Delivery", color: "bg-orange-500" },
                ].map((i, idx) => (
                  <div className={s.table.legendItem} key={idx}>
                    <div className={s.table.legendDot(i.color)}></div>
                    <span className={s.table.legendLabel}>{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className={s.modal.overlay}>
          <div className={s.modal.container}>
            <div className={s.modal.header}>
              <div>
                <h2 className={s.modal.title}>
                  Order Details: {selectedOrder.orderId}
                </h2>

                <p className={s.modal.subtitle}>
                  Ordered on{" "}
                  {new Date(selectedOrder.placedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className={s.modal.closeButton}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={s.modal.grid}>
              <div className={s.modal.section}>
                <h3 className={s.modal.sectionTitle}>
                  <User className={s.modal.sectionIcon} />
                  Customer Information
                </h3>

                <div className={s.modal.sectionContent}>
                  {[
                    {
                      icon: User,
                      label: "Customer",
                      value: selectedOrder.shippingAddress.fullName,
                    },
                    {
                      icon: Mail,
                      label: "Email",
                      value: selectedOrder.shippingAddress.email,
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: selectedOrder.shippingAddress.phoneNumber,
                    },
                    {
                      icon: MapPin,
                      label: "Address",
                      value: `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state} ${selectedOrder.shippingAddress.zipCode}`,
                    },
                  ].map((it, idx) => (
                    <div className={s.modal.infoItem} key={idx}>
                      <it.icon className={s.modal.infoIcon} />

                      <div>
                        <p className={s.modal.infoLabel}>{it.label}</p>
                        <p className={s.modal.infoValue}>{it.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.modal.section}>
                <h3 className={s.modal.sectionTitle}>
                  <BookOpen className={s.modal.sectionIcon} />
                  Order Summary
                </h3>

                <div className={s.modal.sectionContent}>
                  {selectedOrder.books.map((bk, i) => (
                    <div
                      className="flex items-center justify-between mb-4"
                      key={i}
                    >
                      <img
                        src={`${BASE_URL}${bk.image}`}
                        alt={bk.title}
                        className="w-16 h-20 object-cover rounded"
                      />

                      <div className="flex-1 px-4">
                        <p className="font-medium">{bk.title}</p>
                        <p className="text-sm text-gray-500">{bk.author}</p>
                        <p className="text-xs text-gray-400">ID: {bk.book}</p>
                      </div>

                      <div className="text-right">
                        <p>Qty : {bk.quantity}</p>
                        <p className="text-sm">₹{bk.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-2">
                    {[
                      {
                        label: "Subtotal:",
                        value: `₹${selectedOrder.totalAmount.toFixed(2)}`,
                      },
                      {
                        label: "Shipping:",
                        value: `₹${selectedOrder.shippingCharge.toFixed(2)}`,
                      },
                      {
                        label: "Tax (5%):",
                        value: `₹${selectedOrder.taxAmount.toFixed(2)}`,
                      },
                      {
                        label: "Total:",
                        value: `₹${selectedOrder.finalAmount.toFixed(2)}`,
                        isTotal: true,
                      },
                    ].map((it, i) => (
                      <div className={s.summary.totalItem(it.isTotal)} key={i}>
                        <span className={s.summary.totalLabel}>{it.label}</span>
                        <span className={s.summary.totalValue(it.isTotal)}>
                          {it.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={s.modal.section}>
                <h3 className={s.modal.sectionTitle}>
                  <CreditCardIcon className={s.modal.sectionIcon} />
                  Payment Information
                </h3>

                <div className={s.modal.sectionContent}>
                  {[
                    {
                      label: "Method:",
                      value: selectedOrder.paymentMethod,
                      color:
                        selectedOrder.paymentMethod === "Online Payment"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800",
                    },
                    {
                      label: "Status:",
                      value: selectedOrder.paymentStatus,
                      color:
                        selectedOrder.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800",
                    },
                  ].map((it, i) => (
                    <div className={s.paymentInfoItem} key={i}>
                      <span className={s.paymentLabel}>{it.label}</span>
                      <span className={s.paymentBadgeModal(it.color)}>
                        {it.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.modal.section}>
                <h3 className={s.modal.title}>
                  <Edit className={s.modal.sectionIcon} />
                  Update Order Status
                </h3>

                <div>
                  <label className={s.statusLabel}>Order Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedOrder({
                        ...selectedOrder,
                        orderStatus: newStatus,
                      });
                      updateStatus(selectedOrder._id, newStatus);
                    }}
                    className={s.statusSelect}
                  >
                    {statusOptions.map((opt) => (
                      <option value={opt.value} key={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className={s.modal.footer}>
              <button
                onClick={() => setSelectedOrder(null)}
                className={s.modal.footerButtonClose}
              >
                Close
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className={s.modal.footerButtonSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
