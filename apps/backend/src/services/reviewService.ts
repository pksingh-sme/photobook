import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const reviewService = {
  // Get reviews for a product
  getReviews: async (productId: string) => {
    return await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Create a new review
  createReview: async (userId: string, productId: string, rating: number, title: string, comment?: string) => {
    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Check if user has purchased this product
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        orderId: {
          in: (await prisma.order.findMany({
            where: { userId },
            select: { id: true },
          })).map(order => order.id),
        },
        productId,
      },
    });

    const isVerifiedPurchase = !!orderItem;

    return await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
        isVerifiedPurchase,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  // Update an existing review
  updateReview: async (id: string, userId: string, rating: number, title: string, comment?: string) => {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Not authorized to update this review');
    }

    return await prisma.review.update({
      where: { id },
      data: {
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  // Delete a review
  deleteReview: async (id: string, userId: string) => {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Not authorized to delete this review');
    }

    await prisma.review.delete({
      where: { id },
    });

    return { message: 'Review deleted successfully' };
  },

  // Mark a review as helpful
  markHelpful: async (reviewId: string, userId: string) => {
    // Check if user has already marked this review as helpful
    const existingHelpful = await prisma.helpfulReview.findFirst({
      where: {
        userId,
        reviewId,
      },
    });

    if (existingHelpful) {
      throw new Error('You have already marked this review as helpful');
    }

    // Create helpful review record
    await prisma.helpfulReview.create({
      data: {
        userId,
        reviewId,
      },
    });

    // Update helpful count on review
    return await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpfulCount: {
          increment: 1,
        },
      },
    });
  },
};