const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

export async function getShopifyProducts(collectionHandle = null) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    console.warn("Shopify credentials not configured. Using local product database.");
    return null;
  }

  const query = `
    {
      products(first: 20${collectionHandle ? `, query: "collection:${collectionHandle}"` : ''}) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    return transformShopifyProducts(data.data.products.edges);

  } catch (error) {
    console.error('Shopify fetch error:', error);
    return null;
  }
}

function transformShopifyProducts(edges) {
  return edges.map(({ node }) => ({
    id: node.handle,
    shopifyId: node.id,
    name: node.title,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    image: node.images.edges[0]?.node.url || '',
    link: `https://${SHOPIFY_DOMAIN}/products/${node.handle}`,
    category: 'HUSH Collection',
    inStock: node.variants.edges[0]?.node.availableForSale || false
  }));
}

export function getShopifyProductLink(productHandle) {
  if (!SHOPIFY_DOMAIN) {
    return '#';
  }
  return `https://${SHOPIFY_DOMAIN}/products/${productHandle}`;
}

export async function createShopifyCheckout(lineItems) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    console.warn("Shopify checkout not configured");
    return null;
  }

  const mutation = `
    mutation {
      checkoutCreate(input: {
        lineItems: [${lineItems.map(item => `{variantId: "${item.variantId}", quantity: ${item.quantity}}`).join(', ')}]
      }) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({ query: mutation })
    });

    const data = await response.json();

    if (data.data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.data.checkoutCreate.checkout.webUrl;

  } catch (error) {
    console.error('Shopify checkout error:', error);
    return null;
  }
}

export async function syncProductsWithDatabase(products) {
  const { PRODUCT_DATABASE } = await import('./constants');

  if (!products || products.length === 0) {
    return PRODUCT_DATABASE;
  }

  const mergedProducts = [...products];

  PRODUCT_DATABASE.forEach(localProduct => {
    if (!products.find(p => p.id === localProduct.id)) {
      mergedProducts.push(localProduct);
    }
  });

  return mergedProducts;
}