// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            inventory: true,
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: {
                url: true,
                alt: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            price: true,
            inventory: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      items: cartItems,
    });
  } catch (error: any) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId, status: "ACTIVE" },
      include: {
        variants: variantId ? { where: { id: variantId } } : false,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check inventory
    const availableInventory = variantId
      ? product.variants[0]?.inventory || 0
      : product.inventory;

    if (availableInventory < quantity) {
      return NextResponse.json(
        { error: "Not enough items in stock" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: session.user.id,
          productId,
          variantId: variantId || null,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > availableInventory) {
        return NextResponse.json(
          { error: "Not enough items in stock" },
          { status: 400 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              inventory: true,
              images: {
                take: 1,
                orderBy: { position: "asc" },
                select: {
                  url: true,
                  alt: true,
                },
              },
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              price: true,
              inventory: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        item: updatedItem,
        message: "Cart updated successfully",
      });
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          variantId: variantId || undefined,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              inventory: true,
              images: {
                take: 1,
                orderBy: { position: "asc" },
                select: {
                  url: true,
                  alt: true,
                },
              },
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              price: true,
              inventory: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        item: cartItem,
        message: "Item added to cart",
      });
    }
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, quantity } = await request.json();

    if (!itemId || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid item ID or quantity" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: { select: { inventory: true } },
        variant: { select: { inventory: true } },
      },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Check inventory
    const availableInventory =
      cartItem.variant?.inventory || cartItem.product.inventory;

    if (quantity > availableInventory) {
      return NextResponse.json(
        { error: "Not enough items in stock" },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            inventory: true,
            images: {
              take: 1,
              orderBy: { position: "asc" },
              select: {
                url: true,
                alt: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            price: true,
            inventory: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: "Cart updated successfully",
    });
  } catch (error: any) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem || cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error: any) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
