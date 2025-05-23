// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Get wishlist items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, we'll create a simple wishlist table
    // You'll need to add this to your Prisma schema:
    /*
    model Wishlist {
      id        String   @id @default(cuid())
      userId    String
      productId String
      createdAt DateTime @default(now())
      
      user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
      product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
      
      @@unique([userId, productId])
      @@map("wishlists")
    }
    */

    // For now, we'll simulate wishlist data using a simple approach
    // You should add the Wishlist model to your schema and uncomment the real implementation

    /*
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: {
                url: true,
                alt: true,
              },
            },
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            testimonials: {
              where: { isApproved: true },
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    */

    // Temporary implementation - return empty array
    const wishlistItems: any[] = [];

    return NextResponse.json({
      success: true,
      items: wishlistItems,
    });
  } catch (error: any) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId, status: "ACTIVE" },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Real implementation (uncomment when Wishlist model is added):
    /*
    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Item already in wishlist" },
        { status: 400 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: {
                url: true,
                alt: true,
              },
            },
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            testimonials: {
              where: { isApproved: true },
              select: { rating: true },
            },
          },
        },
      },
    });
    */

    return NextResponse.json({
      success: true,
      message: "Item added to wishlist",
      // item: wishlistItem,
    });
  } catch (error: any) {
    console.error("Add to wishlist error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, productId } = await request.json();

    if (!itemId && !productId) {
      return NextResponse.json(
        { error: "Item ID or Product ID is required" },
        { status: 400 }
      );
    }

    // Real implementation (uncomment when Wishlist model is added):
    /*
    if (itemId) {
      // Remove by wishlist item ID
      const wishlistItem = await prisma.wishlist.findUnique({
        where: { id: itemId },
      });

      if (!wishlistItem || wishlistItem.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Wishlist item not found" },
          { status: 404 }
        );
      }

      await prisma.wishlist.delete({
        where: { id: itemId },
      });
    } else if (productId) {
      // Remove by product ID
      await prisma.wishlist.deleteMany({
        where: {
          userId: session.user.id,
          productId,
        },
      });
    }
    */

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error: any) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
