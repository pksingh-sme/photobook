import { photoApi } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('photoApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should upload a photo', async () => {
    const mockResponse = {
      photo: {
        id: 'photo-1',
        url: 'https://example.com/photo.jpg',
        name: 'test-photo.jpg',
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const file = new File([''], 'test-photo.jpg', { type: 'image/jpeg' });
    const result = await photoApi.uploadPhoto(file, 'Test Photo');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/photos',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          // Note: Content-Type should NOT be set for FormData
        }),
        body: expect.any(FormData),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should get photos', async () => {
    const mockPhotos = [
      {
        id: 'photo-1',
        url: 'https://example.com/photo1.jpg',
        name: 'Photo 1',
      },
      {
        id: 'photo-2',
        url: 'https://example.com/photo2.jpg',
        name: 'Photo 2',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPhotos),
    });

    const result = await photoApi.getPhotos();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/photos',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual(mockPhotos);
  });

  it('should get photos with album filter', async () => {
    const mockPhotos = [
      {
        id: 'photo-1',
        url: 'https://example.com/photo1.jpg',
        name: 'Photo 1',
        albumId: 'album-1',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPhotos),
    });

    const result = await photoApi.getPhotos('album-1');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/photos?albumId=album-1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual(mockPhotos);
  });

  it('should delete a photo', async () => {
    const mockResponse = { message: 'Photo deleted successfully' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await photoApi.deletePhoto('photo-1');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/photos/photo-1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should handle upload errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const file = new File([''], 'test-photo.jpg', { type: 'image/jpeg' });

    await expect(photoApi.uploadPhoto(file)).rejects.toThrow('Failed to upload photo');
  });

  it('should handle get photos errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(photoApi.getPhotos()).rejects.toThrow('Failed to get photos');
  });

  it('should handle delete photo errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(photoApi.deletePhoto('photo-1')).rejects.toThrow('Failed to delete photo');
  });
});