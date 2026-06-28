# GitHub OAuth + Saved Items Feature

## Overview

This feature implements GitHub OAuth authentication and allows authenticated users to save and track companies and investors they're interested in.

## What's Been Implemented

### 1. Database Schema (`supabase/migrations/002_auth_and_saved_items.sql`)
- **users** table: Stores authenticated user information
- **saved_companies** table: Junction table for user-saved companies
- **saved_investors** table: Junction table for user-saved investors
- Row Level Security (RLS) policies for data protection
- Indexes for optimal query performance

### 2. Authentication Setup
- **NextAuth.js** integration for OAuth handling
- GitHub OAuth provider configuration
- Session management with automatic user upsert in Supabase
- Type-safe session handling

### 3. API Endpoints

#### Saved Companies
- `GET /api/saved/companies` - Get authenticated user's saved companies
- `POST /api/saved/companies` - Save a company (requires auth)
- `DELETE /api/saved/companies?company_id=xxx` - Unsave a company (requires auth)

#### Saved Investors
- `GET /api/saved/investors` - Get authenticated user's saved investors
- `POST /api/saved/investors` - Save an investor (requires auth)
- `DELETE /api/saved/investors?investor_id=xxx` - Unsave an investor (requires auth)

#### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js auth routes
- Handles GitHub OAuth flow
- Session management

### 4. UI Components

#### SaveButton Component
- Reusable button for saving/unsaving items
- Shows different states (saved/unsaved/loading)
- Redirects to sign-in if not authenticated
- Optimistic UI updates

#### Sign In Page (`/auth/signin`)
- Clean, branded sign-in interface
- GitHub OAuth flow initiation
- Mobile-responsive design

#### Saved Items Page (`/saved`)
- Tab interface for Companies and Investors
- Grid layout showing saved items
- Links to detailed pages
- Empty states with CTAs

#### Updated Navbar
- Shows user avatar/name when authenticated
- "Saved" link for quick access
- User menu with sign-out option
- Responsive mobile menu with auth options

### 5. Session Provider
- Wraps the entire app in NextAuth SessionProvider
- Makes session available throughout the component tree

## Setup Instructions

### 1. Run Database Migration

Execute the migration to create the necessary tables:

```sql
-- Run this in Supabase SQL Editor
-- Or use: npx supabase db push
```

Run the migration file: `supabase/migrations/002_auth_and_saved_items.sql`

### 2. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: GraphOne (Development)
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Click "Register application"
5. Copy the **Client ID**
6. Generate a new **Client Secret** and copy it

### 3. Update Environment Variables

Update your `.env.local` file with the GitHub OAuth credentials:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=graphone-development-secret-key-change-in-production

# GitHub OAuth
GITHUB_CLIENT_ID=your-actual-github-client-id
GITHUB_CLIENT_SECRET=your-actual-github-client-secret
```

For production, generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Install Dependencies

Dependencies are already installed:
- `next-auth` - Authentication library
- `@auth/supabase-adapter` - Supabase adapter for NextAuth

### 5. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and test the authentication flow.

## Usage

### For Users

1. **Sign In**: Click "Log In" or "Sign Up" in the navbar
2. **Authenticate**: Authorize the app via GitHub
3. **Save Items**: 
   - Visit any company or investor page
   - Click the "Save" button
4. **View Saved Items**: 
   - Click "Saved" in the navbar
   - Switch between Companies and Investors tabs
5. **Unsave Items**: 
   - Click "Saved" button again to remove from saved items
   - Or remove from the Saved page

### For Developers

#### Using the SaveButton Component

```tsx
import { SaveButton } from '@/components/ui/SaveButton';

<SaveButton
  type="company" // or "investor"
  itemId={company.id}
  initialSaved={false}
  onSaveChange={(saved) => {
    console.log('Item is now', saved ? 'saved' : 'unsaved');
  }}
/>
```

#### Checking Authentication Status

```tsx
'use client';
import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;

  return <div>Hello {session.user?.name}</div>;
}
```

#### Protecting API Routes

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Protected logic here
}
```

## Security Features

### Row Level Security (RLS)
- Users can only view/modify their own saved items
- Policies enforce authorization at the database level
- Protection against SQL injection and unauthorized access

### Session Security
- Secure session tokens
- HTTP-only cookies
- CSRF protection via NextAuth.js

