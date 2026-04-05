# Security Configuration & Best Practices

## Issues Fixed

### 1. Row Level Security (RLS) - FIXED ✓
**Status:** Enabled on all tables
- profiles: RLS enabled with user-specific policies
- chat_history: Users can only access their own conversations
- sketches: Users can only view/edit their own designs
- user_closets: Users can only manage their own closets

**Policies Implemented:**
- SELECT: Users can read their own data only
- INSERT: Authenticated users can create their own records
- UPDATE: Users can modify only their own data
- DELETE: Users can delete their own records

### 2. Function Search Path - FIXED ✓
**Status:** Corrected
- Removed mutable search_path from `handle_new_user()` function
- Replaced with secure, immutable definition
- Added SECURITY DEFINER with explicit search_path
- Function now prevents privilege escalation attacks

### 3. Password Breach Protection - NEEDS SETUP
**Status:** Requires manual configuration in Supabase Dashboard

To enable password breach detection against HaveIBeenPwned.org:

1. Go to: https://app.supabase.com/project/[YOUR_PROJECT]/auth/policies
2. Find "Security Settings" section
3. Enable "Check password against known data breaches"
4. Save changes

This prevents users from using commonly compromised passwords.

## Authentication Security

### Magic Link Auth
- One-time use tokens
- 24-hour expiration (configurable)
- Email verification required
- Session tokens stored securely

### Session Management
- Tokens stored in secure cookies (httpOnly)
- CSRF protection enabled
- Session timeout: 1 hour of inactivity
- Token refresh on activity

## Database Security

### Row Level Security Policies

All tables enforce user ownership:

```sql
-- Example: Users can only read their own profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### Data Encryption
- All data in transit: TLS 1.2+
- Sensitive fields at rest: Encrypted by Supabase
- API keys: Environment variables only, never hardcoded

## API Key Security

### Never commit:
- `VITE_OPENAI_API_KEY`
- `VITE_SHOPIFY_STOREFRONT_TOKEN`
- `VITE_SUPABASE_SERVICE_ROLE_KEY` (never expose to frontend)
- `KLAVIYO_PRIVATE_KEY`

### Safe to expose to frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (read-only, RLS protected)

## Environment Variables

### Development (.env local)
Only you can access. Never commit to git.

### Production (Vercel/Hosting)
Set in environment settings UI, never in code.

Verify before deploying:
```bash
# Check no secrets in code
grep -r "sk-" src/
grep -r "OPENAI" src/
grep -r "SHOPIFY" src/
```

## CORS Configuration

All edge functions include proper CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey`

## Input Validation

### Frontend Validation
- Email format: RFC 5322 compliant
- Numbers: Integer parsing with bounds
- Text: Length limits enforced
- Dates: ISO 8601 format

### Server Validation
- All user input validated in Supabase policies
- Type checking on database level
- SQL injection prevention: Parameterized queries (built-in)

## API Security

### Rate Limiting
Supabase Auth:
- Magic link: 4 per email per hour
- Password attempts: 5 per email per 15 minutes

OpenAI:
- Rate limits vary by API plan
- Implement exponential backoff

### Error Handling
- Never expose internal errors to users
- Log errors server-side for debugging
- Show generic messages on frontend

## File Storage Security

### User Uploads
- Validate file types before storage
- Scan for malware (implement in future)
- Set expiration on temporary files
- Enforce size limits

## Third-Party Integrations

### Shopify
- Use Storefront API (read-only for customers)
- Never expose Admin API credentials
- Webhook validation: Verify HMAC signatures

### OpenAI
- API key in environment variables
- Rate limit at application level
- Don't log user messages to console
- Implement content filtering if needed

### Klaviyo
- Private key server-side only
- List subscription via backend
- Comply with GDPR/privacy laws

## Privacy Compliance

### Data Collection
- Only collect needed measurements
- Zodiac calculated from DOB, don't store separately if possible
- Clear privacy policy (add to app)
- Explicit consent for email marketing

### Data Deletion
- Users can request account deletion
- GDPR right to be forgotten: 30 days
- Cascade delete all related data

### Privacy Policy
Add to your app covering:
- Data collected and why
- How data is used
- Third parties with access
- User rights (access, deletion, portability)

## Regular Security Audits

### Monthly
- Review RLS policies for gaps
- Check for hardcoded secrets
- Audit API key rotation schedule

### Quarterly
- Update dependencies: `npm audit`
- Review Supabase security advisories
- Check for deprecated functions

### Annually
- Full security assessment
- Penetration testing
- Privacy impact assessment

## Incident Response

### If credentials are exposed:
1. Immediately rotate API keys
2. Check logs for unauthorized access
3. Notify affected users
4. Update affected systems
5. Document incident for compliance

### If data breach occurs:
1. Assess scope of compromise
2. Notify affected users within 72 hours
3. File regulatory reports if required
4. Implement security improvements
5. Review incident with security team

## Security Headers

Add to your deployment (Vercel config):

```json
{
  "headers": [
    {
      "key": "Strict-Transport-Security",
      "value": "max-age=31536000; includeSubDomains"
    },
    {
      "key": "Content-Security-Policy",
      "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    },
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    }
  ]
}
```

## Testing Security

### Before Production Deploy

1. Verify RLS blocks cross-user access:
   ```bash
   npm run test:security
   ```

2. Check for exposed secrets:
   ```bash
   grep -r "sk-\|pk_\|OPENAI\|SHOPIFY" src/
   ```

3. Test authentication flows:
   - Login with magic link
   - Session persistence
   - Logout clears session

4. Verify CORS headers:
   ```bash
   curl -H "Origin: https://other-domain.com" https://your-app.com/api/function
   ```

## Resources

- [Supabase Security Docs](https://supabase.com/docs/guides/auth/auth-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)

## Questions?

If you encounter security issues:
1. Check Supabase status page
2. Review your RLS policies
3. Verify environment variables are set
4. Check browser console for errors
5. Review server logs in Supabase dashboard
