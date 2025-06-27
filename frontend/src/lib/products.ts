import type { Product } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to map backend product to frontend product type
const mapProduct = (backendProduct: any): Product => {
  const { productId, ...rest } = backendProduct;
  return {
    ...rest,
    id: productId,
  };
};

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch products, status:', res.status);
      return [];
    }
    const data = await res.json();
    return data.map(mapProduct);
  } catch (error) {
    console.error('getProducts error:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) return undefined;
      console.error(`Failed to fetch product with id: ${id}, status: ${res.status}`);
      return undefined;
    }
    const data = await res.json();
    return mapProduct(data);
  } catch (error) {
    console.error(`getProductById error for id ${id}:`, error);
    return undefined;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) {
        return [];
    }
    try {
        const res = await fetch(`${API_URL}/api/products/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids }),
            cache: 'no-store',
        });
        if (!res.ok) {
            console.error('Failed to fetch products by IDs, status:', res.status);
            return [];
        }
        const data = await res.json();
        // The API returns products in whatever order the DB finds them,
        // so we need to sort them back to match the original `ids` order.
        const productMap = new Map(data.map((p: any) => [p.productId, p]));
        const sortedData = ids.map(id => productMap.get(id)).filter(Boolean);
        return sortedData.map(mapProduct);
    } catch (error) {
        console.error('getProductsByIds error:', error);
        return [];
    }
}
