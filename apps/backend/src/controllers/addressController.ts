import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, street, city, state, zipCode, country, isDefault } = req.body;

    // If this is a default address, unset the current default
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        name,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({
      message: 'Address created successfully',
      address,
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        isDefault: 'desc',
        createdAt: 'desc',
      },
    });

    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const address = await prisma.address.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { name, street, city, state, zipCode, country, isDefault } = req.body;

    // If this is a default address, unset the current default
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      },
    });

    res.json({
      message: 'Address updated successfully',
      address,
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    await prisma.address.delete({
      where: {
        id,
        userId,
      },
    });

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};