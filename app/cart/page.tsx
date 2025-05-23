"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Alert, AlertDescription } from "@/components/ui/alert";
import GrowingPlantLoader from "@/components/ui/GrowingPlantLoader";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    inventory: number;
    images: {
      url: string;
      alt: string;
    }[];
  };
  variant?: {
    id: string;
    name: string;
    price: number;
    inventory: number;
  };
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin?callbackUrl=/cart");
      return;
    }

    fetchCartItems();
  }, [session, status, router]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const maxQuantity = item.variant?.inventory || item.product.inventory;
    if (newQuantity > maxQuantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${maxQuantity} items available`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(itemId);
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId);
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: "Item Removed",
          description: "Item removed from cart",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const moveToWishlist = async (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    try {
      setUpdating(itemId);

      // Add to wishlist
      const wishlistResponse = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.product.id }),
      });

      if (wishlistResponse.ok) {
        // Remove from cart
        await removeItem(itemId);
        toast({
          title: "Moved to Wishlist",
          description: "Item moved to your wishlist",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to move to wishlist",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      setApplyingPromo(true);
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, total: subtotal }),
      });

      if (response.ok) {
        const data = await response.json();
        setPromoDiscount(data.discount);
        toast({
          title: "Promo Code Applied",
          description: `You saved ₹${data.discount}`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Invalid Promo Code",
          description: error.message || "Promo code is not valid",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to apply promo code",
        variant: "destructive",
      });
    } finally {
      setApplyingPromo(false);
    }
  };

  const proceedToCheckout = () => {
    router.push("/checkout");
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 999 ? 0 : 50; // Free shipping over ₹999
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const discount = promoDiscount;
  const total = subtotal + shipping + tax - discount;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <GrowingPlantLoader />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button className="bg-green-700 hover:bg-green-800">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const price = item.variant?.price || item.product.price;
              const comparePrice = item.product.comparePrice;
              const inventory =
                item.variant?.inventory || item.product.inventory;
              const isOutOfStock = inventory <= 0;
              const isLowStock = inventory <= 5 && inventory > 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${isOutOfStock ? "opacity-60" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={
                              item.product.images[0]?.url ||
                              "/placeholder-product.jpg"
                            }
                            alt={
                              item.product.images[0]?.alt || item.product.name
                            }
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link href={`/products/${item.product.slug}`}>
                                <h3 className="font-semibold text-gray-900 hover:text-green-700 transition-colors line-clamp-2">
                                  {item.product.name}
                                </h3>
                              </Link>
                              {item.variant && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.variant.name}
                                </p>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveToWishlist(item.id)}
                                disabled={updating === item.id}
                                className="text-gray-500 hover:text-green-700"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                disabled={updating === item.id}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Stock Status */}
                          {isOutOfStock && (
                            <Alert className="mb-3">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                This item is currently out of stock
                              </AlertDescription>
                            </Alert>
                          )}

                          {isLowStock && !isOutOfStock && (
                            <p className="text-sm text-orange-600 mb-2">
                              Only {inventory} left in stock
                            </p>
                          )}

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-green-700">
                                  ₹{price.toLocaleString()}
                                </span>
                                {comparePrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{comparePrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                Total: ₹
                                {(price * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={
                                    updating === item.id || item.quantity <= 1
                                  }
                                  className="px-3 h-8"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 text-center min-w-12">
                                  {updating === item.id ? "..." : item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={
                                    updating === item.id ||
                                    item.quantity >= inventory
                                  }
                                  className="px-3 h-8"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button
                    onClick={applyPromoCode}
                    disabled={applyingPromo || !promoCode.trim()}
                    variant="outline"
                  >
                    {applyingPromo ? "..." : "Apply"}
                  </Button>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Promo discount:</span>
                    <span className="text-green-600 font-medium">
                      -₹{discount.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      Add ₹{(1000 - subtotal).toLocaleString()} more for FREE
                      shipping!
                    </p>
                  </div>
                )}

                <Button
                  onClick={proceedToCheckout}
                  className="w-full bg-green-700 hover:bg-green-800 h-12"
                  disabled={cartItems.some(
                    (item) =>
                      (item.variant?.inventory || item.product.inventory) <= 0
                  )}
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="text-center">
                  <Link href="/products">
                    <Button
                      variant="ghost"
                      className="text-green-700 hover:text-green-800"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-700" />
                    <div>
                      <p className="font-medium text-sm">Free Shipping</p>
                      <p className="text-xs text-gray-600">
                        On orders over ₹999
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-700" />
                    <div>
                      <p className="font-medium text-sm">Secure Payment</p>
                      <p className="text-xs text-gray-600">
                        100% secure transactions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <RotateCcw className="h-5 w-5 text-green-700" />
                    <div>
                      <p className="font-medium text-sm">Easy Returns</p>
                      <p className="text-xs text-gray-600">
                        7-day return policy
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
