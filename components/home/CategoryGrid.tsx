import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null, // Only get top-level categories
      },
      include: {
        products: {
          where: { status: "ACTIVE" },
          select: { id: true },
        },
      },
      orderBy: { name: "asc" },
      take: 6,
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoryGrid() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600">
              No categories available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Categories
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of product categories and find exactly
            what you&ambs;re looking for
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const productCount = category.products.length;
            const isLarge = index === 0 || index === 3; // Make first and fourth cards larger

            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card
                  className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 cursor-pointer ${
                    isLarge ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      isLarge ? "aspect-[4/5]" : "aspect-square"
                    } bg-gradient-to-br from-gray-100 to-gray-200`}
                  >
                    {/* Category Image */}
                    <Image
                      src={category.image || "/api/placeholder/600/600"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="text-white space-y-3">
                        <h3 className="text-2xl font-bold group-hover:translate-y-[-4px] transition-transform duration-300">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="text-white/90 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {category.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm">
                            {productCount}{" "}
                            {productCount === 1 ? "Product" : "Products"}
                          </span>

                          <div className="flex items-center gap-2 text-white group-hover:translate-x-2 transition-transform duration-300">
                            <span className="text-sm font-medium">
                              Shop Now
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Categories */}
        {categories.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
            >
              View All Categories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
