import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to log results
function logResult(entity: string, success: boolean, count?: number) {
  const icon = success ? '✅' : '❌';
  const message = success ? `${entity} seeded successfully` : `${entity} failed`;
  const countStr = count ? ` (${count} records)` : '';
  console.log(`${icon} ${message}${countStr}`);
}

// Companies data
const companiesData = [
  { slug: 'openai', name: 'OpenAI', tagline: 'Creating safe AGI that benefits all of humanity', category: 'AI Agents', founded_year: 2015, employee_count: 850, headquarters: 'San Francisco, USA', stage: 'Growth', valuation: 80000000000, is_unicorn: true, growth_score: 98.5, view_count: 125000, logo_url: 'https://logo.clearbit.com/openai.com', website_url: 'https://openai.com' },
  { slug: 'anthropic', name: 'Anthropic', tagline: 'AI safety and research company', category: 'AI Agents', founded_year: 2021, employee_count: 450, headquarters: 'San Francisco, USA', stage: 'Series C', valuation: 18000000000, is_unicorn: true, growth_score: 96.2, view_count: 89000, logo_url: 'https://logo.clearbit.com/anthropic.com', website_url: 'https://anthropic.com' },
  { slug: 'mistral-ai', name: 'Mistral AI', tagline: 'Open-source large language models', category: 'AI Infrastructure', founded_year: 2023, employee_count: 120, headquarters: 'Paris, France', stage: 'Series B', valuation: 6000000000, is_unicorn: true, growth_score: 94.8, view_count: 72000, logo_url: 'https://logo.clearbit.com/mistral.ai', website_url: 'https://mistral.ai' },
  { slug: 'perplexity', name: 'Perplexity', tagline: 'AI-powered search engine', category: 'AI Search', founded_year: 2022, employee_count: 85, headquarters: 'San Francisco, USA', stage: 'Series B', valuation: 1000000000, is_unicorn: true, growth_score: 92.4, view_count: 65000, logo_url: 'https://logo.clearbit.com/perplexity.ai', website_url: 'https://perplexity.ai' },
  { slug: 'cursor', name: 'Cursor', tagline: 'AI-first code editor', category: 'AI Coding', founded_year: 2023, employee_count: 25, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 400000000, is_unicorn: false, growth_score: 95.1, view_count: 58000, logo_url: 'https://logo.clearbit.com/cursor.sh', website_url: 'https://cursor.sh' },
  { slug: 'lovable', name: 'Lovable', tagline: 'AI-powered website builder', category: 'AI Agents', founded_year: 2023, employee_count: 35, headquarters: 'London, UK', stage: 'Seed', valuation: 50000000, is_unicorn: false, growth_score: 88.3, view_count: 34000, logo_url: 'https://logo.clearbit.com/lovable.dev', website_url: 'https://lovable.dev' },
  { slug: 'elevenlabs', name: 'ElevenLabs', tagline: 'Generative voice AI', category: 'AI Voice', founded_year: 2022, employee_count: 95, headquarters: 'New York, USA', stage: 'Series B', valuation: 1100000000, is_unicorn: true, growth_score: 93.7, view_count: 78000, logo_url: 'https://logo.clearbit.com/elevenlabs.io', website_url: 'https://elevenlabs.io' },
  { slug: 'midjourney', name: 'Midjourney', tagline: 'AI image generation', category: 'AI Video', founded_year: 2021, employee_count: 50, headquarters: 'San Francisco, USA', stage: 'Bootstrapped', valuation: 2000000000, is_unicorn: true, growth_score: 91.2, view_count: 145000, logo_url: 'https://logo.clearbit.com/midjourney.com', website_url: 'https://midjourney.com' },
  { slug: 'runway', name: 'Runway', tagline: 'AI-powered creative tools', category: 'AI Video', founded_year: 2018, employee_count: 180, headquarters: 'New York, USA', stage: 'Series C', valuation: 1500000000, is_unicorn: true, growth_score: 90.8, view_count: 82000, logo_url: 'https://logo.clearbit.com/runwayml.com', website_url: 'https://runwayml.com' },
  { slug: 'pika', name: 'Pika', tagline: 'AI video generation platform', category: 'AI Video', founded_year: 2023, employee_count: 40, headquarters: 'Palo Alto, USA', stage: 'Seed', valuation: 200000000, is_unicorn: false, growth_score: 89.5, view_count: 52000, logo_url: 'https://logo.clearbit.com/pika.art', website_url: 'https://pika.art' },
  { slug: 'hugging-face', name: 'Hugging Face', tagline: 'The AI community building the future', category: 'AI Infrastructure', founded_year: 2016, employee_count: 280, headquarters: 'New York, USA', stage: 'Series D', valuation: 4500000000, is_unicorn: true, growth_score: 92.1, view_count: 98000, logo_url: 'https://logo.clearbit.com/huggingface.co', website_url: 'https://huggingface.co' },
  { slug: 'cohere', name: 'Cohere', tagline: 'Enterprise AI platform', category: 'AI Infrastructure', founded_year: 2019, employee_count: 320, headquarters: 'Toronto, Canada', stage: 'Series C', valuation: 2200000000, is_unicorn: true, growth_score: 87.6, view_count: 61000, logo_url: 'https://logo.clearbit.com/cohere.com', website_url: 'https://cohere.com' },
  { slug: 'stability-ai', name: 'Stability AI', tagline: 'AI for the masses', category: 'AI Video', founded_year: 2020, employee_count: 200, headquarters: 'London, UK', stage: 'Series B', valuation: 1000000000, is_unicorn: true, growth_score: 84.3, view_count: 87000, logo_url: 'https://logo.clearbit.com/stability.ai', website_url: 'https://stability.ai' },
  { slug: 'character-ai', name: 'Character AI', tagline: 'Conversational AI companions', category: 'AI Agents', founded_year: 2021, employee_count: 90, headquarters: 'Menlo Park, USA', stage: 'Series A', valuation: 1000000000, is_unicorn: true, growth_score: 86.9, view_count: 94000, logo_url: 'https://logo.clearbit.com/character.ai', website_url: 'https://character.ai' },
  { slug: 'harvey', name: 'Harvey', tagline: 'AI for legal professionals', category: 'Healthcare AI', founded_year: 2022, employee_count: 75, headquarters: 'San Francisco, USA', stage: 'Series B', valuation: 715000000, is_unicorn: false, growth_score: 88.7, view_count: 42000, logo_url: 'https://logo.clearbit.com/harvey.ai', website_url: 'https://harvey.ai' },
  { slug: 'glean', name: 'Glean', tagline: 'AI-powered workplace search', category: 'AI Search', founded_year: 2019, employee_count: 250, headquarters: 'Palo Alto, USA', stage: 'Series D', valuation: 2200000000, is_unicorn: true, growth_score: 85.4, view_count: 48000, logo_url: 'https://logo.clearbit.com/glean.com', website_url: 'https://glean.com' },
  { slug: 'databricks', name: 'Databricks', tagline: 'Unified analytics platform', category: 'AI Infrastructure', founded_year: 2013, employee_count: 5500, headquarters: 'San Francisco, USA', stage: 'Public Ready', valuation: 43000000000, is_unicorn: true, growth_score: 91.8, view_count: 112000, logo_url: 'https://logo.clearbit.com/databricks.com', website_url: 'https://databricks.com' },
  { slug: 'scale-ai', name: 'Scale AI', tagline: 'Data platform for AI', category: 'AI Infrastructure', founded_year: 2016, employee_count: 800, headquarters: 'San Francisco, USA', stage: 'Series E', valuation: 7300000000, is_unicorn: true, growth_score: 89.2, view_count: 76000, logo_url: 'https://logo.clearbit.com/scale.com', website_url: 'https://scale.com' },
  { slug: 'together-ai', name: 'Together AI', tagline: 'Cloud platform for AI models', category: 'AI Infrastructure', founded_year: 2022, employee_count: 70, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 200000000, is_unicorn: false, growth_score: 82.5, view_count: 38000, logo_url: 'https://logo.clearbit.com/together.ai', website_url: 'https://together.ai' },
  { slug: 'groq', name: 'Groq', tagline: 'AI inference acceleration', category: 'AI Infrastructure', founded_year: 2016, employee_count: 280, headquarters: 'Mountain View, USA', stage: 'Series D', valuation: 2800000000, is_unicorn: true, growth_score: 87.9, view_count: 54000, logo_url: 'https://logo.clearbit.com/groq.com', website_url: 'https://groq.com' },
  { slug: 'langchain', name: 'LangChain', tagline: 'Building applications with LLMs', category: 'AI Infrastructure', founded_year: 2022, employee_count: 55, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 200000000, is_unicorn: false, growth_score: 91.3, view_count: 67000, logo_url: 'https://logo.clearbit.com/langchain.com', website_url: 'https://langchain.com' },
  { slug: 'weaviate', name: 'Weaviate', tagline: 'Open-source vector database', category: 'AI Infrastructure', founded_year: 2019, employee_count: 85, headquarters: 'Amsterdam, Netherlands', stage: 'Series B', valuation: 200000000, is_unicorn: false, growth_score: 83.1, view_count: 41000, logo_url: 'https://logo.clearbit.com/weaviate.io', website_url: 'https://weaviate.io' },
  { slug: 'pinecone', name: 'Pinecone', tagline: 'Vector database for AI applications', category: 'AI Infrastructure', founded_year: 2019, employee_count: 120, headquarters: 'New York, USA', stage: 'Series B', valuation: 750000000, is_unicorn: false, growth_score: 86.4, view_count: 58000, logo_url: 'https://logo.clearbit.com/pinecone.io', website_url: 'https://pinecone.io' },
  { slug: 'qdrant', name: 'Qdrant', tagline: 'High-performance vector database', category: 'AI Infrastructure', founded_year: 2021, employee_count: 35, headquarters: 'Berlin, Germany', stage: 'Seed', valuation: 28000000, is_unicorn: false, growth_score: 79.8, view_count: 29000, logo_url: 'https://logo.clearbit.com/qdrant.tech', website_url: 'https://qdrant.tech' },
  { slug: 'cognition', name: 'Cognition', tagline: 'AI software engineer', category: 'AI Coding', founded_year: 2023, employee_count: 30, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 350000000, is_unicorn: false, growth_score: 93.2, view_count: 71000, logo_url: 'https://logo.clearbit.com/cognition-labs.com', website_url: 'https://cognition-labs.com' },
  { slug: 'magic', name: 'Magic', tagline: 'AI software co-worker', category: 'AI Coding', founded_year: 2022, employee_count: 45, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 320000000, is_unicorn: false, growth_score: 88.9, view_count: 52000, logo_url: 'https://logo.clearbit.com/magic.dev', website_url: 'https://magic.dev' },
  { slug: 'poolside', name: 'Poolside', tagline: 'AI for software development', category: 'AI Coding', founded_year: 2023, employee_count: 28, headquarters: 'Paris, France', stage: 'Seed', valuation: 126000000, is_unicorn: false, growth_score: 84.6, view_count: 36000, logo_url: 'https://logo.clearbit.com/poolside.ai', website_url: 'https://poolside.ai' },
  { slug: 'sierra', name: 'Sierra', tagline: 'Conversational AI platform', category: 'AI Agents', founded_year: 2023, employee_count: 42, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 175000000, is_unicorn: false, growth_score: 86.2, view_count: 39000, logo_url: 'https://logo.clearbit.com/sierra.ai', website_url: 'https://sierra.ai' },
  { slug: 'imbue', name: 'Imbue', tagline: 'AI systems that reason and code', category: 'AI Coding', founded_year: 2021, employee_count: 38, headquarters: 'San Francisco, USA', stage: 'Series B', valuation: 200000000, is_unicorn: false, growth_score: 81.7, view_count: 33000, logo_url: 'https://logo.clearbit.com/imbue.com', website_url: 'https://imbue.com' },
  { slug: 'adept', name: 'Adept', tagline: 'Useful general intelligence', category: 'AI Agents', founded_year: 2022, employee_count: 65, headquarters: 'San Francisco, USA', stage: 'Series B', valuation: 1000000000, is_unicorn: true, growth_score: 85.1, view_count: 58000, logo_url: 'https://logo.clearbit.com/adept.ai', website_url: 'https://adept.ai' },
  { slug: 'luma-ai', name: 'Luma AI', tagline: '3D capture and rendering', category: 'AI Video', founded_year: 2021, employee_count: 48, headquarters: 'Palo Alto, USA', stage: 'Series A', valuation: 80000000, is_unicorn: false, growth_score: 82.9, view_count: 44000, logo_url: 'https://logo.clearbit.com/lumalabs.ai', website_url: 'https://lumalabs.ai' },
  { slug: 'hedra', name: 'Hedra', tagline: 'AI video generation', category: 'AI Video', founded_year: 2023, employee_count: 22, headquarters: 'San Francisco, USA', stage: 'Seed', valuation: 40000000, is_unicorn: false, growth_score: 87.4, view_count: 31000, logo_url: 'https://logo.clearbit.com/hedra.com', website_url: 'https://hedra.com' },
  { slug: 'heygen', name: 'HeyGen', tagline: 'AI video generation platform', category: 'AI Video', founded_year: 2020, employee_count: 110, headquarters: 'Los Angeles, USA', stage: 'Series A', valuation: 440000000, is_unicorn: false, growth_score: 89.6, view_count: 62000, logo_url: 'https://logo.clearbit.com/heygen.com', website_url: 'https://heygen.com' },
  { slug: 'synthesia', name: 'Synthesia', tagline: 'AI video creation platform', category: 'AI Video', founded_year: 2017, employee_count: 180, headquarters: 'London, UK', stage: 'Series C', valuation: 1000000000, is_unicorn: true, growth_score: 88.3, view_count: 73000, logo_url: 'https://logo.clearbit.com/synthesia.io', website_url: 'https://synthesia.io' },
  { slug: 'd-id', name: 'D-ID', tagline: 'Digital people platform', category: 'AI Video', founded_year: 2017, employee_count: 95, headquarters: 'Tel Aviv, Israel', stage: 'Series B', valuation: 300000000, is_unicorn: false, growth_score: 84.2, view_count: 49000, logo_url: 'https://logo.clearbit.com/d-id.com', website_url: 'https://d-id.com' },
  { slug: 'captions', name: 'Captions', tagline: 'AI-powered video editing', category: 'AI Video', founded_year: 2021, employee_count: 58, headquarters: 'New York, USA', stage: 'Series A', valuation: 150000000, is_unicorn: false, growth_score: 86.8, view_count: 47000, logo_url: 'https://logo.clearbit.com/captions.ai', website_url: 'https://captions.ai' },
  { slug: 'descript', name: 'Descript', tagline: 'All-in-one video and podcast editing', category: 'AI Video', founded_year: 2017, employee_count: 130, headquarters: 'San Francisco, USA', stage: 'Series C', valuation: 553000000, is_unicorn: false, growth_score: 83.7, view_count: 68000, logo_url: 'https://logo.clearbit.com/descript.com', website_url: 'https://descript.com' },
  { slug: 'adobe-firefly', name: 'Adobe Firefly', tagline: 'Generative AI for creatives', category: 'AI Video', founded_year: 2023, employee_count: 350, headquarters: 'San Jose, USA', stage: 'Public', valuation: 240000000000, is_unicorn: true, growth_score: 90.4, view_count: 105000, logo_url: 'https://logo.clearbit.com/adobe.com', website_url: 'https://firefly.adobe.com' },
  { slug: 'canva-ai', name: 'Canva AI', tagline: 'AI-powered design platform', category: 'AI Video', founded_year: 2012, employee_count: 4000, headquarters: 'Sydney, Australia', stage: 'Public Ready', valuation: 26000000000, is_unicorn: true, growth_score: 87.1, view_count: 135000, logo_url: 'https://logo.clearbit.com/canva.com', website_url: 'https://canva.com' },
  { slug: 'notion-ai', name: 'Notion AI', tagline: 'AI-powered workspace', category: 'AI Agents', founded_year: 2016, employee_count: 400, headquarters: 'San Francisco, USA', stage: 'Series C', valuation: 10000000000, is_unicorn: true, growth_score: 88.9, view_count: 142000, logo_url: 'https://logo.clearbit.com/notion.so', website_url: 'https://notion.so' },
  { slug: 'linear', name: 'Linear', tagline: 'Issue tracking with AI', category: 'AI Agents', founded_year: 2019, employee_count: 85, headquarters: 'San Francisco, USA', stage: 'Series B', valuation: 400000000, is_unicorn: false, growth_score: 85.6, view_count: 78000, logo_url: 'https://logo.clearbit.com/linear.app', website_url: 'https://linear.app' },
  { slug: 'vercel-ai', name: 'Vercel AI', tagline: 'AI SDK and deployment platform', category: 'AI Infrastructure', founded_year: 2015, employee_count: 220, headquarters: 'San Francisco, USA', stage: 'Series C', valuation: 2500000000, is_unicorn: true, growth_score: 89.8, view_count: 92000, logo_url: 'https://logo.clearbit.com/vercel.com', website_url: 'https://vercel.com' },
  { slug: 'replit', name: 'Replit', tagline: 'Build software faster with AI', category: 'AI Coding', founded_year: 2016, employee_count: 120, headquarters: 'San Francisco, USA', stage: 'Series B', valuation: 1160000000, is_unicorn: true, growth_score: 91.5, view_count: 104000, logo_url: 'https://logo.clearbit.com/replit.com', website_url: 'https://replit.com' },
  { slug: 'github-copilot', name: 'GitHub Copilot', tagline: 'Your AI pair programmer', category: 'AI Coding', founded_year: 2021, employee_count: 500, headquarters: 'San Francisco, USA', stage: 'Public', valuation: 0, is_unicorn: true, growth_score: 94.6, view_count: 185000, logo_url: 'https://logo.clearbit.com/github.com', website_url: 'https://github.com/features/copilot' },
  { slug: 'tabnine', name: 'Tabnine', tagline: 'AI code completion', category: 'AI Coding', founded_year: 2012, employee_count: 75, headquarters: 'Tel Aviv, Israel', stage: 'Series B', valuation: 250000000, is_unicorn: false, growth_score: 82.4, view_count: 56000, logo_url: 'https://logo.clearbit.com/tabnine.com', website_url: 'https://tabnine.com' },
  { slug: 'codeium', name: 'Codeium', tagline: 'Free AI-powered code completion', category: 'AI Coding', founded_year: 2021, employee_count: 42, headquarters: 'Mountain View, USA', stage: 'Series A', valuation: 65000000, is_unicorn: false, growth_score: 87.2, view_count: 61000, logo_url: 'https://logo.clearbit.com/codeium.com', website_url: 'https://codeium.com' },
  { slug: 'weights-and-biases', name: 'Weights & Biases', tagline: 'ML experiment tracking', category: 'AI Infrastructure', founded_year: 2017, employee_count: 220, headquarters: 'San Francisco, USA', stage: 'Series C', valuation: 1000000000, is_unicorn: true, growth_score: 84.9, view_count: 63000, logo_url: 'https://logo.clearbit.com/wandb.ai', website_url: 'https://wandb.ai' },
  { slug: 'roboflow', name: 'Roboflow', tagline: 'Computer vision platform', category: 'Robotics', founded_year: 2019, employee_count: 68, headquarters: 'Des Moines, USA', stage: 'Series A', valuation: 150000000, is_unicorn: false, growth_score: 81.3, view_count: 42000, logo_url: 'https://logo.clearbit.com/roboflow.com', website_url: 'https://roboflow.com' },
  { slug: 'landing-ai', name: 'Landing AI', tagline: 'Visual AI platform', category: 'Robotics', founded_year: 2017, employee_count: 95, headquarters: 'Palo Alto, USA', stage: 'Series A', valuation: 110000000, is_unicorn: false, growth_score: 78.6, view_count: 37000, logo_url: 'https://logo.clearbit.com/landing.ai', website_url: 'https://landing.ai' },
  { slug: 'galileo', name: 'Galileo', tagline: 'ML observability platform', category: 'AI Infrastructure', founded_year: 2021, employee_count: 52, headquarters: 'San Francisco, USA', stage: 'Series A', valuation: 85000000, is_unicorn: false, growth_score: 80.2, view_count: 34000, logo_url: 'https://logo.clearbit.com/rungalileo.io', website_url: 'https://rungalileo.io' },
];

