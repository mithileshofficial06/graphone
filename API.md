# GraphOne API Documentation

## Base URL
`http://localhost:3000/api` (development)

## Response Format
All endpoints return a consistent response shape:
```json
{
  "data": {...} | [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  },
  "error": null | "error message"
}
```

## Authentication
Write operations require `X-API-Key` header:
```
X-API-Key: your-api-key
```

## Rate Limiting
- **Limit**: 100 requests per minute per IP
- **Response**: 429 Too Many Requests when exceeded

---

## Companies Endpoints

### GET /api/companies
List companies with filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by category (AI Agents, AI Coding, etc.)
- `stage` (optional): Filter by stage (Seed, Series A, etc.)
- `country` (optional): Filter by headquarters country
- `sort` (optional): Sort order - `trending` (default), `funded`, `new`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example:**
```
GET /api/companies?category=AI Agents&sort=trending&page=1&limit=20
```

### POST /api/companies
Create a new company (requires API key).

**Headers:**
```
X-API-Key: your-api-key
Content-Type: application/json
```

**Body:**
```json
{
  "slug": "my-ai-company",
  "name": "My AI Company",
  "tagline": "Building the future",
  "category": "AI Agents",
  "stage": "Seed",
  "founded_year": 2024
}
```

### GET /api/companies/trending
Get top 10 trending companies by growth_score.

**Caching:** 5 minutes

**Example:**
```
GET /api/companies/trending
```

### GET /api/companies/[slug]
Get full company profile with relations.

**Returns:** Company + founders + products + funding_rounds + investors + news

**Example:**
```
GET /api/companies/openai
```

**404 Response:**
```json
{
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Company with slug 'xyz' not found"
  }
}
```

### GET /api/companies/[slug]/funding
Get all funding rounds for a company.

**Returns:** Funding rounds with lead investor details

**Example:**
```
GET /api/companies/openai/funding
```

### GET /api/companies/[slug]/products
Get all products for a company, sorted by upvotes.

**Example:**
```
GET /api/companies/openai/products
```

---

## Investors Endpoints

### GET /api/investors
List investors with filtering and pagination.

**Query Parameters:**
- `type` (optional): Filter by type (VC, Angel, Corporate, etc.)
- `stage_focus` (optional): Filter by stage focus (Seed, Series A, etc.)
- `sector` (optional): Filter by sector focus
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example:**
```
GET /api/investors?type=VC&stage_focus=Series A&page=1
```

### GET /api/investors/most-active
Get top 10 investors by portfolio count.

**Caching:** 5 minutes

**Example:**
```
GET /api/investors/most-active
```

### GET /api/investors/[slug]
Get full investor profile with recent investments.

**Returns:** Investor + recent_investments (with company details)

**Example:**
```
GET /api/investors/andreessen-horowitz
```

### GET /api/investors/[slug]/investments
Get paginated investment history for an investor.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Returns:** Investments with company name, stage, category, funding amount

**Example:**
```
GET /api/investors/andreessen-horowitz/investments?page=1&limit=20
```

---

## Products Endpoints

### GET /api/products
List products with filtering and sorting.

**Query Parameters:**
- `category` (optional): Filter by category (Chat, Code, Image, Video, Voice)
- `sort` (optional): Sort order - `popular` (default), `newest`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example:**
```
GET /api/products?category=Chat&sort=popular&page=1
```

### GET /api/products/[slug]
Get product detail with company info.

**Example:**
```
GET /api/products/chatgpt
```

---

## News Endpoints

### GET /api/news
Get paginated news feed.

**Query Parameters:**
- `tag` (optional): Filter by tag (Funding, Product Launch, etc.)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example:**
```
GET /api/news?tag=Funding&page=1
```

### GET /api/news/trending
Get top 10 trending news from last 30 days.

**Caching:** 5 minutes

**Example:**
```
GET /api/news/trending
```

---

## Search Endpoint

### GET /api/search
Cross-entity search across companies, investors, and products.

**Query Parameters:**
- `q` (required): Search query

**Returns:**
```json
{
  "data": {
    "companies": [...],
    "investors": [...],
    "products": [...]
  },
  "meta": {
    "query": "openai",
    "total": 15
  },
  "error": null
}
```

**Example:**
```
GET /api/search?q=openai
```

---

## Stats Endpoint

### GET /api/stats
Get platform aggregate statistics.

**Caching:** 5 minutes

**Returns:**
```json
{
  "data": {
    "total_companies": 50,
    "total_investors": 20,
    "total_products": 100,
    "total_news": 50,
    "total_funding": 50000000000,
    "unicorn_count": 25
  },
  "meta": null,
  "error": null
}
```

**Example:**
```
GET /api/stats
```

---

## Founders Endpoint

### GET /api/founders/[id]
Get founder profile with linked company details.

**Example:**
```
GET /api/founders/123e4567-e89b-12d3-a456-426614174000
```

---

## Error Responses

### 400 Bad Request
```json
{
  "data": null,
  "error": "Validation failed",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "data": null,
  "error": "Unauthorized. Valid X-API-Key header required."
}
```

### 404 Not Found
```json
{
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 429 Rate Limit Exceeded
```json
{
  "data": null,
  "error": "Rate limit exceeded. Try again later."
}
```

### 500 Internal Server Error
```json
{
  "data": null,
  "error": "Internal server error"
}
```

---

## Features

✅ **Consistent Response Shape** - All endpoints follow the same structure  
✅ **Rate Limiting** - 100 req/min per IP using sliding window  
✅ **Caching** - 5-minute TTL on trending/stats endpoints  
✅ **Authentication** - API key validation for write operations  
✅ **Validation** - Zod schema validation on POST requests  
✅ **Error Handling** - Proper error logging and user-friendly messages  
✅ **TypeScript** - Full type safety across all routes  
✅ **Relations** - Efficient joins for nested data  

---

## Testing Examples

### Test GET endpoint
```bash
curl http://localhost:3000/api/companies?category=AI%20Agents&limit=5
```

### Test POST endpoint (with API key)
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -H "X-API-Key: graphone-internal-key-2026" \
  -d '{
    "slug": "test-company",
    "name": "Test Company",
    "category": "AI Agents",
    "stage": "Seed"
  }'
```

### Test search
```bash
curl "http://localhost:3000/api/search?q=anthropic"
```

### Test stats
```bash
curl http://localhost:3000/api/stats
```
