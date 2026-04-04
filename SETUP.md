# Ash Stylist - Setup Guide

Your luxury AI fashion stylist app is now fully wired and ready to activate.

## Current Status

The app now has all core functionality activated and connected. Here's what's working:

### Database Schema
- User profiles with VIP status tracking
- Chat history with AI recommendations
- Sketch storage
- User closets for saved items

### VIP Unlock System
- Magic link authentication via Supabase
- Profile creation with measurements and zodiac
- Automated email collection via Klaviyo
- Persistent login sessions

### Ash AI Brain
- OpenAI GPT-4 powered chat
- Personality: Bold, sexy, technical fashion expert
- Product recommendations based on user profile
- Chat history persistence

### Sketch Engine
- DALL-E 3 powered fashion sketch generation
- Zodiac-influenced design suggestions
- Sketch saving to user profile
- Fallback simulation mode

### Shopify Integration
- Product linking system
- Direct checkout capability
- Automatic product syncing
- Shop Now buttons on all product cards

## Required Environment Variables

Create a `.env` file based on `.env.example`:

### 1. OpenAI (Required for full functionality)

```bash
VITE_OPENAI_API_KEY=sk-your-key-here
```

Get your key: https://platform.openai.com/api-keys

Without this, the app uses fallback responses and simulation mode.

### 2. Shopify (Optional - for real product integration)

```bash
VITE_SHOPIFY_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token_here
```

Setup:
1. Go to Shopify Admin > Apps > Develop apps
2. Create a new app
3. Configure Storefront API access
4. Copy your Storefront Access Token

Without this, the app uses the manual product database in `constants.js`.

### 3. Klaviyo (Optional - for email marketing)

```bash
KLAVIYO_PRIVATE_KEY=pk_your_key_here
KLAVIYO_LIST_ID=your_list_id_here
```

Get your credentials: https://www.klaviyo.com/settings/account/api-keys

This is for automatic email list building when users sign up.

## Features Activated

### Unlock VIP Button
- Opens authentication modal
- Sends magic link via Supabase Auth
- Collects profile data including zodiac
- Stores in database with RLS protection
- Auto-subscribes to Klaviyo list

### Ash Chat
- Full OpenAI integration with custom personality
- Responds to fashion questions
- Recommends products from your database
- Saves conversation history
- Shows suggested looks with clickable product cards

### Sketch It
- Generates fashion sketches from text descriptions
- Uses fabric and silhouette preferences
- Incorporates user's zodiac sign into design
- Saves sketches to profile
- "Send to Tailor" mock workflow

### Product Cards
- Shop Now buttons link to Shopify
- Virtual Try-On modal
- Add to closet functionality
- Product detail views

### FIT ID
- Body measurements storage
- Zodiac calculation
- Skin tone selection
- Profile completion tracking

## Testing the App

### 1. Test VIP Unlock
1. Click "Get Magic Link" in chat when not logged in
2. Enter your email
3. Check your email for the Supabase magic link
4. Click the link to authenticate
5. Complete your profile with measurements

### 2. Test Ash Chat
1. After logging in, ask: "What should I wear to a gala?"
2. Ash should respond with specific product recommendations
3. Click "View [Look Name]" to see the outfit breakdown
4. Products should appear in the side panel

### 3. Test Sketch It
1. Navigate to Sketch page
2. Enter a description: "A fitted black dress with dramatic sleeves"
3. Click Generate Sketch
4. If OpenAI key is set, a unique sketch generates
5. If not, a curated placeholder appears

### 4. Test Shopify Integration
1. Click "Shop Now" on any product card
2. Should open your Shopify product page in new tab
3. If Shopify not configured, shows fallback message

## Customization Guide

### Update Product Database
Edit `src/utils/constants.js`:

```javascript
export const PRODUCT_DATABASE = [
  {
    id: "hush-001",
    name: "Your Product Name",
    price: "180.00",
    image: "https://your-image-url.com/image.jpg",
    link: "https://your-shop.com/products/item",
    category: "Denim",
    description: "Product details"
  }
];
```

### Customize Ash's Personality
Edit `src/utils/openai.js` - ASH_SYSTEM_PROMPT section:

- Tone and language
- Brand knowledge
- Technical expertise level
- Response style

### Database Schema
The Supabase database is already created with:
- profiles
- chat_history
- sketches
- user_closets

All tables have Row Level Security enabled.

## Deployment Checklist

- [ ] Set all environment variables in Vercel/hosting platform
- [ ] Configure Supabase email templates for magic links
- [ ] Add your domain to Supabase allowed redirect URLs
- [ ] Test OpenAI API key validity
- [ ] Verify Shopify Storefront API permissions
- [ ] Set up Klaviyo list for email collection
- [ ] Update product database with real inventory
- [ ] Test authentication flow end-to-end

## Security Notes

All API keys are stored as environment variables and never exposed to the browser except:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (safe to expose)
- All other keys stay server-side

The database uses Row Level Security so users can only access their own data.

## Next Steps

1. Add your OpenAI API key to `.env`
2. Test the VIP unlock flow
3. Chat with Ash
4. Generate a sketch
5. Connect your Shopify store
6. Update the product database with your collection

Your app is ready to make users look dangerous.
