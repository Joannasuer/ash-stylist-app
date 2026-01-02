// src/utils/shopify.js

export const SHOPIFY_CONFIG = {
  shop: "your-shop-name.myshopify.com",
  apiKey: process.env.REACT_APP_SHOPIFY_API_KEY || "PLACEHOLDER_KEY_DO_NOT_COMMIT",
  scopes: ["read_products", "read_customers"]
};

export const initShopify = () => {
  console.log("Shopify initialized for:", SHOPIFY_CONFIG.shop);
};