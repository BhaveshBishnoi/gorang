import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import  prisma  from "@/lib/prisma";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 1,
        },
        category: true,
        testimonials: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">
              No featured products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Best Sellers
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our hand-picked selection of premium products that our
            customers love most
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product) => {
            const averageRating =
              product.testimonials.length > 0
                ? product.testimonials.reduce((acc, t) => acc + t.rating, 0) /
                  product.testimonials.length
                : 0;

            const mainImage =
              product.images[0]?.url || "/api/placeholder/300/300";
            const originalPrice = product.comparePrice
              ? Number(product.comparePrice)
              : null;
            const currentPrice = Number(product.price);
            const discount = originalPrice
              ? Math.round(
                  ((originalPrice - currentPrice) / originalPrice) * 100
                )
              : 0;

            return (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white"
              >
                <div className="relative overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                        -{discount}%
                      </Badge>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-10 h-10 p-0 rounded-full shadow-lg"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-10 h-10 p-0 rounded-full shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quick Add to Cart */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button className="w-full bg-black/80 hover:bg-black text-white backdrop-blur-sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Category */}
                  <div className="text-sm text-gray-500 mb-2">
                    {product.category.name}
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
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
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${currentPrice.toFixed(2)}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.inventory < 10 && product.inventory > 0 && (
                    <div className="text-sm text-orange-600 mt-2">
                      Only {product.inventory} left in stock
                    </div>
                  )}
                  {product.inventory === 0 && (
                    <div className="text-sm text-red-600 mt-2">
                      Out of stock
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="hover:bg-gray-50"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
