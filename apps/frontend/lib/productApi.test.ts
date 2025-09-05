import { productApi } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('productApi', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should get products', async () => {
    const mockProducts = [
      {
        id: 'product-1',
        name: 'Premium Hardcover Photo Book',
        price: 29.99,
      },
      {
        id: 'product-2',
        name: 'Softcover Photo Book',
        price: 19.99,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockProducts),
    });

    const result = await productApi.getProducts();

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/products');

    expect(result).toEqual(mockProducts);
  });

  it('should get a specific product', async () => {
    const mockProduct = {
      id: 'product-1',
      name: 'Premium Hardcover Photo Book',
      price: 29.99,
      description: 'A premium hardcover photo book',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockProduct),
    });

    const result = await productApi.getProduct('product-1');

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/products/product-1');

    expect(result).toEqual(mockProduct);
  });

  it('should get categories', async () => {
    const mockCategories = [
      {
        id: 'category-1',
        name: 'Hardcover',
      },
      {
        id: 'category-2',
        name: 'Softcover',
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockCategories),
    });

    const result = await productApi.getCategories();

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/products/categories');

    expect(result).toEqual(mockCategories);
  });

  it('should handle get products errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(productApi.getProducts()).rejects.toThrow('Failed to get products');
  });

  it('should handle get product errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(productApi.getProduct('product-1')).rejects.toThrow('Failed to get product');
  });

  it('should handle get categories errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(productApi.getCategories()).rejects.toThrow('Failed to get categories');
  });
});