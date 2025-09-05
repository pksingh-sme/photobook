import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDesign = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description, data, thumbnail, isPublic } = req.body;

    const design = await prisma.design.create({
      data: {
        userId,
        name,
        description,
        data,
        thumbnail,
        isPublic: isPublic || false,
      },
    });

    res.status(201).json({
      message: 'Design created successfully',
      design,
    });
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDesigns = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { isPublic } = req.query;

    // If isPublic query param is provided, filter accordingly
    // Otherwise, return user's designs
    const whereClause = isPublic !== undefined 
      ? { isPublic: isPublic === 'true' }
      : { userId };

    const designs = await prisma.design.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(designs);
  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDesignById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const design = await prisma.design.findUnique({
      where: {
        id,
        OR: [
          { userId },
          { isPublic: true }
        ]
      },
    });

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.json(design);
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDesign = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { name, description, data, thumbnail, isPublic } = req.body;

    const design = await prisma.design.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
        description,
        data,
        thumbnail,
        isPublic,
      },
    });

    res.json({
      message: 'Design updated successfully',
      design,
    });
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDesign = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    await prisma.design.delete({
      where: {
        id,
        userId,
      },
    });

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};