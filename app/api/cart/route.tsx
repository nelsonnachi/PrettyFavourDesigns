import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";

import {
  carts,
  cartItems,
} from "@/db/schema/carts";

import {
  ApiError,
  handleApiError,
} from "@/lib/APIs/api-errors";

import {
  addToCartSchema,
} from "@/lib/validations";

import {
  getOrCreateCart,
} from "@/lib/APIs/cart";

// ============================================================
// GET CART
// ============================================================

export async function GET() {
  try {
    const { cart } = await getOrCreateCart();

    // --------------------------------------------------------
    // Get cart items
    // --------------------------------------------------------

    const items =
      await db.query.cartItems.findMany({
        where: {
          cartId: cart.id,
        },

        columns: {
          id: true,
          quantity: true,
        },

        with: {
          // --------------------------------------------------
          // PRODUCT
          // --------------------------------------------------

          product: {
            columns: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              price: true,
            },

            with: {
              images: {
                columns: {
                  url: true,
                },

                where: {
                  isPrimary: true,
                },

                limit: 1,
              },
            },
          },

          // --------------------------------------------------
          // VARIANT
          // --------------------------------------------------

          variant: {
            columns: {
              id: true,
              sku: true,
              stock: true,
              reservedStock: true,
            },

            // ------------------------------------------------
            // COLOR
            // ------------------------------------------------

            with: {
              color: {
                columns: {
                  id: true,
                  name: true,
                  hexCode: true,
                },
              },
            },
          },
        },
      });

    // --------------------------------------------------------
    // CART TOTALS
    // --------------------------------------------------------

    let subtotal = 0;
    let totalItems = 0;

    // --------------------------------------------------------
    // FORMAT CART ITEMS
    // --------------------------------------------------------

    const formattedItems = items.map((item) => {
      // ------------------------------------------------------
      // Make sure product exists
      // ------------------------------------------------------

      if (!item.product) {
        throw new ApiError(
          "Product associated with this cart item was not found",
          404,
        );
      }

      // ------------------------------------------------------
      // Make sure variant exists
      // ------------------------------------------------------

      if (!item.variant) {
        throw new ApiError(
          "Product variant associated with this cart item was not found",
          404,
        );
      }

      // ------------------------------------------------------
      // Make sure color exists
      // ------------------------------------------------------

      if (!item.variant.color) {
        throw new ApiError(
          "Product color associated with this cart item was not found",
          404,
        );
      }

      // ------------------------------------------------------
      // Product price
      // ------------------------------------------------------

      const price = Number(
        item.product.price,
      );

      // ------------------------------------------------------
      // Item subtotal
      // ------------------------------------------------------

      const itemSubtotal =
        price * item.quantity;

      subtotal += itemSubtotal;

      totalItems += item.quantity;

      // ------------------------------------------------------
      // Available stock
      // ------------------------------------------------------

      const availableStock =
        Math.max(
          item.variant.stock -
            item.variant.reservedStock,
          0,
        );

      // ------------------------------------------------------
      // Return formatted item
      // ------------------------------------------------------

      return {
        id: item.id,

        quantity: item.quantity,

        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          sku: item.product.sku,
          price,
          imageUrl:
            item.product.images[0]?.url ??
            null,
        },

        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
          stock: item.variant.stock,
          reservedStock:
            item.variant.reservedStock,
          availableStock,

          color: {
            id: item.variant.color.id,
            name: item.variant.color.name,
            hexCode:
              item.variant.color.hexCode,
          },
        },

        subtotal: itemSubtotal,
      };
    });

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,

      data: {
        id: cart.id,
        items: formattedItems,

        totalItems,

        subtotal,

        itemCount:
          formattedItems.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================================
// ADD TO CART
// ============================================================

export async function POST(
  request: NextRequest,
) {
  try {
    // --------------------------------------------------------
    // Get or create cart
    // --------------------------------------------------------

    const { cart } =
      await getOrCreateCart();

    // --------------------------------------------------------
    // Read request body
    // --------------------------------------------------------

    const body =
      await request.json();

    // --------------------------------------------------------
    // Validate request
    // --------------------------------------------------------

    const data =
      addToCartSchema.parse(body);

    // --------------------------------------------------------
    // Find selected variant
    // --------------------------------------------------------

    const variant =
      await db.query.productVariants.findFirst({
        where: {
          id: data.variantId,
          productId: data.productId,
        },

        columns: {
          id: true,
          productId: true,
          stock: true,
          reservedStock: true,
        },

        with: {
          // --------------------------------------------------
          // PRODUCT
          // --------------------------------------------------

          product: {
            columns: {
              id: true,
              name: true,
              price: true,
              status: true,
              deletedAt: true,
            },
          },

          // --------------------------------------------------
          // COLOR
          // --------------------------------------------------

          color: {
            columns: {
              id: true,
              name: true,
              hexCode: true,
              isActive: true,
            },
          },
        },
      });

    // --------------------------------------------------------
    // Variant must exist
    // --------------------------------------------------------

    if (!variant) {
      throw new ApiError(
        "Product variant not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Product must exist
    // --------------------------------------------------------

    if (!variant.product) {
      throw new ApiError(
        "Product associated with this variant was not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Color must exist
    // --------------------------------------------------------

    if (!variant.color) {
      throw new ApiError(
        "Product color associated with this variant was not found",
        404,
      );
    }

    // --------------------------------------------------------
    // Product must not be deleted
    // --------------------------------------------------------

    if (variant.product.deletedAt) {
      throw new ApiError(
        "This product is no longer available",
        400,
      );
    }

    // --------------------------------------------------------
    // Product must be active
    // --------------------------------------------------------

    if (
      variant.product.status !==
      "active"
    ) {
      throw new ApiError(
        "This product is not available for purchase",
        400,
      );
    }

    // --------------------------------------------------------
    // Color must be active
    // --------------------------------------------------------

    if (!variant.color.isActive) {
      throw new ApiError(
        "This product color is no longer available",
        400,
      );
    }

    // --------------------------------------------------------
    // Calculate available stock
    // --------------------------------------------------------

    const availableStock =
      Math.max(
        variant.stock -
          variant.reservedStock,
        0,
      );

    // --------------------------------------------------------
    // Check stock
    // --------------------------------------------------------

    if (availableStock <= 0) {
      throw new ApiError(
        "This product variant is out of stock",
        400,
      );
    }

    // --------------------------------------------------------
    // Check requested quantity
    // --------------------------------------------------------

    if (
      data.quantity >
      availableStock
    ) {
      throw new ApiError(
        `Only ${availableStock} item${
          availableStock === 1
            ? ""
            : "s"
        } available`,
        400,
      );
    }

    // --------------------------------------------------------
    // Check whether variant is already in cart
    // --------------------------------------------------------

    const existingItem =
      await db.query.cartItems.findFirst({
        where: {
          cartId: cart.id,
          variantId: data.variantId,
        },

        columns: {
          id: true,
          quantity: true,
        },
      });

    // ========================================================
    // EXISTING CART ITEM
    // ========================================================

    if (existingItem) {
      // ------------------------------------------------------
      // Calculate new quantity
      // ------------------------------------------------------

      const newQuantity =
        existingItem.quantity +
        data.quantity;

      // ------------------------------------------------------
      // Maximum cart quantity
      // ------------------------------------------------------

      if (newQuantity > 50) {
        throw new ApiError(
          "You can only have up to 50 of this item in your cart",
          400,
        );
      }

      // ------------------------------------------------------
      // Stock check
      // ------------------------------------------------------

      if (
        newQuantity >
        availableStock
      ) {
        throw new ApiError(
          `Only ${availableStock} item${
            availableStock === 1
              ? ""
              : "s"
          } available`,
          400,
        );
      }

      // ------------------------------------------------------
      // Update existing item
      // ------------------------------------------------------

      const result =
        await db
          .update(cartItems)
          .set({
            quantity:
              newQuantity,

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              cartItems.id,
              existingItem.id,
            ),
          )
          .returning();

      // ------------------------------------------------------
      // Update cart timestamp
      // ------------------------------------------------------

      await db
        .update(carts)
        .set({
          updatedAt:
            new Date(),
        })
        .where(
          eq(
            carts.id,
            cart.id,
          ),
        );

      return NextResponse.json({
        success: true,

        message:
          "Cart updated successfully",

        data: result[0],
      });
    }

    // ========================================================
    // NEW CART ITEM
    // ========================================================

    const result =
      await db
        .insert(cartItems)
        .values({
          cartId: cart.id,
          productId:
            data.productId,
          variantId:
            data.variantId,
          quantity:
            data.quantity,
        })
        .returning();

    const newItem =
      result[0];

    // --------------------------------------------------------
    // Make sure insert succeeded
    // --------------------------------------------------------

    if (!newItem) {
      throw new ApiError(
        "Failed to add item to cart",
        500,
      );
    }

    // --------------------------------------------------------
    // Update cart timestamp
    // --------------------------------------------------------

    await db
      .update(carts)
      .set({
        updatedAt:
          new Date(),
      })
      .where(
        eq(
          carts.id,
          cart.id,
        ),
      );

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Item added to cart",

        data: newItem,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleApiError(error);
  }
}