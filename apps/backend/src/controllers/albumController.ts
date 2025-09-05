import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, isPublic } = req.body;

    const album = await prisma.album.create({
      data: {
        userId,
        name,
        isPublic: isPublic || false,
      },
    });

    res.status(201).json({
      message: 'Album created successfully',
      album,
    });
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlbums = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const albums = await prisma.album.findMany({
      where: {
        userId,
      },
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(albums);
  } catch (error) {
    console.error('Get albums error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const album = await prisma.album.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        photos: true,
      },
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json(album);
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAlbum = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { name, isPublic } = req.body;

    const album = await prisma.album.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
        isPublic,
      },
    });

    res.json({
      message: 'Album updated successfully',
      album,
    });
  } catch (error) {
    console.error('Update album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAlbum = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    // Delete album (photos will remain but won't be associated with this album)
    await prisma.album.delete({
      where: {
        id,
        userId,
      },
    });

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Delete album error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};