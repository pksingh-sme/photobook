import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, albumId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const streamUpload = (buffer: Buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'photobook' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
      });
    };

    const result: any = await streamUpload(req.file.buffer);

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        userId,
        url: result.secure_url,
        name: name || req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        albumId: albumId || null,
      },
    });

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo,
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPhotos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { albumId } = req.query;

    const photos = await prisma.photo.findMany({
      where: {
        userId,
        albumId: albumId ? albumId as string : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(photos);
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPhotoById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const photo = await prisma.photo.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photo);
  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    // Delete from database
    const photo = await prisma.photo.delete({
      where: {
        id,
        userId,
      },
    });

    // Delete from Cloudinary (optional)
    // const publicId = photo.url.split('/').pop()?.split('.')[0];
    // if (publicId) {
    //   await cloudinary.uploader.destroy(`photobook/${publicId}`);
    // }

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const uploadMiddleware = upload.single('photo');