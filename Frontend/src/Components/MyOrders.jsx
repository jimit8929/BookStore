import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  CreditCard,
  DollarSign,
  MapPin,
} from "lucide-react";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";

const BASE_URL = "http://localhost:5000";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
      iconColor: "text-yellow-500",
    },
    {
      value: "processing",
      label: "Processing",
      icon: Package,
      color: "bg-blue-100 text-blue-800",
      iconColor: "text-blue-500",
    },
    {
      value: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "bg-indigo-100 text-indigo-800",
      iconColor: "text-indigo-500",
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
      iconColor: "text-green-500",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "bg-red-100 text-red-800",
      iconColor: "text-red-500",
    },
  ];

  // helper: get safe image url
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BASE_URL}${path}`;
  };

  // Fetch All Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get(`${BASE_URL}/api/order/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Support both payload shapes: array or { orders: [...] }
        const ordersData = Array.isArray(data) ? data : data?.orders ?? data;
        if (!Array.isArray(ordersData)) {
          console.warn("Unexpected orders payload", data);
          setOrders([]);
        } else {
          setOrders(ordersData);
        }
      } catch (err) {
        console.error("Failed to load user orders", err);
        if (err?.response?.status === 401) {
          setError("Unauthorized. Please login again.");
          // optional: clear token / redirect
          // localStorage.removeItem('authToken');
          // window.location.href = '/login';
        } else {
          setError("Failed to load orders. Try again later.");
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Apply sorting
  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return orders;
    return [...orders].sort((a, b) => {
      let aVal = a[sortConfig.key],
        bVal = b[sortConfig.key];
      // handle placedAt date sorting
      if (sortConfig.key === "placedAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      return 0;
    });
  }, [orders, sortConfig]);

  const StatusBadge = ({ status }) => {
    if (!status) return null;
    const opt = statusOptions.find(
      (o) => o.value.toLowerCase() === status.toLowerCase()
    );
    if (!opt)
      return (
        <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          {status}
        </div>
      );
    const Icon = opt.icon;
    return (
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${opt.color}`}
      >
        <Icon className={`w-4 h-4 ${opt.iconColor}`} />
        <span>{opt.label}</span>
      </div>
    );
  };

  // View one Order Full Details
  const viewDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(`${BASE_URL}/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to load order details:", error);
      alert("Failed to load order details. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br pt-28 from-[#43C6AC]/90 to-[#2B5876]/90 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-[#1A237E] hover:text-[#43C6AC] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>
            <h1 className="text-3xl font-bold text-center flex-1 bg-white bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">Loading orders...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white">
                    <tr>
                      {[
                        { key: "orderId", label: "Order ID" },
                        { key: "placedAt", label: "Date" },
                        { key: "finalAmount", label: "Amount" },
                        { key: null, label: "Payment" },
                        { key: null, label: "Status" },
                        { key: null, label: "Actions" },
                      ].map((col) => (
                        <th
                          key={col.key || col.label}
                          className="px-6 py-4 text-left cursor-pointer"
                          onClick={() => col.key && handleSort(col.key)}
                        >
                          <div className="flex items-center">
                            {col.label}
                            {col.key &&
                              sortConfig.key === col.key &&
                              (sortConfig.direction === "asc" ? (
                                <ChevronUp className="ml-1" />
                              ) : (
                                <ChevronDown className="ml-1" />
                              ))}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedOrders.map((o) => (
                      <tr key={o._id || o.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {o.orderId}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(o.placedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₹{Number(o.finalAmount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              o.paymentMethod === "Online Payment"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {o.paymentMethod === "Online Payment" ? (
                              <CreditCard className="w-4 h-4" />
                            ) : (
                              <DollarSign className="w-4 h-4" />
                            )}
                            <span>
                              {o.paymentMethod === "Online Payment"
                                ? "Online"
                                : "COD"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={o.orderStatus} />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => viewDetails(o._id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white rounded-lg text-xs hover:opacity-90 transition-opacity"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Empty State */}
              {!loading && !error && !sortedOrders.length && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Package className="text-gray-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No orders found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    You haven't placed any orders yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Details: {selectedOrder.orderId}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Ordered on{" "}
                    {new Date(selectedOrder.placedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Information */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Shipping Information
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress?.street},{" "}
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state}{" "}
                      {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-gray-600 text-sm">
                          Estimated 3-5 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Order Summary
                  </h3>
                  <div className="space-y-6">
                    {(selectedOrder.books || []).map((book, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-4 border-b pb-4"
                      >
                        {/* Book image */}
                        <img
                          src={getImageUrl(book.image)}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />

                        {/* Book metadata */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {book.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Author: {book.author}
                          </p>
                        </div>

                        {/* Quantity & price */}
                        <div className="text-right">
                          <p className="font-medium">Qty: {book.quantity}</p>
                          <p className="text-gray-500 text-sm">
                            ₹{Number(book.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Totals */}
                    <div className="pt-4 space-y-2">
                      {[
                        {
                          label: "Subtotal:",
                          value: `₹${Number(
                            selectedOrder.totalAmount || 0
                          ).toFixed(2)}`,
                        },
                        {
                          label: "Shipping:",
                          value: `₹${Number(
                            selectedOrder.shippingCharge || 0
                          ).toFixed(2)}`,
                        },
                        {
                          label: "Tax (5%):",
                          value: `₹${Number(
                            selectedOrder.taxAmount || 0
                          ).toFixed(2)}`,
                        },
                        {
                          label: "Total:",
                          value: `₹${Number(
                            selectedOrder.finalAmount || 0
                          ).toFixed(2)}`,
                          className:
                            "font-bold text-lg text-[#1A237E] pt-2 border-t",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between ${
                            item.className || ""
                          }`}
                        >
                          <span className="text-gray-600">{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          selectedOrder.paymentMethod === "Online Payment"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          selectedOrder.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Order Status
                  </h3>
                  <div className="flex items-center">
                    <StatusBadge status={selectedOrder.orderStatus} />
                  </div>
                </div>
              </div>

              <div className="border-t p-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