### OAuth Security
- Secure OAuth flow via GitHub
- No password storage
- Tokens are automatically managed

## Database Schema

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    github_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Saved Companies
CREATE TABLE saved_companies (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, company_id)
);

-- Saved Investors
CREATE TABLE saved_investors (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    investor_id UUID REFERENCES investors(id),
    created_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, investor_id)
);
```

## API Response Format

All endpoints follow the consistent response format:

```json
{
  "data": [...],
  "meta": {
    "total": 10
  },
  "error": null
}
```

Error response:
```json
{
  "error": "Error message",
  "data": null
}
```

## Testing the Feature

### Manual Testing Checklist

- [ ] Sign in with GitHub works
- [ ] User profile appears in navbar after sign in
- [ ] Save button appears on company pages
- [ ] Save button appears on investor pages
- [ ] Saving a company works
- [ ] Saving an investor works
- [ ] Saved items appear in /saved page
- [ ] Unsaving from company page works
- [ ] Unsaving from investor page works
- [ ] Sign out works
- [ ] Unauthenticated users redirected to sign in
- [ ] Mobile menu shows auth options correctly

### Test User Flow

1. Visit homepage (not signed in)
2. Click on a company
3. Try to save → redirected to sign in
4. Sign in with GitHub
5. Returned to homepage
6. Click on company again
7. Save the company
8. Visit /saved to see saved company
9. Unsave the company
10. Sign out

## Production Deployment Checklist

- [ ] Run migration in production Supabase instance
- [ ] Create production GitHub OAuth app
- [ ] Update production environment variables
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Update GitHub OAuth callback URL to production domain
- [ ] Test authentication flow in production
- [ ] Verify RLS policies are enabled
- [ ] Monitor error logs

## Future Enhancements

### Potential Next Steps
1. **Email Notifications**: Notify users of saved company funding rounds
2. **Collections**: Allow users to organize saved items into custom lists
3. **Social Features**: Share saved collections with other users
4. **Export Data**: Export saved items as CSV or JSON
5. **Bulk Actions**: Save/unsave multiple items at once
6. **Recommendations**: AI-powered suggestions based on saved items
7. **Saved Searches**: Save search queries for quick access
8. **Watch Lists**: Get alerts when saved companies update
9. **Notes**: Add private notes to saved items
10. **Tags**: Custom tags for organizing saved items

## Troubleshooting

### "Unauthorized" error when saving
- Check if user is authenticated
- Verify session contains user ID
- Check browser console for errors

### GitHub OAuth not working
- Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are correct
- Check callback URL matches GitHub OAuth app settings
- Ensure NEXTAUTH_URL is correct

### Saved items not appearing
- Check if migration was run successfully
- Verify RLS policies are created
- Check browser network tab for API errors
- Verify user_id is being passed correctly

### Database errors
- Check Supabase logs for detailed error messages
- Verify foreign key relationships
- Ensure UUID values are valid

## Architecture Decisions

### Why NextAuth.js?
- Industry-standard OAuth solution
- Built-in security best practices
- Easy provider configuration
- Active maintenance and community

### Why Supabase for Auth Storage?
- Consistent with existing database
- Leverage existing RLS policies
- No additional service needed
- Real-time capabilities available

### Why GitHub OAuth?
- Developer-focused audience
- Single sign-on convenience
- Trusted authentication provider
- No password management needed

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth routes
│   │   └── saved/
│   │       ├── companies/route.ts          # Saved companies API
│   │       └── investors/route.ts          # Saved investors API
│   ├── auth/
│   │   └── signin/page.tsx                 # Sign in page
│   └── saved/page.tsx                      # Saved items page
├── components/
│   ├── SessionProvider.tsx                 # NextAuth provider wrapper
│   ├── ui/SaveButton.tsx                   # Save button component
│   └── layout/Navbar.tsx                   # Updated navbar with auth
├── lib/
│   └── auth.ts                             # NextAuth configuration
└── types/
    └── next-auth.d.ts                      # NextAuth type definitions

supabase/
└── migrations/
    └── 002_auth_and_saved_items.sql        # Database migration
```

## Credits

Feature implemented as part of GraphOne platform enhancement.
Built with Next.js 14, NextAuth.js, Supabase, and TypeScript.
