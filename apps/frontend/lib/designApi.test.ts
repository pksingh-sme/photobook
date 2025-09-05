import { designApi } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('designApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should create a design', async () => {
    const mockResponse = {
      design: {
        id: 'design-1',
        name: 'Test Design',
        description: 'A test design',
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const designData = {
      name: 'Test Design',
      description: 'A test design',
      data: { pages: [] },
    };

    const result = await designApi.createDesign(
      designData.name,
      designData.description,
      designData.data
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/designs',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(designData),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should get designs', async () => {
    const mockDesigns = [
      {
        id: 'design-1',
        name: 'Design 1',
        description: 'First design',
      },
      {
        id: 'design-2',
        name: 'Design 2',
        description: 'Second design',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockDesigns),
    });

    const result = await designApi.getDesigns();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/designs',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual(mockDesigns);
  });

  it('should get a specific design', async () => {
    const mockDesign = {
      id: 'design-1',
      name: 'Test Design',
      description: 'A test design',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockDesign),
    });

    const result = await designApi.getDesign('design-1');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/designs/design-1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual(mockDesign);
  });

  it('should update a design', async () => {
    const mockResponse = {
      design: {
        id: 'design-1',
        name: 'Updated Design',
        description: 'An updated design',
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const updateData = {
      name: 'Updated Design',
      description: 'An updated design',
      data: { pages: [] },
    };

    const result = await designApi.updateDesign(
      'design-1',
      updateData.name,
      updateData.description,
      updateData.data
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/designs/design-1',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(updateData),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should delete a design', async () => {
    const mockResponse = { message: 'Design deleted successfully' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await designApi.deleteDesign('design-1');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/designs/design-1',
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it('should handle create design errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const designData = {
      name: 'Test Design',
      description: 'A test design',
      data: { pages: [] },
    };

    await expect(
      designApi.createDesign(designData.name, designData.description, designData.data)
    ).rejects.toThrow('Failed to create design');
  });

  it('should handle get designs errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(designApi.getDesigns()).rejects.toThrow('Failed to get designs');
  });

  it('should handle get design errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(designApi.getDesign('design-1')).rejects.toThrow('Failed to get design');
  });

  it('should handle update design errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const updateData = {
      name: 'Updated Design',
      description: 'An updated design',
      data: { pages: [] },
    };

    await expect(
      designApi.updateDesign('design-1', updateData.name, updateData.description, updateData.data)
    ).rejects.toThrow('Failed to update design');
  });

  it('should handle delete design errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(designApi.deleteDesign('design-1')).rejects.toThrow('Failed to delete design');
  });
});