// Investors data
const investorsData = [
  { slug: 'andreessen-horowitz', name: 'Andreessen Horowitz', type: 'VC', logo_url: 'https://logo.clearbit.com/a16z.com', website_url: 'https://a16z.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer', 'Crypto'], aum: 35000000000, investment_thesis: 'We back bold entrepreneurs building the future', portfolio_count: 156 },
  { slug: 'sequoia-capital', name: 'Sequoia Capital', type: 'VC', logo_url: 'https://logo.clearbit.com/sequoiacap.com', website_url: 'https://sequoiacap.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Series C', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Fintech', 'Healthcare'], aum: 85000000000, investment_thesis: 'Help daring founders build legendary companies', portfolio_count: 243 },
  { slug: 'lightspeed-venture-partners', name: 'Lightspeed Venture Partners', type: 'VC', logo_url: 'https://logo.clearbit.com/lsvp.com', website_url: 'https://lsvp.com', stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer'], aum: 18000000000, investment_thesis: 'Partner with exceptional founders at the earliest stages', portfolio_count: 189 },
  { slug: 'accel', name: 'Accel', type: 'VC', logo_url: 'https://logo.clearbit.com/accel.com', website_url: 'https://accel.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer', 'Infrastructure'], aum: 25000000000, investment_thesis: 'First partner to exceptional teams everywhere', portfolio_count: 214 },
  { slug: 'general-catalyst', name: 'General Catalyst', type: 'VC', logo_url: 'https://logo.clearbit.com/generalcatalyst.com', website_url: 'https://generalcatalyst.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Healthcare', 'Enterprise', 'Fintech'], aum: 30000000000, investment_thesis: 'Empower entrepreneurs to build enduring companies', portfolio_count: 187 },
  { slug: 'khosla-ventures', name: 'Khosla Ventures', type: 'VC', logo_url: 'https://logo.clearbit.com/khoslaventures.com', website_url: 'https://khoslaventures.com', stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI/ML', 'Climate', 'Healthcare', 'Enterprise'], aum: 15000000000, investment_thesis: 'Backing impactful technologies and bold entrepreneurs', portfolio_count: 142 },
  { slug: 'tiger-global', name: 'Tiger Global', type: 'VC', logo_url: 'https://logo.clearbit.com/tigerglobal.com', website_url: 'https://tigerglobal.com', stage_focus: ['Series B', 'Series C', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer', 'Fintech'], aum: 95000000000, investment_thesis: 'Partnering with dynamic internet and software entrepreneurs', portfolio_count: 298 },
  { slug: 'softbank-vision-fund', name: 'SoftBank Vision Fund', type: 'VC', logo_url: 'https://logo.clearbit.com/visionfund.com', website_url: 'https://visionfund.com', stage_focus: ['Series C', 'Series D', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Robotics', 'Infrastructure'], aum: 100000000000, investment_thesis: 'Investing in AI-driven technology companies', portfolio_count: 178 },
  { slug: 'y-combinator', name: 'Y Combinator', type: 'Accelerator', logo_url: 'https://logo.clearbit.com/ycombinator.com', website_url: 'https://ycombinator.com', stage_focus: ['Seed'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer', 'Biotech'], aum: 3000000000, investment_thesis: 'Make something people want', portfolio_count: 4200 },
  { slug: 'coatue-management', name: 'Coatue Management', type: 'VC', logo_url: 'https://logo.clearbit.com/coatue.com', website_url: 'https://coatue.com', stage_focus: ['Series B', 'Series C', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Fintech', 'Consumer'], aum: 65000000000, investment_thesis: 'Technology-focused investment firm', portfolio_count: 223 },
  { slug: 'index-ventures', name: 'Index Ventures', type: 'VC', logo_url: 'https://logo.clearbit.com/indexventures.com', website_url: 'https://indexventures.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer', 'Gaming'], aum: 8000000000, investment_thesis: 'Partnering with bold founders building global businesses', portfolio_count: 198 },
  { slug: 'founders-fund', name: 'Founders Fund', type: 'VC', logo_url: 'https://logo.clearbit.com/foundersfund.com', website_url: 'https://foundersfund.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Aerospace', 'Biotech', 'Enterprise'], aum: 12000000000, investment_thesis: 'Back founders building revolutionary technologies', portfolio_count: 134 },
  { slug: 'gv', name: 'GV (Google Ventures)', type: 'Corporate', logo_url: 'https://logo.clearbit.com/gv.com', website_url: 'https://gv.com', stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI/ML', 'Healthcare', 'Enterprise', 'Consumer'], aum: 8000000000, investment_thesis: 'Investing in bold new companies', portfolio_count: 512 },
  { slug: 'microsoft-m12', name: 'Microsoft M12', type: 'Corporate', logo_url: 'https://logo.clearbit.com/microsoft.com', website_url: 'https://m12.vc', stage_focus: ['Series A', 'Series B', 'Series C'], sector_focus: ['AI/ML', 'Enterprise', 'Cloud', 'Security'], aum: 2000000000, investment_thesis: 'Empowering founders with strategic resources', portfolio_count: 98 },
  { slug: 'nvidia-ventures', name: 'NVIDIA Ventures', type: 'Corporate', logo_url: 'https://logo.clearbit.com/nvidia.com', website_url: 'https://nvidia.com/ventures', stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI/ML', 'Robotics', 'Automotive', 'Healthcare'], aum: 1500000000, investment_thesis: 'Accelerating AI and computing innovation', portfolio_count: 87 },
  { slug: 'intel-capital', name: 'Intel Capital', type: 'Corporate', logo_url: 'https://logo.clearbit.com/intel.com', website_url: 'https://intelcapital.com', stage_focus: ['Series A', 'Series B', 'Series C', 'Growth'], sector_focus: ['AI/ML', 'Cloud', 'IoT', 'Automotive'], aum: 4000000000, investment_thesis: 'Investing in disruptive technology companies', portfolio_count: 432 },
  { slug: 'spark-capital', name: 'Spark Capital', type: 'VC', logo_url: 'https://logo.clearbit.com/sparkcapital.com', website_url: 'https://sparkcapital.com', stage_focus: ['Seed', 'Series A', 'Series B'], sector_focus: ['AI/ML', 'Consumer', 'Fintech', 'Enterprise'], aum: 7500000000, investment_thesis: 'Supporting exceptional entrepreneurs', portfolio_count: 156 },
  { slug: 'redpoint-ventures', name: 'Redpoint Ventures', type: 'VC', logo_url: 'https://logo.clearbit.com/redpoint.com', website_url: 'https://redpoint.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Enterprise', 'Consumer', 'Infrastructure'], aum: 6500000000, investment_thesis: 'Partnering with founders at the earliest stages', portfolio_count: 178 },
  { slug: 'nea', name: 'NEA', type: 'VC', logo_url: 'https://logo.clearbit.com/nea.com', website_url: 'https://nea.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Series C', 'Growth'], sector_focus: ['AI/ML', 'Healthcare', 'Enterprise', 'Consumer'], aum: 25000000000, investment_thesis: 'Backing entrepreneurs building category-defining companies', portfolio_count: 267 },
  { slug: 'bessemer-venture-partners', name: 'Bessemer Venture Partners', type: 'VC', logo_url: 'https://logo.clearbit.com/bvp.com', website_url: 'https://bvp.com', stage_focus: ['Seed', 'Series A', 'Series B', 'Growth'], sector_focus: ['AI/ML', 'Cloud', 'Enterprise', 'Healthcare'], aum: 20000000000, investment_thesis: 'Helping founders build companies of lasting value', portfolio_count: 245 },
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // 1. Seed Companies
    console.log('📊 Seeding companies...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .insert(companiesData)
      .select();
    
    if (companiesError) {
      logResult('Companies', false);
      console.error(companiesError);
    } else {
      logResult('Companies', true, companies?.length);
    }

    // 2. Seed Investors
    console.log('💼 Seeding investors...');
    const { data: investors, error: investorsError } = await supabase
      .from('investors')
      .insert(investorsData)
      .select();
    
    if (investorsError) {
      logResult('Investors', false);
      console.error(investorsError);
    } else {
      logResult('Investors', true, investors?.length);
    }

    // 3. Seed Founders
    console.log('👤 Seeding founders...');
    const foundersData = [
      { company_id: companies?.find(c => c.slug === 'openai')?.id, name: 'Sam Altman', title: 'CEO', bio: 'Former president of Y Combinator', avatar_url: 'https://avatar.clearbit.com/sama', linkedin_url: 'https://linkedin.com/in/sama', twitter_url: 'https://twitter.com/sama' },
      { company_id: companies?.find(c => c.slug === 'anthropic')?.id, name: 'Dario Amodei', title: 'CEO', bio: 'Former VP of Research at OpenAI', avatar_url: 'https://avatar.clearbit.com/dario', linkedin_url: 'https://linkedin.com/in/dario-amodei', twitter_url: 'https://twitter.com/danielamodei' },
      { company_id: companies?.find(c => c.slug === 'mistral-ai')?.id, name: 'Arthur Mensch', title: 'CEO', bio: 'Former DeepMind researcher', avatar_url: 'https://avatar.clearbit.com/arthur', linkedin_url: 'https://linkedin.com/in/arthurmensch', twitter_url: 'https://twitter.com/arthurmensch' },
      { company_id: companies?.find(c => c.slug === 'mistral-ai')?.id, name: 'Guillaume Lample', title: 'CTO', bio: 'Former Meta AI researcher', avatar_url: 'https://avatar.clearbit.com/guillaume', linkedin_url: 'https://linkedin.com/in/guillaume-lample', twitter_url: 'https://twitter.com/guillaumelample' },
      { company_id: companies?.find(c => c.slug === 'perplexity')?.id, name: 'Aravind Srinivas', title: 'CEO', bio: 'Former OpenAI and DeepMind researcher', avatar_url: 'https://avatar.clearbit.com/aravind', linkedin_url: 'https://linkedin.com/in/aravind-srinivas', twitter_url: 'https://twitter.com/AravSrinivas' },
      { company_id: companies?.find(c => c.slug === 'cursor')?.id, name: 'Michael Truell', title: 'CEO', bio: 'MIT dropout, former Replicate engineer', avatar_url: 'https://avatar.clearbit.com/michael', linkedin_url: 'https://linkedin.com/in/michael-truell', twitter_url: 'https://twitter.com/truellmichael' },
      { company_id: companies?.find(c => c.slug === 'stability-ai')?.id, name: 'Emad Mostaque', title: 'Founder', bio: 'Former hedge fund manager turned AI entrepreneur', avatar_url: 'https://avatar.clearbit.com/emad', linkedin_url: 'https://linkedin.com/in/emad-mostaque', twitter_url: 'https://twitter.com/EMostaque' },
      { company_id: companies?.find(c => c.slug === 'replit')?.id, name: 'Amjad Masad', title: 'CEO', bio: 'Former Facebook engineer', avatar_url: 'https://avatar.clearbit.com/amjad', linkedin_url: 'https://linkedin.com/in/amjadmasad', twitter_url: 'https://twitter.com/amasad' },
      { company_id: companies?.find(c => c.slug === 'hugging-face')?.id, name: 'Clement Delangue', title: 'CEO', bio: 'Building the GitHub for machine learning', avatar_url: 'https://avatar.clearbit.com/clement', linkedin_url: 'https://linkedin.com/in/clementdelangue', twitter_url: 'https://twitter.com/ClementDelangue' },
      { company_id: companies?.find(c => c.slug === 'scale-ai')?.id, name: 'Alex Wang', title: 'CEO', bio: 'MIT dropout, Forbes 30 Under 30', avatar_url: 'https://avatar.clearbit.com/alex', linkedin_url: 'https://linkedin.com/in/alexandrwang', twitter_url: 'https://twitter.com/alexandr_wang' },
    ];
    
    const { data: founders, error: foundersError } = await supabase
      .from('founders')
      .insert(foundersData)
      .select();
    
    if (foundersError) {
      logResult('Founders', false);
      console.error(foundersError);
    } else {
      logResult('Founders', true, founders?.length);
    }

    // 4. Seed Funding Rounds
    console.log('💰 Seeding funding rounds...');
    const fundingRoundsData = [
      { company_id: companies?.find(c => c.slug === 'openai')?.id, round_type: 'Series C', amount: 10000000000, valuation: 80000000000, announced_date: '2023-10-15', lead_investor_id: investors?.find(i => i.slug === 'microsoft-m12')?.id },
      { company_id: companies?.find(c => c.slug === 'anthropic')?.id, round_type: 'Series C', amount: 4000000000, valuation: 18000000000, announced_date: '2024-03-20', lead_investor_id: investors?.find(i => i.slug === 'google-ventures')?.id },
      { company_id: companies?.find(c => c.slug === 'mistral-ai')?.id, round_type: 'Series B', amount: 415000000, valuation: 6000000000, announced_date: '2024-06-11', lead_investor_id: investors?.find(i => i.slug === 'general-catalyst')?.id },
      { company_id: companies?.find(c => c.slug === 'perplexity')?.id, round_type: 'Series B', amount: 250000000, valuation: 1000000000, announced_date: '2024-04-23', lead_investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id },
      { company_id: companies?.find(c => c.slug === 'cursor')?.id, round_type: 'Series A', amount: 60000000, valuation: 400000000, announced_date: '2024-03-08', lead_investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id },
      { company_id: companies?.find(c => c.slug === 'elevenlabs')?.id, round_type: 'Series B', amount: 80000000, valuation: 1100000000, announced_date: '2024-01-22', lead_investor_id: investors?.find(i => i.slug === 'sequoia-capital')?.id },
      { company_id: companies?.find(c => c.slug === 'runway')?.id, round_type: 'Series C', amount: 141000000, valuation: 1500000000, announced_date: '2023-12-04', lead_investor_id: investors?.find(i => i.slug === 'google-ventures')?.id },
      { company_id: companies?.find(c => c.slug === 'hugging-face')?.id, round_type: 'Series D', amount: 235000000, valuation: 4500000000, announced_date: '2023-08-24', lead_investor_id: investors?.find(i => i.slug === 'coatue-management')?.id },
      { company_id: companies?.find(c => c.slug === 'cohere')?.id, round_type: 'Series C', amount: 270000000, valuation: 2200000000, announced_date: '2023-06-08', lead_investor_id: investors?.find(i => i.slug === 'nvidia-ventures')?.id },
      { company_id: companies?.find(c => c.slug === 'databricks')?.id, round_type: 'Series I', amount: 500000000, valuation: 43000000000, announced_date: '2023-09-14', lead_investor_id: investors?.find(i => i.slug === 'tiger-global')?.id },
      { company_id: companies?.find(c => c.slug === 'scale-ai')?.id, round_type: 'Series E', amount: 1000000000, valuation: 7300000000, announced_date: '2023-05-03', lead_investor_id: investors?.find(i => i.slug === 'accel')?.id },
      { company_id: companies?.find(c => c.slug === 'character-ai')?.id, round_type: 'Series A', amount: 150000000, valuation: 1000000000, announced_date: '2023-03-23', lead_investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id },
      { company_id: companies?.find(c => c.slug === 'harvey')?.id, round_type: 'Series B', amount: 80000000, valuation: 715000000, announced_date: '2023-12-06', lead_investor_id: investors?.find(i => i.slug === 'sequoia-capital')?.id },
      { company_id: companies?.find(c => c.slug === 'glean')?.id, round_type: 'Series D', amount: 200000000, valuation: 2200000000, announced_date: '2024-02-28', lead_investor_id: investors?.find(i => i.slug === 'kleiner-perkins')?.id },
      { company_id: companies?.find(c => c.slug === 'groq')?.id, round_type: 'Series D', amount: 640000000, valuation: 2800000000, announced_date: '2024-08-05', lead_investor_id: investors?.find(i => i.slug === 'softbank-vision-fund')?.id },
      { company_id: companies?.find(c => c.slug === 'replit')?.id, round_type: 'Series B', amount: 97500000, valuation: 1160000000, announced_date: '2023-04-26', lead_investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id },
      { company_id: companies?.find(c => c.slug === 'adept')?.id, round_type: 'Series B', amount: 350000000, valuation: 1000000000, announced_date: '2023-03-14', lead_investor_id: investors?.find(i => i.slug === 'general-catalyst')?.id },
      { company_id: companies?.find(c => c.slug === 'cognition')?.id, round_type: 'Series A', amount: 175000000, valuation: 350000000, announced_date: '2024-03-12', lead_investor_id: investors?.find(i => i.slug === 'founders-fund')?.id },
      { company_id: companies?.find(c => c.slug === 'pinecone')?.id, round_type: 'Series B', amount: 100000000, valuation: 750000000, announced_date: '2023-04-27', lead_investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id },
      { company_id: companies?.find(c => c.slug === 'synthesia')?.id, round_type: 'Series C', amount: 90000000, valuation: 1000000000, announced_date: '2023-06-21', lead_investor_id: investors?.find(i => i.slug === 'accel')?.id },
    ];
    
    const { data: fundingRounds, error: fundingError } = await supabase
      .from('funding_rounds')
      .insert(fundingRoundsData.filter(fr => fr.company_id && fr.lead_investor_id))
      .select();
    
    if (fundingError) {
      logResult('Funding Rounds', false);
      console.error(fundingError);
    } else {
      logResult('Funding Rounds', true, fundingRounds?.length);
    }

    // 5. Seed Products
    console.log('🛠️ Seeding products...');
    const productsData = [
      { company_id: companies?.find(c => c.slug === 'openai')?.id, slug: 'chatgpt', name: 'ChatGPT', description: 'Conversational AI assistant', category: 'Chat', url: 'https://chat.openai.com', upvotes: 15420 },
      { company_id: companies?.find(c => c.slug === 'openai')?.id, slug: 'sora', name: 'Sora', description: 'Text-to-video AI model', category: 'Video', url: 'https://openai.com/sora', upvotes: 8940 },
      { company_id: companies?.find(c => c.slug === 'openai')?.id, slug: 'codex', name: 'Codex', description: 'AI coding assistant', category: 'Code', url: 'https://openai.com/codex', upvotes: 6720 },
      { company_id: companies?.find(c => c.slug === 'anthropic')?.id, slug: 'claude', name: 'Claude', description: 'Constitutional AI assistant', category: 'Chat', url: 'https://claude.ai', upvotes: 12350 },
      { company_id: companies?.find(c => c.slug === 'midjourney')?.id, slug: 'midjourney', name: 'Midjourney', description: 'AI image generation', category: 'Image', url: 'https://midjourney.com', upvotes: 18920 },
      { company_id: companies?.find(c => c.slug === 'cursor')?.id, slug: 'cursor-editor', name: 'Cursor Editor', description: 'AI-first code editor', category: 'Code', url: 'https://cursor.sh', upvotes: 9840 },
      { company_id: companies?.find(c => c.slug === 'elevenlabs')?.id, slug: 'elevenlabs-voice', name: 'ElevenLabs Voice', description: 'AI voice generation', category: 'Voice', url: 'https://elevenlabs.io', upvotes: 7650 },
      { company_id: companies?.find(c => c.slug === 'runway')?.id, slug: 'runway-gen3', name: 'Runway Gen-3', description: 'AI video generation', category: 'Video', url: 'https://runwayml.com/gen3', upvotes: 6890 },
      { company_id: companies?.find(c => c.slug === 'perplexity')?.id, slug: 'perplexity-search', name: 'Perplexity Search', description: 'AI-powered search', category: 'Chat', url: 'https://perplexity.ai', upvotes: 8420 },
      { company_id: companies?.find(c => c.slug === 'pika')?.id, slug: 'pika-video', name: 'Pika Video', description: 'Text-to-video generation', category: 'Video', url: 'https://pika.art', upvotes: 5780 },
      { company_id: companies?.find(c => c.slug === 'replit')?.id, slug: 'replit-ghostwriter', name: 'Replit Ghostwriter', description: 'AI pair programmer', category: 'Code', url: 'https://replit.com/ai', upvotes: 7290 },
      { company_id: companies?.find(c => c.slug === 'github-copilot')?.id, slug: 'github-copilot', name: 'GitHub Copilot', description: 'AI pair programmer', category: 'Code', url: 'https://github.com/features/copilot', upvotes: 14560 },
      { company_id: companies?.find(c => c.slug === 'stability-ai')?.id, slug: 'stable-diffusion', name: 'Stable Diffusion', description: 'Open-source image generation', category: 'Image', url: 'https://stability.ai/stable-diffusion', upvotes: 11230 },
      { company_id: companies?.find(c => c.slug === 'heygen')?.id, slug: 'heygen-avatar', name: 'HeyGen Avatar', description: 'AI video avatar generator', category: 'Video', url: 'https://heygen.com', upvotes: 6150 },
      { company_id: companies?.find(c => c.slug === 'synthesia')?.id, slug: 'synthesia-video', name: 'Synthesia Video', description: 'AI video creation platform', category: 'Video', url: 'https://synthesia.io', upvotes: 5940 },
      { company_id: companies?.find(c => c.slug === 'descript')?.id, slug: 'descript-overdub', name: 'Descript Overdub', description: 'AI voice cloning for editing', category: 'Voice', url: 'https://descript.com', upvotes: 4820 },
      { company_id: companies?.find(c => c.slug === 'notion-ai')?.id, slug: 'notion-ai', name: 'Notion AI', description: 'AI writing assistant', category: 'Chat', url: 'https://notion.so/ai', upvotes: 9670 },
      { company_id: companies?.find(c => c.slug === 'character-ai')?.id, slug: 'character-ai', name: 'Character AI', description: 'Conversational AI companions', category: 'Chat', url: 'https://character.ai', upvotes: 10840 },
      { company_id: companies?.find(c => c.slug === 'cognition')?.id, slug: 'devin', name: 'Devin', description: 'AI software engineer', category: 'Code', url: 'https://cognition-labs.com/devin', upvotes: 8920 },
      { company_id: companies?.find(c => c.slug === 'luma-ai')?.id, slug: 'luma-dream-machine', name: 'Luma Dream Machine', description: 'AI 3D capture and rendering', category: 'Video', url: 'https://lumalabs.ai/dream-machine', upvotes: 5430 },
    ];
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(productsData.filter(p => p.company_id))
      .select();
    
    if (productsError) {
      logResult('Products', false);
      console.error(productsError);
    } else {
      logResult('Products', true, products?.length);
    }

    // 6. Seed News Articles
    console.log('📰 Seeding news articles...');
    const newsArticlesData = [
      { title: 'OpenAI Raises $10B in Largest AI Funding Round Ever', summary: 'OpenAI secures massive funding round led by Microsoft, valuing company at $80B', url: 'https://techcrunch.com/openai-funding', source: 'TechCrunch', published_at: '2024-06-15T10:00:00Z', tags: ['Funding', 'OpenAI', 'Microsoft'] },
      { title: 'Anthropic Announces Claude 3 Opus with Enhanced Reasoning', summary: 'New flagship model shows significant improvements in complex reasoning tasks', url: 'https://theverge.com/anthropic-claude3', source: 'The Verge', published_at: '2024-06-10T14:30:00Z', tags: ['Product Launch', 'Anthropic', 'LLM'] },
      { title: 'Mistral AI Secures $415M Series B at $6B Valuation', summary: 'French AI startup becomes latest European unicorn with major funding round', url: 'https://reuters.com/mistral-funding', source: 'Reuters', published_at: '2024-06-11T09:00:00Z', tags: ['Funding', 'Mistral AI', 'Europe'] },
      { title: 'Perplexity AI Hits 10M Daily Active Users', summary: 'AI search engine sees rapid growth as alternative to traditional search', url: 'https://bloomberg.com/perplexity-growth', source: 'Bloomberg', published_at: '2024-06-08T11:20:00Z', tags: ['Growth', 'Perplexity', 'Search'] },
      { title: 'Cursor Becomes Fastest Growing AI Code Editor', summary: 'YC-backed startup sees 300% month-over-month growth in developer adoption', url: 'https://techcrunch.com/cursor-growth', source: 'TechCrunch', published_at: '2024-06-05T08:45:00Z', tags: ['Growth', 'Cursor', 'Developer Tools'] },
      { title: 'ElevenLabs Launches Real-Time Voice Translation', summary: 'AI voice company introduces instant multilingual voice translation feature', url: 'https://theverge.com/elevenlabs-translation', source: 'The Verge', published_at: '2024-06-03T15:00:00Z', tags: ['Product Launch', 'ElevenLabs', 'Voice AI'] },
      { title: 'Midjourney V6 Released with Photorealistic Outputs', summary: 'Latest version shows dramatic improvements in image quality and prompt understanding', url: 'https://venturebeat.com/midjourney-v6', source: 'VentureBeat', published_at: '2024-05-28T13:15:00Z', tags: ['Product Launch', 'Midjourney', 'Image Generation'] },
      { title: 'Runway Unveils Gen-3 Alpha Video Model', summary: 'New video generation model produces higher quality and longer clips', url: 'https://techcrunch.com/runway-gen3', source: 'TechCrunch', published_at: '2024-05-25T10:30:00Z', tags: ['Product Launch', 'Runway', 'Video AI'] },
      { title: 'Hugging Face Surpasses 1 Million Models Hosted', summary: 'AI model hub reaches major milestone as open-source AI ecosystem grows', url: 'https://venturebeat.com/huggingface-milestone', source: 'VentureBeat', published_at: '2024-05-20T09:00:00Z', tags: ['Milestone', 'Hugging Face', 'Open Source'] },
      { title: 'Databricks Acquires MosaicML for $1.3B', summary: 'Data analytics giant expands AI capabilities with major acquisition', url: 'https://bloomberg.com/databricks-mosaic', source: 'Bloomberg', published_at: '2024-05-15T14:00:00Z', tags: ['Acquisition', 'Databricks', 'Enterprise AI'] },
      { title: 'Scale AI Signs $250M Government Contract', summary: 'Defense AI contract highlights growing government interest in AI infrastructure', url: 'https://reuters.com/scale-government', source: 'Reuters', published_at: '2024-05-12T11:30:00Z', tags: ['Partnership', 'Scale AI', 'Government'] },
      { title: 'Character.AI Launches Group Chat Feature', summary: 'Users can now create conversations with multiple AI characters simultaneously', url: 'https://theverge.com/characterai-group', source: 'The Verge', published_at: '2024-05-08T16:20:00Z', tags: ['Product Launch', 'Character.AI', 'Social'] },
      { title: 'Harvey AI Expands to UK Legal Market', summary: 'Legal AI platform announces expansion with major UK law firm partnerships', url: 'https://techcrunch.com/harvey-uk', source: 'TechCrunch', published_at: '2024-05-05T10:00:00Z', tags: ['Expansion', 'Harvey', 'Legal Tech'] },
      { title: 'Glean Raises $200M Series D at $2.2B Valuation', summary: 'Enterprise search startup becomes unicorn with latest funding round', url: 'https://bloomberg.com/glean-unicorn', source: 'Bloomberg', published_at: '2024-05-01T12:00:00Z', tags: ['Funding', 'Glean', 'Enterprise'] },
      { title: 'Groq Achieves Record AI Inference Speed', summary: 'Hardware startup demonstrates 500 tokens/second with LPU technology', url: 'https://venturebeat.com/groq-speed', source: 'VentureBeat', published_at: '2024-04-28T13:45:00Z', tags: ['Performance', 'Groq', 'Infrastructure'] },
      { title: 'Stability AI Releases Stable Video Diffusion', summary: 'Open-source video generation model challenges proprietary alternatives', url: 'https://techcrunch.com/stability-video', source: 'TechCrunch', published_at: '2024-04-25T09:30:00Z', tags: ['Product Launch', 'Stability AI', 'Open Source'] },
      { title: 'Cohere Partners with Oracle for Enterprise AI', summary: 'Canadian AI startup announces major cloud partnership', url: 'https://reuters.com/cohere-oracle', source: 'Reuters', published_at: '2024-04-20T11:00:00Z', tags: ['Partnership', 'Cohere', 'Enterprise'] },
      { title: 'Replit Introduces AI-Powered App Builder', summary: 'Coding platform launches natural language app generation feature', url: 'https://theverge.com/replit-builder', source: 'The Verge', published_at: '2024-04-18T14:15:00Z', tags: ['Product Launch', 'Replit', 'No-Code'] },
      { title: 'GitHub Copilot Reaches 1.8M Paid Subscribers', summary: 'Microsoft-owned AI coding assistant shows strong enterprise adoption', url: 'https://bloomberg.com/copilot-subscribers', source: 'Bloomberg', published_at: '2024-04-15T10:20:00Z', tags: ['Milestone', 'GitHub', 'Microsoft'] },
      { title: 'Adept AI Demos ACT-1 Agent Navigating Web', summary: 'AI agent successfully completes complex multi-step web tasks', url: 'https://venturebeat.com/adept-act1', source: 'VentureBeat', published_at: '2024-04-12T15:30:00Z', tags: ['Product Launch', 'Adept', 'AI Agents'] },
      { title: 'Cognition AI Unveils Devin, First AI Software Engineer', summary: 'Startup claims AI can autonomously complete engineering tasks', url: 'https://techcrunch.com/cognition-devin', source: 'TechCrunch', published_at: '2024-04-10T09:00:00Z', tags: ['Product Launch', 'Cognition', 'AI Agents'] },
      { title: 'Pinecone Announces Serverless Vector Database', summary: 'Vector DB startup removes infrastructure management overhead', url: 'https://theverge.com/pinecone-serverless', source: 'The Verge', published_at: '2024-04-08T13:00:00Z', tags: ['Product Launch', 'Pinecone', 'Infrastructure'] },
      { title: 'LangChain Raises $25M Series A from Sequoia', summary: 'LLM orchestration framework becomes go-to standard for AI apps', url: 'https://techcrunch.com/langchain-funding', source: 'TechCrunch', published_at: '2024-04-05T10:45:00Z', tags: ['Funding', 'LangChain', 'Developer Tools'] },
      { title: 'Synthesia Hits $1B Valuation with Series C', summary: 'AI video platform becomes unicorn as enterprise adoption accelerates', url: 'https://bloomberg.com/synthesia-unicorn', source: 'Bloomberg', published_at: '2024-04-01T12:30:00Z', tags: ['Funding', 'Synthesia', 'Video AI'] },
      { title: 'HeyGen Launches Video Translation Feature', summary: 'AI dubbing technology maintains lip-sync across 40+ languages', url: 'https://venturebeat.com/heygen-translation', source: 'VentureBeat', published_at: '2024-03-28T14:00:00Z', tags: ['Product Launch', 'HeyGen', 'Localization'] },
      { title: 'Pika Labs Raises $55M for AI Video Generation', summary: 'Stanford research project becomes startup with Lightspeed backing', url: 'https://techcrunch.com/pika-funding', source: 'TechCrunch', published_at: '2024-03-25T11:20:00Z', tags: ['Funding', 'Pika', 'Video AI'] },
      { title: 'Weights & Biases Becomes ML Ops Standard', summary: 'Experiment tracking platform used by 80% of Fortune 500 AI teams', url: 'https://venturebeat.com/wandb-adoption', source: 'VentureBeat', published_at: '2024-03-20T09:45:00Z', tags: ['Milestone', 'Weights & Biases', 'MLOps'] },
      { title: 'Together AI Announces Llama-2-70B Fine-Tuning', summary: 'Cloud platform makes enterprise LLM customization accessible', url: 'https://theverge.com/together-finetuning', source: 'The Verge', published_at: '2024-03-18T13:15:00Z', tags: ['Product Launch', 'Together AI', 'Fine-Tuning'] },
      { title: 'Notion AI Reaches 30M Active Users', summary: 'Workspace tool sees AI features drive 40% growth in user base', url: 'https://bloomberg.com/notion-growth', source: 'Bloomberg', published_at: '2024-03-15T10:00:00Z', tags: ['Milestone', 'Notion', 'Productivity'] },
      { title: 'Linear Launches AI-Powered Project Planning', summary: 'Issue tracker introduces intelligent sprint planning and estimation', url: 'https://techcrunch.com/linear-ai', source: 'TechCrunch', published_at: '2024-03-12T15:45:00Z', tags: ['Product Launch', 'Linear', 'Project Management'] },
      { title: 'Vercel Releases v0, AI Web Design Tool', summary: 'Deployment platform enters AI-powered web development market', url: 'https://theverge.com/vercel-v0', source: 'The Verge', published_at: '2024-03-10T12:20:00Z', tags: ['Product Launch', 'Vercel', 'Web Development'] },
      { title: 'Tabnine Launches Enterprise AI Code Security', summary: 'Code completion tool adds privacy-focused enterprise features', url: 'https://venturebeat.com/tabnine-enterprise', source: 'VentureBeat', published_at: '2024-03-08T09:30:00Z', tags: ['Product Launch', 'Tabnine', 'Security'] },
      { title: 'Codeium Surpasses 500K Developer Users', summary: 'Free AI coding assistant sees rapid adoption among individual developers', url: 'https://techcrunch.com/codeium-growth', source: 'TechCrunch', published_at: '2024-03-05T14:00:00Z', tags: ['Milestone', 'Codeium', 'Developer Tools'] },
      { title: 'Roboflow Raises $40M for Computer Vision Platform', summary: 'Computer vision startup expands as edge AI applications grow', url: 'https://bloomberg.com/roboflow-funding', source: 'Bloomberg', published_at: '2024-03-01T11:15:00Z', tags: ['Funding', 'Roboflow', 'Computer Vision'] },
      { title: 'Landing AI Partners with BMW for Factory Vision', summary: 'Andrew Ng company brings AI quality control to automotive manufacturing', url: 'https://reuters.com/landingai-bmw', source: 'Reuters', published_at: '2024-02-28T13:45:00Z', tags: ['Partnership', 'Landing AI', 'Manufacturing'] },
      { title: 'Weaviate Launches Hybrid Search with Vector + Keyword', summary: 'Open-source vector DB combines semantic and keyword search', url: 'https://theverge.com/weaviate-hybrid', source: 'The Verge', published_at: '2024-02-25T10:30:00Z', tags: ['Product Launch', 'Weaviate', 'Search'] },
      { title: 'Qdrant Raises $28M Seed Round', summary: 'High-performance vector database startup announces funding', url: 'https://techcrunch.com/qdrant-seed', source: 'TechCrunch', published_at: '2024-02-20T15:00:00Z', tags: ['Funding', 'Qdrant', 'Infrastructure'] },
      { title: 'Magic Dev Raises $320M at Unprecedented Valuation', summary: 'AI coding startup emerges from stealth with massive funding round', url: 'https://bloomberg.com/magic-funding', source: 'Bloomberg', published_at: '2024-02-18T12:00:00Z', tags: ['Funding', 'Magic', 'AI Coding'] },
      { title: 'Poolside AI Launches from Paris with $126M', summary: 'European AI coding startup attracts top-tier VC backing', url: 'https://techcrunch.com/poolside-launch', source: 'TechCrunch', published_at: '2024-02-15T09:45:00Z', tags: ['Funding', 'Poolside', 'Europe'] },
      { title: 'Sierra AI Raises $110M for Customer Service Agents', summary: 'Former Salesforce executives build AI customer service platform', url: 'https://venturebeat.com/sierra-funding', source: 'VentureBeat', published_at: '2024-02-12T14:20:00Z', tags: ['Funding', 'Sierra', 'Customer Service'] },
      { title: 'Imbue Demonstrates Reasoning AI Breakthrough', summary: 'AI startup shows models can learn to reason about complex tasks', url: 'https://theverge.com/imbue-reasoning', source: 'The Verge', published_at: '2024-02-10T11:00:00Z', tags: ['Research', 'Imbue', 'AGI'] },
      { title: 'Luma AI Launches Dream Machine Video Generator', summary: 'High-quality AI video generation now accessible to consumers', url: 'https://techcrunch.com/luma-dream', source: 'TechCrunch', published_at: '2024-02-08T13:30:00Z', tags: ['Product Launch', 'Luma AI', 'Video Generation'] },
      { title: 'Hedra Raises $10M for Character-Consistent Video', summary: 'Seed round enables AI video with persistent character features', url: 'https://venturebeat.com/hedra-seed', source: 'VentureBeat', published_at: '2024-02-05T10:15:00Z', tags: ['Funding', 'Hedra', 'Video AI'] },
      { title: 'D-ID Announces Real-Time Digital Human API', summary: 'Video AI platform enables live conversations with digital avatars', url: 'https://theverge.com/did-realtime', source: 'The Verge', published_at: '2024-02-01T15:45:00Z', tags: ['Product Launch', 'D-ID', 'Digital Humans'] },
      { title: 'Captions App Hits 10M Downloads with AI Editing', summary: 'Mobile video editor grows rapidly with AI-powered features', url: 'https://techcrunch.com/captions-growth', source: 'TechCrunch', published_at: '2024-01-28T12:30:00Z', tags: ['Milestone', 'Captions', 'Mobile'] },
      { title: 'Descript Raises $50M Series C from OpenAI Fund', summary: 'Audio/video editing platform expands AI capabilities', url: 'https://bloomberg.com/descript-funding', source: 'Bloomberg', published_at: '2024-01-25T09:00:00Z', tags: ['Funding', 'Descript', 'Content Creation'] },
      { title: 'Adobe Firefly Generates 3 Billion Images', summary: 'Generative AI tools see massive adoption across Creative Cloud', url: 'https://venturebeat.com/adobe-firefly', source: 'VentureBeat', published_at: '2024-01-20T14:15:00Z', tags: ['Milestone', 'Adobe', 'Generative AI'] },
      { title: 'Canva Launches Magic Studio AI Suite', summary: 'Design platform integrates suite of AI-powered creative tools', url: 'https://theverge.com/canva-magic', source: 'The Verge', published_at: '2024-01-18T11:45:00Z', tags: ['Product Launch', 'Canva', 'Design Tools'] },
      { title: 'Galileo Raises $18M for LLM Observability', summary: 'ML evaluation platform helps enterprises monitor AI quality', url: 'https://techcrunch.com/galileo-series-a', source: 'TechCrunch', published_at: '2024-01-15T10:20:00Z', tags: ['Funding', 'Galileo', 'MLOps'] },
      { title: 'Lovable Emerges with AI Website Builder', summary: 'No-code platform generates production-ready websites from text', url: 'https://venturebeat.com/lovable-launch', source: 'VentureBeat', published_at: '2024-01-12T13:00:00Z', tags: ['Product Launch', 'Lovable', 'No-Code'] },
    ];
    
    const { data: newsArticles, error: newsError } = await supabase
      .from('news_articles')
      .insert(newsArticlesData)
      .select();
    
    if (newsError) {
      logResult('News Articles', false);
      console.error(newsError);
    } else {
      logResult('News Articles', true, newsArticles?.length);
    }

    // 7. Seed Investments (junction table)
    console.log('🤝 Seeding investments...');
    const investmentsData = [
      { investor_id: investors?.find(i => i.slug === 'microsoft-m12')?.id, company_id: companies?.find(c => c.slug === 'openai')?.id, funding_round_id: fundingRounds?.find(fr => fr.round_type === 'Series C' && fr.company_id === companies?.find(c => c.slug === 'openai')?.id)?.id, investment_date: '2023-10-15', stake_percentage: 49.0 },
      { investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id, company_id: companies?.find(c => c.slug === 'perplexity')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'perplexity')?.id)?.id, investment_date: '2024-04-23', stake_percentage: 15.0 },
      { investor_id: investors?.find(i => i.slug === 'andreessen-horowitz')?.id, company_id: companies?.find(c => c.slug === 'cursor')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'cursor')?.id)?.id, investment_date: '2024-03-08', stake_percentage: 20.0 },
      { investor_id: investors?.find(i => i.slug === 'sequoia-capital')?.id, company_id: companies?.find(c => c.slug === 'elevenlabs')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'elevenlabs')?.id)?.id, investment_date: '2024-01-22', stake_percentage: 12.0 },
      { investor_id: investors?.find(i => i.slug === 'general-catalyst')?.id, company_id: companies?.find(c => c.slug === 'mistral-ai')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'mistral-ai')?.id)?.id, investment_date: '2024-06-11', stake_percentage: 18.0 },
      { investor_id: investors?.find(i => i.slug === 'nvidia-ventures')?.id, company_id: companies?.find(c => c.slug === 'cohere')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'cohere')?.id)?.id, investment_date: '2023-06-08', stake_percentage: 8.0 },
      { investor_id: investors?.find(i => i.slug === 'tiger-global')?.id, company_id: companies?.find(c => c.slug === 'databricks')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'databricks')?.id)?.id, investment_date: '2023-09-14', stake_percentage: 5.0 },
      { investor_id: investors?.find(i => i.slug === 'accel')?.id, company_id: companies?.find(c => c.slug === 'scale-ai')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'scale-ai')?.id)?.id, investment_date: '2023-05-03', stake_percentage: 10.0 },
      { investor_id: investors?.find(i => i.slug === 'coatue-management')?.id, company_id: companies?.find(c => c.slug === 'hugging-face')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'hugging-face')?.id)?.id, investment_date: '2023-08-24', stake_percentage: 14.0 },
      { investor_id: investors?.find(i => i.slug === 'founders-fund')?.id, company_id: companies?.find(c => c.slug === 'cognition')?.id, funding_round_id: fundingRounds?.find(fr => fr.company_id === companies?.find(c => c.slug === 'cognition')?.id)?.id, investment_date: '2024-03-12', stake_percentage: 25.0 },
    ];
    
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .insert(investmentsData.filter(inv => inv.investor_id && inv.company_id))
      .select();
    
    if (investmentsError) {
      logResult('Investments', false);
      console.error(investmentsError);
    } else {
      logResult('Investments', true, investments?.length);
    }

    // 8. Seed Company News (junction table)
    console.log('📎 Seeding company news relationships...');
    const companyNewsData = [
      { company_id: companies?.find(c => c.slug === 'openai')?.id, news_article_id: newsArticles?.find(n => n.title.includes('OpenAI Raises'))?.id },
      { company_id: companies?.find(c => c.slug === 'anthropic')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Claude 3'))?.id },
      { company_id: companies?.find(c => c.slug === 'mistral-ai')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Mistral AI Secures'))?.id },
      { company_id: companies?.find(c => c.slug === 'perplexity')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Perplexity AI Hits'))?.id },
      { company_id: companies?.find(c => c.slug === 'cursor')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Cursor Becomes'))?.id },
      { company_id: companies?.find(c => c.slug === 'elevenlabs')?.id, news_article_id: newsArticles?.find(n => n.title.includes('ElevenLabs Launches'))?.id },
      { company_id: companies?.find(c => c.slug === 'midjourney')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Midjourney V6'))?.id },
      { company_id: companies?.find(c => c.slug === 'runway')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Runway Unveils'))?.id },
      { company_id: companies?.find(c => c.slug === 'hugging-face')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Hugging Face Surpasses'))?.id },
      { company_id: companies?.find(c => c.slug === 'databricks')?.id, news_article_id: newsArticles?.find(n => n.title.includes('Databricks Acquires'))?.id },
    ];
    
    const { data: companyNews, error: companyNewsError } = await supabase
      .from('company_news')
      .insert(companyNewsData.filter(cn => cn.company_id && cn.news_article_id))
      .select();
    
    if (companyNewsError) {
      logResult('Company News', false);
      console.error(companyNewsError);
    } else {
      logResult('Company News', true, companyNews?.length);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Companies: ${companies?.length || 0}`);
    console.log(`- Investors: ${investors?.length || 0}`);
    console.log(`- Founders: ${founders?.length || 0}`);
    console.log(`- Funding Rounds: ${fundingRounds?.length || 0}`);
    console.log(`- Products: ${products?.length || 0}`);
    console.log(`- News Articles: ${newsArticles?.length || 0}`);
    console.log(`- Investments: ${investments?.length || 0}`);
    console.log(`- Company News: ${companyNews?.length || 0}`);

  } catch (error) {
    console.error('\n❌ Fatal error during seeding:');
    console.error(error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
