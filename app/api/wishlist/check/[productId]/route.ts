// app/api/wishlist/check/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        inWishlist: false,
      });
    }

    // Real implementation (uncomment when Wishlist model is added):
    /*
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: params.productId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      inWishlist: !!wishlistItem,
    });
    */

    // Temporary implementation
    return NextResponse.json({
      success: true,
      inWishlist: false,
    });
  } catch (error: any) {
    console.error("Check wishlist error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
