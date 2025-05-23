"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Star,
  Trash2,
  Share2,
  Eye,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GrowingPlantLoader from "@/components/ui/GrowingPlantLoader";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    inventory: number;
    isFeatured: boolean;
    images: {
      url: string;
      alt: string;
    }[];
    category: {
      name: string;
      slug: string;
    };
    testimonials: {
      rating: number;
    }[];
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wishlist");
      return;
    }

    fetchWishlistItems();
  }, [session, status, router]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load wishlist items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      setRemoving(itemId);
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: "Removed from Wishlist",
          description: "Item removed from your wishlist",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        toast({
          title: "Added to Cart",
          description: "Item added to your cart",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const shareProduct = async (product: WishlistItem["product"]) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url: `${window.location.origin}/products/${product.slug}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/products/${product.slug}`
      );
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const getAverageRating = (testimonials: { rating: number }[]) => {
    if (!testimonials.length) return 0;
    return (
      testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
    );
  };

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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and never lose track of them.
            </p>
            <Link href="/products">
              <Button className="bg-green-700 hover:bg-green-800">
                <Package className="h-4 w-4 mr-2" />
                Explore Products
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved for later
          </p>
        </motion.div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => {
            const { product } = item;
            const averageRating = getAverageRating(product.testimonials);
            const isOutOfStock = product.inventory <= 0;
            const discountPercentage = product.comparePrice
              ? Math.round(
                  ((product.comparePrice - product.price) /
                    product.comparePrice) *
                    100
                )
              : 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-square">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={
                          product.images[0]?.url || "/placeholder-product.jpg"
                        }
                        alt={product.images[0]?.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {product.isFeatured && (
                      <Badge className="absolute top-3 left-3 bg-green-700 hover:bg-green-800">
                        Featured
                      </Badge>
                    )}

                    {discountPercentage > 0 && (
                      <Badge className="absolute top-3 right-3 bg-red-600 hover:bg-red-700">
                        -{discountPercentage}%
                      </Badge>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">Out of Stock</Badge>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={removing === item.id}
                      >
                        {removing === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => shareProduct(product)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs mb-2">
                        {product.category.name}
                      </Badge>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.testimonials.length})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-green-700">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {isOutOfStock ? (
                        <span className="text-sm text-red-600 font-medium">
                          Out of Stock
                        </span>
                      ) : product.inventory <= 5 ? (
                        <span className="text-sm text-orange-600 font-medium">
                          Only {product.inventory} left
                        </span>
                      ) : (
                        <span className="text-sm text-green-600 font-medium">
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(product.id)}
                        disabled={isOutOfStock || addingToCart === product.id}
                        className="flex-1 bg-green-700 hover:bg-green-800 h-9"
                        size="sm"
                      >
                        {addingToCart === product.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <Link href={`/products/${product.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 h-9"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 mt-3">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-50"
            >
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
