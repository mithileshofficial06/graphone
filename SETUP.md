# GraphOne - Setup Guide

## 🚀 Quick Start

Follow these steps to get GraphOne running locally.

---

## Step 1: Install Dependencies ✅

```bash
npm install
```

**Status**: ✅ Already completed

---

## Step 2: Set Up Supabase Database

### Option A: Using Supabase Cloud (Recommended)

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy the following:
     - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
     - `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY
     - `service_role` key → SUPABASE_SERVICE_ROLE_KEY

3. **Update Environment Variables**
   - Open `.env.local`
   - Replace placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
API_KEY=graphone-internal-key-2026
```

4. **Run the Schema**
   - Go to Supabase Dashboard → SQL Editor
   - Copy the entire contents of `supabase/schema.sql`
   - Paste and click "Run"
   - Wait for completion (creates 8 tables + indexes + RLS policies)

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase (if not already done)
supabase init

# Start local Supabase
supabase start

# Apply schema
supabase db push
```

---

## Step 3: Seed the Database

Once your database is set up, seed it with 50+ AI companies, 20+ investors, and sample data:

```bash
npm run seed
```

**Expected Output**:
```
🌱 Starting database seed...

✅ Companies seeded successfully (50 records)
✅ Investors seeded successfully (20 records)
✅ Founders seeded successfully (10 records)
✅ Funding Rounds seeded successfully (20 records)
✅ Products seeded successfully (20 records)
✅ News Articles seeded successfully (50 records)
✅ Investments seeded successfully (10 records)
✅ Company News seeded successfully (10 records)

✅ Database seeding completed successfully!
```

**Note**: Make sure your environment variables are set correctly before running the seed script.

---

## Step 4: Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 📱 Testing the Application

### Test the Pages

1. **Home Page**: http://localhost:3000
   - Should show trending AI companies
   - Hero with search bar
   - Category filters

2. **Company Detail**: http://localhost:3000/companies/openai
   - Full company profile
   - Funding rounds
   - Founders & products

3. **Investors**: http://localhost:3000/investors
   - Investor discovery page
   - Most active investors

4. **Investor Detail**: http://localhost:3000/investors/andreessen-horowitz
   - Portfolio breakdown
   - Investment history

5. **Products**: http://localhost:3000/products
   - AI products catalog
   - Category filtering

### Test the API

```bash
# Get trending companies
curl http://localhost:3000/api/companies/trending

# Get company details
curl http://localhost:3000/api/companies/openai

# Search
curl "http://localhost:3000/api/search?q=anthropic"

# Get platform stats
curl http://localhost:3000/api/stats

# Get investors
curl http://localhost:3000/api/investors/most-active
```

---

## 🔧 Troubleshooting

### Issue: "Missing environment variables"

**Solution**: Make sure `.env.local` has all required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_API_URL=http://localhost:3000
API_KEY=graphone-internal-key-2026
```

### Issue: "Failed to connect to database"

**Solutions**:
1. Check that your Supabase project is active
2. Verify credentials are correct
3. Check if your IP is allowed in Supabase (Dashboard → Settings → Database → Connection Pooling)

### Issue: "Seed script fails"

**Solutions**:
1. Make sure the schema is applied first (`supabase/schema.sql`)
2. Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
3. Try running seed script with `npx tsx scripts/seed.ts` for more detailed errors

### Issue: "API returns 404 or 500"

**Solutions**:
1. Check that the database is seeded
2. Verify API routes are created in `src/app/api/`
3. Check browser console for detailed error messages
4. Look at terminal for server-side errors

### Issue: "Module not found" errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Verify Database Tables

After running the schema, you should have these tables in Supabase:

1. ✅ `companies` (50+ records after seed)
2. ✅ `investors` (20+ records after seed)
3. ✅ `founders` (10+ records after seed)
4. ✅ `funding_rounds` (20+ records after seed)
5. ✅ `investments` (junction table)
6. ✅ `products` (20+ records after seed)
7. ✅ `news_articles` (50+ records after seed)
8. ✅ `company_news` (junction table)

**Verify in Supabase**:
- Go to Table Editor
- Check each table has data after seeding

---

## 🎯 Next Steps

Once everything is running:

1. **Explore the Platform**
   - Browse companies, investors, products
   - Test search functionality
   - Try filtering by category

2. **Test API Endpoints**
   - See `API.md` for full documentation
   - Test rate limiting (100 req/min)
   - Try authenticated endpoints with API key

3. **Customize**
   - Add your own companies via POST /api/companies
   - Modify styling in components
   - Add new features

4. **Deploy** (Optional)
   - Deploy to Vercel: `vercel deploy`
   - Set environment variables in Vercel dashboard
   - Database is already hosted on Supabase

---

## 📚 Documentation

- **API Documentation**: See `API.md`
- **Frontend Documentation**: See `FRONTEND.md`
- **Project Report**: See `REPORT.md`
- **Database Schema**: See `supabase/schema.sql`

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Environment variables set in `.env.local`
- [ ] Database schema applied (`supabase/schema.sql`)
- [ ] Database seeded (`npm run seed`)
- [ ] Development server running (`npm run dev`)
- [ ] Home page loads at http://localhost:3000
- [ ] API endpoints respond correctly
- [ ] All 5 pages are accessible

---

## 🆘 Need Help?

If you encounter issues:

1. Check the terminal for error messages
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Make sure Supabase project is active
5. Review `REPORT.md` for architecture details

---

**Built by Mithilesh KS**
**Stack**: Next.js 14 + TypeScript + Tailwind + Supabase + Recharts
**Deadline**: 72 hours ✅
