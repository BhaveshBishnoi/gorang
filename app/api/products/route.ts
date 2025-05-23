// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const search = searchParams.get("search");
    const categories = searchParams.get("categories")?.split(",");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const sortBy = searchParams.get("sortBy") || "name";
    const inStock = searchParams.get("inStock") === "true";
    const featured = searchParams.get("featured") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "ACTIVE",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categories && categories.length > 0) {
      where.categoryId = { in: categories };
    }

    if (minPrice > 0 || maxPrice < 999999) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (inStock) {
      where.inventory = { gt: 0 };
    }

    if (featured) {
      where.isFeatured = true;
    }

    // Build orderBy clause

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sortBy) {
      case "name":
        orderBy = { name: "asc" };
        break;
      case "-name":
        orderBy = { name: "desc" };
        break;
      case "price":
        orderBy = { price: "asc" };
        break;
      case "-price":
        orderBy = { price: "desc" };
        break;
      case "createdAt":
        orderBy = { createdAt: "asc" };
        break;
      case "-createdAt":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { name: "asc" };
    }

    // Fetch products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { position: "asc" },
          },
          testimonials: {
            where: { isApproved: true },
            select: { rating: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: error || "Something went wrong" },
      { status: 500 }
    );
  }
}
