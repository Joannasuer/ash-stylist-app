# 🔧 ASH DEPLOYMENT GUIDE
## Everything you need to make Ash fully functional

---

## STEP 1 — Rotate & Set Your API Key (DO THIS FIRST)

1. Go to https://platform.openai.com/api-keys
2. Delete the old key (it's exposed in your public JS bundle)
3. Create a new key
4. In Vercel → Your Project → Settings → Environment Variables:
   - Add `OPENAI_API_KEY` = your new key
   - Set it for: Production, Preview, Development

---

## STEP 2 — Add These Files to Your GitHub Repo

Copy the files from this package into your `ash-stylist-app` repo:

### NEW FILE: `api/chat.js`
→ This is Ash's secure brain. The OpenAI key stays server-side.
→ Place at: `ash-stylist-app/api/chat.js`

### REPLACE: `src/services/ashService.js`  
→ Replaces the direct OpenAI calls with `/api/chat` calls.
→ Also contains the HUSH product catalog.

### REPLACE: `src/pages/ChatPage.jsx`
→ Full working chat with:
   - Real message history passed to Ash each turn
   - Typing indicator (animated dots)
   - Product cards with Shop + Add to Bag buttons
   - Suggested Look cards
   - Quick prompt chips
   - VIP banner when not logged in

### REPLACE: `src/components/VIPModal.jsx`
→ Full 3-step FIT ID flow:
   - Step 1: Account creation (email + password, or skip if already logged in)
   - Step 2: Measurements (height, body type)  
   - Step 3: Style DNA (zodiac, skin tone, style tags)
   - Saves everything to Supabase `profiles` table

---

## STEP 3 — Run the Supabase Migration

1. Go to your Supabase Dashboard
2. Click "SQL Editor" → "New Query"
3. Paste the contents of `supabase_migration.sql`
4. Click "Run"

This creates the `profiles` table with Row Level Security.

---

## STEP 4 — Update Your AppContext

Make sure your `AppContext` exposes `setIsVIP` and `setShowVIPModal`:

```jsx
// In your AppContext, make sure these are in the context value:
const [isVIP, setIsVIP] = useState(false);
const [showVIPModal, setShowVIPModal] = useState(false);
const [userProfile, setUserProfile] = useState(null);

// Context value should include:
{ user, userProfile, setUserProfile, isVIP, setIsVIP, 
  showVIPModal, setShowVIPModal, addToCart, cart }
```

And in your App.jsx, render the modal:
```jsx
import VIPModal from './components/VIPModal';

// In your JSX:
{showVIPModal && <VIPModal onClose={() => setShowVIPModal(false)} />}
```

---

## STEP 5 — Update Product Links

In `src/services/ashService.js`, update each product's `link` field to point to your real Shopify product URLs:
```js
link: 'https://timeforhush.com/products/YOUR-PRODUCT-HANDLE'
```

---

## WHAT'S FIXED

| Feature | Before | After |
|---------|--------|-------|
| API Key | ❌ Hardcoded in public JS | ✅ Server env variable |
| Chat | ❌ Dead (direct browser→OpenAI) | ✅ Works via /api/chat |
| Conversation memory | ❌ None | ✅ Full history passed each turn |
| Ash's persona | ❌ Could be overridden | ✅ Hardcoded server-side |
| FIT ID save | ❌ Not persisted | ✅ Saves to Supabase |
| Product cards | ❌ Not shown | ✅ Shop + Add to Bag buttons |
| Suggested looks | ❌ Dead | ✅ Full look cards with products |
| VIP unlock button | ❌ Dead | ✅ Opens full 3-step FIT ID flow |

---

## After committing to GitHub, Vercel auto-deploys in ~60 seconds.
