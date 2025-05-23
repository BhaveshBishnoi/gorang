"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Download,
  RotateCcw,
  Star,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GrowingPlantLoader from "@/components/ui/GrowingPlantLoader";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: {
        url: string;
        alt: string;
      }[];
    };
    variant?: {
      name: string;
    };
  }[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin?callbackUrl=/orders");
      return;
    }

    fetchOrders();
  }, [session, status, router, statusFilter, sortBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(statusFilter !== "all" && { status: statusFilter }),
        sortBy,
      });

      const response = await fetch(`/api/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "confirmed":
        return <Package className="h-5 w-5 text-purple-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const ordersByStatus = {
    all: filteredOrders,
    pending: filteredOrders.filter(
      (order) => order.status.toLowerCase() === "pending"
    ),
    confirmed: filteredOrders.filter(
      (order) => order.status.toLowerCase() === "confirmed"
    ),
    processing: filteredOrders.filter(
      (order) => order.status.toLowerCase() === "processing"
    ),
    shipped: filteredOrders.filter(
      (order) => order.status.toLowerCase() === "shipped"
    ),
    delivered: filteredOrders.filter(
      (order) => order.status.toLowerCase() === "delivered"
    ),
    cancelled: filteredOrders.filter(
      (order) => order.status.toLowerCase() === "cancelled"
    ),
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <GrowingPlantLoader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (orders.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No orders yet
            </h1>
            <p className="text-gray-600 mb-8">
              When you place your first order, it will appear here.
            </p>
            <Link href="/products">
              <Button className="bg-green-700 hover:bg-green-800">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 mb-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                <SelectItem value="amount-low">Amount: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Orders Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">
                All ({ordersByStatus.all.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({ordersByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({ordersByStatus.confirmed.length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({ordersByStatus.processing.length})
              </TabsTrigger>
              <TabsTrigger value="shipped">
                Shipped ({ordersByStatus.shipped.length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered ({ordersByStatus.delivered.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({ordersByStatus.cancelled.length})
              </TabsTrigger>
            </TabsList>

            {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {statusOrders.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No {status === "all" ? "" : status} orders found
                        </h3>
                        <p className="text-gray-600">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : "Orders will appear here when available"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  statusOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(order.status)}
                              <div>
                                <h3 className="font-semibold text-lg">
                                  Order #{order.orderNumber}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Placed on{" "}
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <Badge
                                className={getPaymentStatusColor(
                                  order.paymentStatus
                                )}
                              >
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          {/* Order Items */}
                          <div className="space-y-3 mb-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-4"
                              >
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <Image
                                    src={
                                      item.product.images[0]?.url ||
                                      "/placeholder-product.jpg"
                                    }
                                    alt={
                                      item.product.images[0]?.alt ||
                                      item.product.name
                                    }
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <Link href={`/products/${item.product.slug}`}>
                                    <h4 className="font-medium text-gray-900 hover:text-green-700 transition-colors line-clamp-1">
                                      {item.product.name}
                                    </h4>
                                  </Link>
                                  {item.variant && (
                                    <p className="text-sm text-gray-600">
                                      {item.variant.name}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity} × ₹
                                    {item.price.toLocaleString()}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="font-medium">
                                    ₹{item.total.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="border-t pt-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Shipping to: {order.shippingAddress.firstName}{" "}
                                  {order.shippingAddress.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.shippingAddress.address1},{" "}
                                  {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.state}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-lg font-bold text-green-700 mb-2">
                                  Total: ₹{order.total.toLocaleString()}
                                </p>
                                <div className="flex space-x-2">
                                  <Link href={`/orders/${order.id}`}>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                  </Link>

                                  {order.status.toLowerCase() ===
                                    "delivered" && (
                                    <Button variant="outline" size="sm">
                                      <Star className="h-4 w-4 mr-2" />
                                      Review
                                    </Button>
                                  )}

                                  {["pending", "confirmed"].includes(
                                    order.status.toLowerCase()
                                  ) && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel
                                    </Button>
                                  )}

                                  {order.status.toLowerCase() ===
                                    "delivered" && (
                                    <Button variant="outline" size="sm">
                                      <RotateCcw className="h-4 w-4 mr-2" />
                                      Return
                                    </Button>
                                  )}

                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Invoice
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
