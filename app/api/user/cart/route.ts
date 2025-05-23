// app/api/user/cart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: true,
          },
        },
        variant: true,
      },
    });

    return NextResponse.json({ items: cartItems }, { status: 200 });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, variantId, quantity } = await request.json();

    if (!productId || quantity <= 0) {
      return NextResponse.json(
        { message: "Product ID and valid quantity are required" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      // Update existing item
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: true,
            },
          },
          variant: true,
        },
      });
      return NextResponse.json(updatedItem, { status: 200 });
    } else {
      // Create new item
      const newItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
          variant: true,
        },
      });
      return NextResponse.json(newItem, { status: 201 });
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId, quantity } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: {
          id: itemId,
          userId: session.user.id, // Ensure user owns this item
        },
      });
      return NextResponse.json({ message: "Item removed" }, { status: 200 });
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: itemId,
          userId: session.user.id, // Ensure user owns this item
        },
        data: { quantity },
        include: {
          product: {
            include: {
              images: true,
            },
          },
          variant: true,
        },
      });
      return NextResponse.json(updatedItem, { status: 200 });
    }
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: itemId,
        userId: session.user.id, // Ensure user owns this item
      },
    });

    return NextResponse.json({ message: "Item removed" }, { status: 200 });
  } catch (error) {
    console.error("Remove item error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
