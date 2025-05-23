"use client";

import { useState, useEffect, SetStateAction } from "react";
import { motion } from "framer-motion";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Package,
  Leaf,
  Award,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import GrowingPlantLoader from "@/components/ui/GrowingPlantLoader";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  inventory: number;
  weight?: number;
  dimensions?: string;
  tags?: string;
  isFeatured: boolean;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    alt: string;
    position: number;
  }[];
  variants: {
    id: string;
    name: string;
    price: number;
    inventory: number;
    options: unknown;
  }[];
  testimonials: {
    id: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      image?: string;
    };
  }[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: session } = useSession();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [slug]);

  useEffect(() => {
    if (session && product) {
      checkWishlistStatus();
    }
  }, [session, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        throw new Error("Product not found");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products/${slug}/related`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch related products:", error);
    }
  };

  const checkWishlistStatus = async () => {
    if (!session || !product) return;

    try {
      const response = await fetch(`/api/wishlist/check/${product.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  const addToWishlist = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: isInWishlist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?.id }),
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        toast({
          title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
          description: isInWishlist
            ? "Product removed from your wishlist"
            : "Product added to your wishlist",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  const addToCart = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          variantId: selectedVariant,
          quantity,
        }),
      });

      if (response.ok) {
        toast({
          title: "Added to Cart",
          description: `${quantity} item(s) added to your cart`,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const submitReview = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to write a review",
        variant: "destructive",
      });
      return;
    }

    if (!reviewContent.trim()) {
      toast({
        title: "Review Required",
        description: "Please write a review",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          rating: reviewRating,
          title: reviewTitle,
          content: reviewContent,
        }),
      });

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Your review has been submitted and is pending approval",
        });
        setReviewTitle("");
        setReviewContent("");
        setReviewRating(5);
        fetchProduct(); // Refresh to show new review
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <GrowingPlantLoader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating =
    product.testimonials.length > 0
      ? product.testimonials.reduce((sum, t) => sum + t.rating, 0) /
        product.testimonials.length
      : 0;

  const isOutOfStock = product.inventory <= 0;
  const discountPercentage = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const currentPrice = selectedVariant
    ? product.variants.find((v) => v.id === selectedVariant)?.price ||
      product.price
    : product.price;

  const currentInventory = selectedVariant
    ? product.variants.find((v) => v.id === selectedVariant)?.inventory ||
      product.inventory
    : product.inventory;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-700">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-green-700"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={
                  product.images[selectedImageIndex]?.url ||
                  "/placeholder-product.jpg"
                }
                alt={product.images[selectedImageIndex]?.alt || product.name}
                fill
                className="object-cover"
              />

              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-green-700 hover:bg-green-800">
                  Featured
                </Badge>
              )}

              {discountPercentage > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-600 hover:bg-red-700">
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImageIndex === index
                        ? "border-green-700"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {product.shortDescription}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({product.testimonials.length}{" "}
                reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-green-700">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {currentInventory} in stock
              </p>
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Options</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant === variant.id}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="text-green-700 focus:ring-green-700"
                      />
                      <span className="text-sm">
                        {variant.name} - ₹{variant.price.toLocaleString()}
                        {variant.inventory <= 0 && (
                          <span className="text-red-500 ml-2">
                            (Out of Stock)
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-16">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(currentInventory, quantity + 1))
                    }
                    className="px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: ₹{(currentPrice * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={addToCart}
                  disabled={isOutOfStock || currentInventory <= 0}
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white h-12"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  onClick={addToWishlist}
                  variant="outline"
                  className="h-12 px-4"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist ? "fill-current text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  onClick={shareProduct}
                  variant="outline"
                  className="h-12 px-4"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {!isOutOfStock && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ In stock and ready to ship
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-700" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-700" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-green-700" />
                <span className="text-sm text-gray-600">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.testimonials.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description || product.shortDescription}
                    </p>

                    {product.tags && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.split(",").map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Product Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span>{product.category.name}</span>
                        </div>
                        {product.weight && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span>{product.weight}g</span>
                          </div>
                        )}
                        {product.dimensions && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dimensions:</span>
                            <span>{product.dimensions}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Availability:</span>
                          <span
                            className={
                              isOutOfStock ? "text-red-500" : "text-green-600"
                            }
                          >
                            {isOutOfStock ? "Out of Stock" : "In Stock"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Certifications</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Leaf className="h-4 w-4 text-green-700" />
                          <span className="text-sm">100% Organic</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-green-700" />
                          <span className="text-sm">Quality Certified</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-700" />
                          <span className="text-sm">Safety Assured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-700 mb-2">
                          {averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(averageRating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          Based on {product.testimonials.length} reviews
                        </p>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = product.testimonials.filter(
                            (t) => t.rating === rating
                          ).length;
                          const percentage =
                            product.testimonials.length > 0
                              ? (count / product.testimonials.length) * 100
                              : 0;

                          return (
                            <div
                              key={rating}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-sm w-6">{rating}</span>
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Write Review */}
                {session && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Rating
                        </label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setReviewRating(rating)}
                              className="p-1"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating <= reviewRating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Title (Optional)
                        </label>
                        <Input
                          value={reviewTitle}
                          onChange={(e: {
                            target: { value: SetStateAction<string> };
                          }) => setReviewTitle(e.target.value)}
                          placeholder="Brief summary of your review"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Review
                        </label>
                        <Textarea
                          value={reviewContent}
                          onChange={(e: {
                            target: { value: SetStateAction<string> };
                          }) => setReviewContent(e.target.value)}
                          placeholder="Share your experience with this product"
                          rows={4}
                        />
                      </div>

                      <Button
                        onClick={submitReview}
                        disabled={submittingReview || !reviewContent.trim()}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.testimonials.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.user.image} />
                            <AvatarFallback>
                              {review.user.firstName[0]}
                              {review.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">
                                  {review.user.firstName} {review.user.lastName}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {review.title && (
                              <h5 className="font-medium mb-2">
                                {review.title}
                              </h5>
                            )}

                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {product.testimonials.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to review this product
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={
                        relatedProduct.images[0]?.url ||
                        "/placeholder-product.jpg"
                      }
                      alt={relatedProduct.name}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/products/${relatedProduct.slug}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-2">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-700">
                        ₹{relatedProduct.price.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        className="bg-green-700 hover:bg-green-800"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
