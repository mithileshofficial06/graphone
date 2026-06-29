import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log('Seeding supplemental data...\n');

  const { data: companies } = await supabase.from('companies').select('id,slug');
  const { data: investors } = await supabase.from('investors').select('id,slug');

  if (!companies || !investors) {
    console.error('Could not fetch companies/investors. Run the base seed first.');
    process.exit(1);
  }

  const co = (slug: string) => companies.find(c => c.slug === slug)?.id;
  const inv = (slug: string) => investors.find(i => i.slug === slug)?.id;

  // ── 1. FOUNDERS ───────────────────────────────────────────────────────────
  console.log('Seeding founders...');
  const foundersData = [
    { company_id: co('openai'), name: 'Greg Brockman', title: 'President', bio: 'Co-founder and President of OpenAI. Former CTO of Stripe.', linkedin_url: 'https://linkedin.com/in/gregbrockman', twitter_url: 'https://twitter.com/gdb' },
    { company_id: co('openai'), name: 'Ilya Sutskever', title: 'Co-Founder & Chief Scientist', bio: 'Deep learning pioneer and co-inventor of AlexNet. Left OpenAI in 2024.', linkedin_url: 'https://linkedin.com/in/ilya-sutskever' },
    { company_id: co('anthropic'), name: 'Daniela Amodei', title: 'President', bio: 'Co-founder and President of Anthropic. Former VP of Operations at OpenAI.', linkedin_url: 'https://linkedin.com/in/daniela-amodei' },
    { company_id: co('anthropic'), name: 'Tom Brown', title: 'Co-Founder', bio: 'Lead author on GPT-3. Former OpenAI researcher.', linkedin_url: 'https://linkedin.com/in/tom-b-brown' },
    { company_id: co('mistral-ai'), name: 'Timothee Lacroix', title: 'Co-Founder & CTO', bio: 'Former Meta AI researcher. Expert in large-scale distributed training.', linkedin_url: 'https://linkedin.com/in/timothee-lacroix' },
    { company_id: co('perplexity'), name: 'Denis Yarats', title: 'Co-Founder & CTO', bio: 'Former FAIR researcher at Meta. PhD from NYU.', linkedin_url: 'https://linkedin.com/in/denisyarats' },
    { company_id: co('perplexity'), name: 'Johnny Ho', title: 'Co-Founder', bio: 'Former Quora engineer. Worked on knowledge retrieval systems.', linkedin_url: 'https://linkedin.com/in/johnnytho' },
    { company_id: co('cursor'), name: 'Sualeh Asif', title: 'Co-Founder', bio: 'MIT graduate. Previously at OpenAI.', linkedin_url: 'https://linkedin.com/in/sualeh-asif' },
    { company_id: co('cursor'), name: 'Arvid Lunnemark', title: 'Co-Founder', bio: 'Swedish software engineer. Built developer tools at scale.', linkedin_url: 'https://linkedin.com/in/arvid-lunnemark' },
    { company_id: co('elevenlabs'), name: 'Mati Staniszewski', title: 'CEO', bio: 'Former McKinsey and Palantir. Warsaw native building the future of voice.', linkedin_url: 'https://linkedin.com/in/mati-staniszewski' },
    { company_id: co('elevenlabs'), name: 'Piotr Dabkowski', title: 'CTO', bio: 'Machine learning researcher. Expert in neural text-to-speech systems.', linkedin_url: 'https://linkedin.com/in/piotr-dabkowski' },
    { company_id: co('midjourney'), name: 'David Holz', title: 'Founder & CEO', bio: 'Previously co-founded Leap Motion. Self-funded AI art pioneer.', linkedin_url: 'https://linkedin.com/in/david-holz', twitter_url: 'https://twitter.com/DavidSHolz' },
    { company_id: co('runway'), name: 'Cristobal Valenzuela', title: 'CEO', bio: 'Chilean entrepreneur. MFA from NYU ITP. Co-founded Runway in 2018.', linkedin_url: 'https://linkedin.com/in/cristobalvalenzuela', twitter_url: 'https://twitter.com/c_valenzuela' },
    { company_id: co('runway'), name: 'Alejandro Matamala', title: 'CTO', bio: 'Co-founder of Runway. Expert in ML infrastructure at scale.', linkedin_url: 'https://linkedin.com/in/alejandro-matamala' },
    { company_id: co('pika'), name: 'Demi Guo', title: 'CEO', bio: 'Stanford PhD dropout. Forbes 30 Under 30. Former research at Google Brain.', linkedin_url: 'https://linkedin.com/in/demi-guo', twitter_url: 'https://twitter.com/demi_guo_' },
    { company_id: co('pika'), name: 'Chenlin Meng', title: 'CTO', bio: 'Stanford PhD in computer science. Research in diffusion models.', linkedin_url: 'https://linkedin.com/in/chenlin-meng' },
    { company_id: co('hugging-face'), name: 'Thomas Wolf', title: 'Chief Science Officer', bio: 'Co-founder and CSO. PhD in Theoretical Physics. Author of transformers library.', linkedin_url: 'https://linkedin.com/in/thomas-wolf-a56309a3', twitter_url: 'https://twitter.com/Thom_Wolf' },
    { company_id: co('hugging-face'), name: 'Julien Chaumond', title: 'CTO', bio: 'Co-founder and CTO. Former engineer at Spool (acquired by Pinterest).', linkedin_url: 'https://linkedin.com/in/julienchaumond' },
    { company_id: co('cohere'), name: 'Aidan Gomez', title: 'CEO', bio: 'Co-author of Attention Is All You Need. Former Google Brain researcher. Oxford dropout.', linkedin_url: 'https://linkedin.com/in/aidangomez', twitter_url: 'https://twitter.com/aidangomez' },
    { company_id: co('cohere'), name: 'Nick Frosst', title: 'Co-Founder', bio: 'Co-founder. Musician and researcher. Former Google Brain.', linkedin_url: 'https://linkedin.com/in/nick-frosst' },
    { company_id: co('cohere'), name: 'Ivan Zhang', title: 'CTO', bio: 'Co-founder and CTO. Former Google Brain engineer.', linkedin_url: 'https://linkedin.com/in/ivan-zhang-cohere' },
    { company_id: co('scale-ai'), name: 'Lucy Guo', title: 'Co-Founder', bio: 'Co-founder of Scale AI. Forbes 30 Under 30. Previously at Quora and Pinterest.', linkedin_url: 'https://linkedin.com/in/lucy-guo', twitter_url: 'https://twitter.com/lucy_guo' },
    { company_id: co('databricks'), name: 'Ali Ghodsi', title: 'CEO', bio: 'Co-founder and CEO. Professor at UC Berkeley. Co-creator of Apache Spark.', linkedin_url: 'https://linkedin.com/in/alighodsi', twitter_url: 'https://twitter.com/alighodsi' },
    { company_id: co('databricks'), name: 'Matei Zaharia', title: 'CTO', bio: 'Creator of Apache Spark. Stanford PhD. Professor at MIT.', linkedin_url: 'https://linkedin.com/in/mateizaharia', twitter_url: 'https://twitter.com/matei_zaharia' },
    { company_id: co('harvey'), name: 'Winston Weinberg', title: 'CEO', bio: 'Co-founder and CEO. Former Goldman Sachs and legal attorney.', linkedin_url: 'https://linkedin.com/in/winston-weinberg' },
    { company_id: co('harvey'), name: 'Gabriel Pereyra', title: 'CTO', bio: 'Co-founder and CTO. Former OpenAI research scientist.', linkedin_url: 'https://linkedin.com/in/gabriel-pereyra' },
    { company_id: co('glean'), name: 'Arvind Jain', title: 'CEO', bio: 'Co-founder and CEO. Former VP of Engineering at Google. Founded Rubrik.', linkedin_url: 'https://linkedin.com/in/arvindjain', twitter_url: 'https://twitter.com/arvindj' },
    { company_id: co('groq'), name: 'Jonathan Ross', title: 'CEO', bio: 'Founder of Groq. Original creator of the Google TPU.', linkedin_url: 'https://linkedin.com/in/jonathan-ross-groq', twitter_url: 'https://twitter.com/_jonathan_ross_' },
    { company_id: co('langchain'), name: 'Harrison Chase', title: 'CEO', bio: 'Co-founder and CEO of LangChain. Former Robust Intelligence ML engineer.', linkedin_url: 'https://linkedin.com/in/harrison-chase-961287118', twitter_url: 'https://twitter.com/hwchase17' },
    { company_id: co('pinecone'), name: 'Edo Liberty', title: 'CEO', bio: 'Founder and CEO. Former Head of Amazon AI Labs. PhD from Yale.', linkedin_url: 'https://linkedin.com/in/edo-liberty', twitter_url: 'https://twitter.com/edoliberty' },
    { company_id: co('cognition'), name: 'Scott Wu', title: 'CEO', bio: 'Co-founder and CEO. IOI gold medalist. Former top competitive programmer in the world.', linkedin_url: 'https://linkedin.com/in/scott-wu-cognition', twitter_url: 'https://twitter.com/scottwu_ai' },
    { company_id: co('cognition'), name: 'Steven Hao', title: 'Co-Founder', bio: 'Co-founder. Former Waymo and Scale AI research engineer.', linkedin_url: 'https://linkedin.com/in/steven-hao-cognition' },
    { company_id: co('character-ai'), name: 'Noam Shazeer', title: 'CEO', bio: 'Co-founder and CEO. Co-author of Attention Is All You Need. Former Google senior researcher.', linkedin_url: 'https://linkedin.com/in/noam-shazeer' },
    { company_id: co('character-ai'), name: 'Daniel De Freitas', title: 'Co-Founder', bio: 'Co-founder. Former Google Brain engineer. Built early LaMDA conversational models.', linkedin_url: 'https://linkedin.com/in/daniel-de-freitas' },
    { company_id: co('replit'), name: 'Haya Odeh', title: 'Co-Founder', bio: 'Co-founder. Former Badoo software engineer.', linkedin_url: 'https://linkedin.com/in/haya-odeh' },
    { company_id: co('weaviate'), name: 'Bob van Luijt', title: 'CEO', bio: 'Co-founder and CEO. Built SeMI Technologies which became Weaviate.', linkedin_url: 'https://linkedin.com/in/bobvanluijt', twitter_url: 'https://twitter.com/bobvanluijt' },
    { company_id: co('together-ai'), name: 'Vipul Ved Prakash', title: 'CEO', bio: 'Co-founder and CEO. Serial entrepreneur. Founded Topsy (acquired by Apple).', linkedin_url: 'https://linkedin.com/in/vipulvedprakash' },
    { company_id: co('weights-and-biases'), name: 'Lukas Biewald', title: 'CEO', bio: 'Co-founder and CEO. Former Kaggle data scientist. Stanford CS grad.', linkedin_url: 'https://linkedin.com/in/lukasbiewald', twitter_url: 'https://twitter.com/l2k' },
    { company_id: co('weights-and-biases'), name: 'Shawn Lewis', title: 'CTO', bio: 'Co-founder and CTO. Expert in ML experiment management systems.', linkedin_url: 'https://linkedin.com/in/shawn-lewis-wandb' },
    { company_id: co('heygen'), name: 'Joshua Xu', title: 'CEO', bio: 'Co-founder and CEO. Former ByteDance engineer. Built viral video tools.', linkedin_url: 'https://linkedin.com/in/joshua-xu-heygen', twitter_url: 'https://twitter.com/joshua_xu_' },
    { company_id: co('synthesia'), name: 'Victor Riparbelli', title: 'CEO', bio: 'Co-founder and CEO. Serial entrepreneur from Denmark.', linkedin_url: 'https://linkedin.com/in/victorriparbelli', twitter_url: 'https://twitter.com/vriparbelli' },
    { company_id: co('sierra'), name: 'Bret Taylor', title: 'CEO', bio: 'Co-founder and CEO. Former Chair of Twitter board. Former CTO of Salesforce. Co-creator of Google Maps.', linkedin_url: 'https://linkedin.com/in/brettaylor', twitter_url: 'https://twitter.com/btaylor' },
    { company_id: co('sierra'), name: 'Clay Bavor', title: 'Co-Founder', bio: 'Co-founder. Former VP of Google Labs and Google VR/AR.', linkedin_url: 'https://linkedin.com/in/claybavor' },
    { company_id: co('adept'), name: 'David Luan', title: 'CEO', bio: 'Co-founder and CEO. Former VP of Engineering at OpenAI. Previously at Google Brain.', linkedin_url: 'https://linkedin.com/in/davidluan' },
    { company_id: co('luma-ai'), name: 'Amit Jain', title: 'CEO', bio: 'Co-founder and CEO. Former Apple AR/ML engineer.', linkedin_url: 'https://linkedin.com/in/amit-jain-lumalabs' },
    { company_id: co('magic'), name: 'Eric Steinberger', title: 'CEO', bio: 'Founder and CEO. Former Oxford DPhil in ML. Previously at DeepMind.', linkedin_url: 'https://linkedin.com/in/eric-steinberger' },
    { company_id: co('poolside'), name: 'Eiso Kant', title: 'CEO', bio: 'Co-founder and CEO. Previously CTO at Athenian.', linkedin_url: 'https://linkedin.com/in/eisokant' },
    { company_id: co('poolside'), name: 'Jason Warner', title: 'Co-Founder', bio: 'Co-founder. Former CTO of GitHub. Former engineering leader at Heroku.', linkedin_url: 'https://linkedin.com/in/jasonwarner' },
    { company_id: co('captions'), name: 'Gaurav Misra', title: 'CEO', bio: 'Co-founder and CEO. Former Apple and Snapchat product leader.', linkedin_url: 'https://linkedin.com/in/gauravmisra' },
    { company_id: co('d-id'), name: 'Gil Perry', title: 'CEO', bio: 'Co-founder and CEO. AI pioneer in de-identification and digital humans.', linkedin_url: 'https://linkedin.com/in/gil-perry-d-id' },
    { company_id: co('descript'), name: 'Andrew Mason', title: 'CEO', bio: 'Founder and CEO. Previously founded Groupon. Pioneer in audio/video editing.', linkedin_url: 'https://linkedin.com/in/andrewmason', twitter_url: 'https://twitter.com/andrewmason' },
    { company_id: co('lovable'), name: 'Anton Osika', title: 'CEO', bio: 'Co-founder and CEO. Former AI researcher at Sana Labs. Created open-source gpt-engineer.', linkedin_url: 'https://linkedin.com/in/antonosika', twitter_url: 'https://twitter.com/antonosika' },
    { company_id: co('stability-ai'), name: 'Emad Mostaque', title: 'Founder', bio: 'Founder of Stability AI. Former hedge fund quantitative analyst.', linkedin_url: 'https://linkedin.com/in/emad-mostaque', twitter_url: 'https://twitter.com/EMostaque' },
  ].filter(f => f.company_id);

  const { error: foundersError } = await supabase.from('founders').insert(foundersData);
  if (foundersError) { console.log('Founders note:', foundersError.message); } else { console.log(`Founders: ${foundersData.length} inserted`); }

  // ── 2. FUNDING ROUNDS ─────────────────────────────────────────────────────
  console.log('Seeding funding rounds...');
  const fundingData = [
    { company_id: co('openai'), round_type: 'Seed', amount: 1000000, valuation: 5000000, announced_date: '2015-12-11', lead_investor_id: inv('y-combinator') },
    { company_id: co('openai'), round_type: 'Series A', amount: 100000000, valuation: 500000000, announced_date: '2019-03-11', lead_investor_id: inv('microsoft-m12') },
    { company_id: co('openai'), round_type: 'Series B', amount: 1000000000, valuation: 7000000000, announced_date: '2021-01-06', lead_investor_id: inv('microsoft-m12') },
    { company_id: co('anthropic'), round_type: 'Seed', amount: 124000000, valuation: 450000000, announced_date: '2021-05-23', lead_investor_id: inv('spark-capital') },
    { company_id: co('anthropic'), round_type: 'Series A', amount: 704000000, valuation: 4100000000, announced_date: '2022-04-29', lead_investor_id: inv('spark-capital') },
    { company_id: co('anthropic'), round_type: 'Series B', amount: 450000000, valuation: 4100000000, announced_date: '2023-05-23', lead_investor_id: inv('gv') },
    { company_id: co('mistral-ai'), round_type: 'Seed', amount: 113000000, valuation: 260000000, announced_date: '2023-06-13', lead_investor_id: inv('lightspeed-venture-partners') },
    { company_id: co('mistral-ai'), round_type: 'Series A', amount: 415000000, valuation: 2000000000, announced_date: '2023-12-11', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('perplexity'), round_type: 'Seed', amount: 3700000, valuation: 24000000, announced_date: '2022-10-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('perplexity'), round_type: 'Series A', amount: 25600000, valuation: 160000000, announced_date: '2023-03-26', lead_investor_id: inv('nea') },
    { company_id: co('cursor'), round_type: 'Seed', amount: 8000000, valuation: 20000000, announced_date: '2023-10-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('elevenlabs'), round_type: 'Seed', amount: 2000000, valuation: 10000000, announced_date: '2022-09-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('elevenlabs'), round_type: 'Series A', amount: 19000000, valuation: 110000000, announced_date: '2023-01-20', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('runway'), round_type: 'Seed', amount: 2000000, valuation: 8000000, announced_date: '2018-09-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('runway'), round_type: 'Series A', amount: 8500000, valuation: 50000000, announced_date: '2021-12-07', lead_investor_id: inv('accel') },
    { company_id: co('runway'), round_type: 'Series B', amount: 50000000, valuation: 500000000, announced_date: '2022-12-05', lead_investor_id: inv('gv') },
    { company_id: co('pika'), round_type: 'Seed', amount: 55000000, valuation: 200000000, announced_date: '2023-11-28', lead_investor_id: inv('lightspeed-venture-partners') },
    { company_id: co('hugging-face'), round_type: 'Series A', amount: 15000000, valuation: 50000000, announced_date: '2020-12-23', lead_investor_id: inv('accel') },
    { company_id: co('hugging-face'), round_type: 'Series B', amount: 40000000, valuation: 400000000, announced_date: '2021-03-17', lead_investor_id: inv('index-ventures') },
    { company_id: co('hugging-face'), round_type: 'Series C', amount: 100000000, valuation: 2000000000, announced_date: '2022-05-09', lead_investor_id: inv('coatue-management') },
    { company_id: co('cohere'), round_type: 'Seed', amount: 40000000, valuation: 200000000, announced_date: '2021-05-01', lead_investor_id: inv('index-ventures') },
    { company_id: co('cohere'), round_type: 'Series A', amount: 125000000, valuation: 700000000, announced_date: '2021-11-08', lead_investor_id: inv('tiger-global') },
    { company_id: co('cohere'), round_type: 'Series B', amount: 250000000, valuation: 2100000000, announced_date: '2022-02-01', lead_investor_id: inv('tiger-global') },
    { company_id: co('databricks'), round_type: 'Series A', amount: 14000000, valuation: 80000000, announced_date: '2014-09-01', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('databricks'), round_type: 'Series B', amount: 31000000, valuation: 200000000, announced_date: '2015-11-01', lead_investor_id: inv('nea') },
    { company_id: co('databricks'), round_type: 'Series C', amount: 60000000, valuation: 600000000, announced_date: '2017-02-01', lead_investor_id: inv('nea') },
    { company_id: co('databricks'), round_type: 'Series D', amount: 250000000, valuation: 2750000000, announced_date: '2019-02-05', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('databricks'), round_type: 'Series E', amount: 400000000, valuation: 6200000000, announced_date: '2020-10-22', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('databricks'), round_type: 'Series F', amount: 1600000000, valuation: 28000000000, announced_date: '2021-08-31', lead_investor_id: inv('softbank-vision-fund') },
    { company_id: co('databricks'), round_type: 'Series G', amount: 500000000, valuation: 38000000000, announced_date: '2023-04-05', lead_investor_id: inv('tiger-global') },
    { company_id: co('scale-ai'), round_type: 'Seed', amount: 4700000, valuation: 25000000, announced_date: '2016-07-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('scale-ai'), round_type: 'Series A', amount: 18000000, valuation: 100000000, announced_date: '2018-08-01', lead_investor_id: inv('accel') },
    { company_id: co('scale-ai'), round_type: 'Series B', amount: 100000000, valuation: 1000000000, announced_date: '2019-08-05', lead_investor_id: inv('accel') },
    { company_id: co('scale-ai'), round_type: 'Series C', amount: 155000000, valuation: 3500000000, announced_date: '2021-04-13', lead_investor_id: inv('tiger-global') },
    { company_id: co('scale-ai'), round_type: 'Series D', amount: 325000000, valuation: 7300000000, announced_date: '2021-10-13', lead_investor_id: inv('tiger-global') },
    { company_id: co('harvey'), round_type: 'Seed', amount: 5000000, valuation: 20000000, announced_date: '2022-11-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('harvey'), round_type: 'Series A', amount: 21000000, valuation: 100000000, announced_date: '2023-04-20', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('glean'), round_type: 'Series A', amount: 25000000, valuation: 100000000, announced_date: '2020-04-01', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('glean'), round_type: 'Series B', amount: 100000000, valuation: 500000000, announced_date: '2021-05-18', lead_investor_id: inv('lightspeed-venture-partners') },
    { company_id: co('glean'), round_type: 'Series C', amount: 200000000, valuation: 1000000000, announced_date: '2023-02-15', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('groq'), round_type: 'Series A', amount: 67000000, valuation: 400000000, announced_date: '2021-04-14', lead_investor_id: inv('nea') },
    { company_id: co('groq'), round_type: 'Series B', amount: 300000000, valuation: 1200000000, announced_date: '2023-10-18', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('groq'), round_type: 'Series C', amount: 640000000, valuation: 2800000000, announced_date: '2024-08-05', lead_investor_id: inv('softbank-vision-fund') },
    { company_id: co('langchain'), round_type: 'Seed', amount: 10000000, valuation: 50000000, announced_date: '2023-02-01', lead_investor_id: inv('bessemer-venture-partners') },
    { company_id: co('langchain'), round_type: 'Series A', amount: 25000000, valuation: 200000000, announced_date: '2023-07-18', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('pinecone'), round_type: 'Series A', amount: 28000000, valuation: 150000000, announced_date: '2021-03-23', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('replit'), round_type: 'Series A', amount: 20000000, valuation: 100000000, announced_date: '2021-07-22', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('weaviate'), round_type: 'Series A', amount: 16000000, valuation: 70000000, announced_date: '2022-04-14', lead_investor_id: inv('index-ventures') },
    { company_id: co('weaviate'), round_type: 'Series B', amount: 50000000, valuation: 200000000, announced_date: '2023-05-03', lead_investor_id: inv('index-ventures') },
    { company_id: co('together-ai'), round_type: 'Series A', amount: 20000000, valuation: 100000000, announced_date: '2022-12-01', lead_investor_id: inv('bessemer-venture-partners') },
    { company_id: co('character-ai'), round_type: 'Seed', amount: 1500000, valuation: 5000000, announced_date: '2022-01-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('cognition'), round_type: 'Seed', amount: 21000000, valuation: 100000000, announced_date: '2023-11-01', lead_investor_id: inv('founders-fund') },
    { company_id: co('weights-and-biases'), round_type: 'Series A', amount: 45000000, valuation: 200000000, announced_date: '2020-08-19', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('weights-and-biases'), round_type: 'Series B', amount: 200000000, valuation: 1000000000, announced_date: '2021-10-06', lead_investor_id: inv('coatue-management') },
    { company_id: co('synthesia'), round_type: 'Seed', amount: 2600000, valuation: 12000000, announced_date: '2019-06-01', lead_investor_id: inv('index-ventures') },
    { company_id: co('synthesia'), round_type: 'Series A', amount: 12500000, valuation: 60000000, announced_date: '2020-10-01', lead_investor_id: inv('index-ventures') },
    { company_id: co('synthesia'), round_type: 'Series B', amount: 50000000, valuation: 500000000, announced_date: '2021-12-08', lead_investor_id: inv('accel') },
    { company_id: co('heygen'), round_type: 'Seed', amount: 5600000, valuation: 25000000, announced_date: '2022-06-01', lead_investor_id: inv('accel') },
    { company_id: co('adept'), round_type: 'Seed', amount: 65000000, valuation: 300000000, announced_date: '2022-04-27', lead_investor_id: inv('general-catalyst') },
    { company_id: co('sierra'), round_type: 'Seed', amount: 110000000, valuation: 500000000, announced_date: '2023-11-01', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('luma-ai'), round_type: 'Seed', amount: 4000000, valuation: 20000000, announced_date: '2021-08-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('magic'), round_type: 'Seed', amount: 23000000, valuation: 100000000, announced_date: '2023-02-01', lead_investor_id: inv('bessemer-venture-partners') },
    { company_id: co('poolside'), round_type: 'Seed', amount: 126000000, valuation: 500000000, announced_date: '2023-06-01', lead_investor_id: inv('accel') },
    { company_id: co('lovable'), round_type: 'Seed', amount: 7000000, valuation: 35000000, announced_date: '2023-09-01', lead_investor_id: inv('index-ventures') },
    { company_id: co('d-id'), round_type: 'Series A', amount: 13500000, valuation: 60000000, announced_date: '2021-07-14', lead_investor_id: inv('accel') },
    { company_id: co('d-id'), round_type: 'Series B', amount: 25000000, valuation: 200000000, announced_date: '2023-05-24', lead_investor_id: inv('accel') },
    { company_id: co('captions'), round_type: 'Series A', amount: 25000000, valuation: 100000000, announced_date: '2022-09-01', lead_investor_id: inv('sequoia-capital') },
    { company_id: co('descript'), round_type: 'Series A', amount: 5000000, valuation: 25000000, announced_date: '2018-09-01', lead_investor_id: inv('redpoint-ventures') },
    { company_id: co('descript'), round_type: 'Series B', amount: 30000000, valuation: 200000000, announced_date: '2020-08-21', lead_investor_id: inv('andreessen-horowitz') },
    { company_id: co('hedra'), round_type: 'Seed', amount: 10000000, valuation: 40000000, announced_date: '2024-01-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('qdrant'), round_type: 'Seed', amount: 7500000, valuation: 28000000, announced_date: '2023-04-01', lead_investor_id: inv('bessemer-venture-partners') },
    { company_id: co('roboflow'), round_type: 'Seed', amount: 2100000, valuation: 10000000, announced_date: '2020-01-01', lead_investor_id: inv('y-combinator') },
    { company_id: co('roboflow'), round_type: 'Series A', amount: 20000000, valuation: 100000000, announced_date: '2022-06-01', lead_investor_id: inv('sequoia-capital') },
  ].filter(r => r.company_id && r.lead_investor_id);

  const { error: fundingError } = await supabase.from('funding_rounds').insert(fundingData);
  if (fundingError) { console.log('Funding note:', fundingError.message); } else { console.log(`Funding rounds: ${fundingData.length} inserted`); }

  // ── 3. PRODUCTS ───────────────────────────────────────────────────────────
  console.log('Seeding products...');
  const productsData = [
    { company_id: co('openai'), slug: 'gpt-4o', name: 'GPT-4o', description: 'Multimodal flagship model processing text, audio, and images in real time.', category: 'AI Models', url: 'https://openai.com/gpt-4o', upvotes: 21400 },
    { company_id: co('openai'), slug: 'dall-e-3', name: 'DALL-E 3', description: 'Text-to-image generation model with high fidelity and instruction following.', category: 'Image Generation', url: 'https://openai.com/dall-e-3', upvotes: 9820 },
    { company_id: co('openai'), slug: 'whisper', name: 'Whisper', description: 'Open-source automatic speech recognition trained on 680k hours of audio.', category: 'Voice AI', url: 'https://openai.com/research/whisper', upvotes: 8640 },
    { company_id: co('openai'), slug: 'openai-api', name: 'OpenAI API', description: 'Developer API for GPT-4, embeddings, DALL-E, Whisper, and more.', category: 'Developer Tools', url: 'https://platform.openai.com', upvotes: 18730 },
    { company_id: co('anthropic'), slug: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Most intelligent model. Excels at coding, analysis, and vision tasks.', category: 'AI Models', url: 'https://claude.ai', upvotes: 14890 },
    { company_id: co('anthropic'), slug: 'claude-api', name: 'Claude API', description: 'Enterprise-grade API supporting tool use, vision, and 200K context window.', category: 'Developer Tools', url: 'https://docs.anthropic.com', upvotes: 9430 },
    { company_id: co('mistral-ai'), slug: 'mistral-large', name: 'Mistral Large', description: 'Top-tier reasoning model with 128k context and strong multilingual support.', category: 'AI Models', url: 'https://mistral.ai/news/mistral-large', upvotes: 7840 },
    { company_id: co('mistral-ai'), slug: 'le-chat', name: 'Le Chat', description: 'Conversational AI assistant. Free and fast with multiple model options.', category: 'Chat', url: 'https://chat.mistral.ai', upvotes: 5620 },
    { company_id: co('mistral-ai'), slug: 'codestral', name: 'Codestral', description: 'State-of-the-art code generation model for 80+ programming languages.', category: 'AI Coding', url: 'https://mistral.ai/news/codestral', upvotes: 6780 },
    { company_id: co('perplexity'), slug: 'perplexity-pro', name: 'Perplexity Pro', description: 'AI search with GPT-4, Claude, and real-time web data. Unlimited searches.', category: 'AI Search', url: 'https://perplexity.ai/pro', upvotes: 7340 },
    { company_id: co('perplexity'), slug: 'perplexity-api', name: 'Perplexity API', description: 'Sonar API for real-time web-grounded LLM responses in your applications.', category: 'Developer Tools', url: 'https://docs.perplexity.ai', upvotes: 4120 },
    { company_id: co('elevenlabs'), slug: 'elevenlabs-dubbing', name: 'ElevenLabs Dubbing', description: 'Automatic dubbing preserving the original speaker voice across 29 languages.', category: 'Voice AI', url: 'https://elevenlabs.io/dubbing', upvotes: 6320 },
    { company_id: co('elevenlabs'), slug: 'elevenlabs-sound-effects', name: 'Sound Effects', description: 'Generate sound effects and foley audio from text prompts.', category: 'Audio AI', url: 'https://elevenlabs.io/sound-effects', upvotes: 4890 },
    { company_id: co('runway'), slug: 'runway-gen-2', name: 'Runway Gen-2', description: 'Text-to-video and image-to-video AI model for creative professionals.', category: 'Video Generation', url: 'https://runwayml.com/gen-2', upvotes: 5640 },
    { company_id: co('runway'), slug: 'runway-act-one', name: 'Act One', description: 'Character animation tool transferring human performance to digital avatars.', category: 'Video AI', url: 'https://runwayml.com/act-one', upvotes: 4210 },
    { company_id: co('midjourney'), slug: 'midjourney-v6-1', name: 'Midjourney v6.1', description: 'Latest model with improved coherence, photorealism and text rendering.', category: 'Image Generation', url: 'https://midjourney.com', upvotes: 16540 },
    { company_id: co('hugging-face'), slug: 'huggingface-hub', name: 'Hugging Face Hub', description: 'Host, discover, and collaborate on 500k+ models and 100k+ datasets.', category: 'ML Platform', url: 'https://huggingface.co/models', upvotes: 14320 },
    { company_id: co('hugging-face'), slug: 'transformers', name: 'Transformers Library', description: 'Open-source NLP model library. 130k+ GitHub stars. Industry standard.', category: 'Developer Tools', url: 'https://huggingface.co/docs/transformers', upvotes: 12180 },
    { company_id: co('hugging-face'), slug: 'inference-api', name: 'Inference API', description: 'Production-ready model serving at scale with a simple HTTP API.', category: 'ML Infrastructure', url: 'https://huggingface.co/inference-api', upvotes: 6720 },
    { company_id: co('cohere'), slug: 'command-r-plus', name: 'Command R+', description: 'High-performance model for enterprise RAG and multi-step tool use.', category: 'AI Models', url: 'https://cohere.com/command', upvotes: 5840 },
    { company_id: co('cohere'), slug: 'cohere-embed', name: 'Embed v3', description: 'State-of-the-art text and image embedding model for semantic search.', category: 'ML Infrastructure', url: 'https://cohere.com/embed', upvotes: 4920 },
    { company_id: co('databricks'), slug: 'dbrx', name: 'DBRX', description: 'Open-source mixture-of-experts LLM outperforming GPT-3.5 on benchmarks.', category: 'AI Models', url: 'https://databricks.com/blog/introducing-dbrx', upvotes: 7210 },
    { company_id: co('databricks'), slug: 'mosaic-ai', name: 'Mosaic AI', description: 'End-to-end platform for training, fine-tuning, and deploying LLMs on your data.', category: 'ML Platform', url: 'https://databricks.com/product/machine-learning', upvotes: 5840 },
    { company_id: co('scale-ai'), slug: 'scale-spellbook', name: 'Scale Spellbook', description: 'LLM prompt engineering and evaluation platform for enterprise teams.', category: 'Developer Tools', url: 'https://spellbook.scale.com', upvotes: 4630 },
    { company_id: co('groq'), slug: 'groqcloud', name: 'GroqCloud', description: 'Fastest inference API. Run Llama 3, Mixtral at 300+ tokens/sec.', category: 'ML Infrastructure', url: 'https://console.groq.com', upvotes: 8940 },
    { company_id: co('langchain'), slug: 'langchain-library', name: 'LangChain', description: 'Open-source LLM application framework. 85k+ GitHub stars. Industry standard.', category: 'Developer Tools', url: 'https://python.langchain.com', upvotes: 13280 },
    { company_id: co('langchain'), slug: 'langsmith', name: 'LangSmith', description: 'Platform for debugging, testing and monitoring LLM applications.', category: 'Developer Tools', url: 'https://smith.langchain.com', upvotes: 7640 },
    { company_id: co('pinecone'), slug: 'pinecone-serverless', name: 'Pinecone Serverless', description: 'Fully managed vector database that scales automatically to zero.', category: 'ML Infrastructure', url: 'https://pinecone.io/product', upvotes: 7820 },
    { company_id: co('weaviate'), slug: 'weaviate-cloud', name: 'Weaviate Cloud', description: 'Managed vector database with hybrid search combining vectors and BM25.', category: 'ML Infrastructure', url: 'https://weaviate.io/developers/wcs', upvotes: 5410 },
    { company_id: co('qdrant'), slug: 'qdrant-cloud', name: 'Qdrant Cloud', description: 'High-performance Rust-based vector database with filtering and payload support.', category: 'ML Infrastructure', url: 'https://cloud.qdrant.io', upvotes: 4820 },
    { company_id: co('cognition'), slug: 'devin-ai', name: 'Devin', description: 'First fully autonomous AI software engineer. Completes engineering tasks end-to-end.', category: 'AI Coding', url: 'https://cognition.ai/devin', upvotes: 9840 },
    { company_id: co('character-ai'), slug: 'character-ai-app', name: 'Character.AI App', description: 'Create and chat with AI characters. 20M+ daily active users.', category: 'Chat', url: 'https://character.ai', upvotes: 11280 },
    { company_id: co('harvey'), slug: 'harvey-ai-platform', name: 'Harvey Platform', description: 'AI legal research, drafting, and analysis for law firms and corporate legal teams.', category: 'Legal AI', url: 'https://harvey.ai', upvotes: 5320 },
    { company_id: co('glean'), slug: 'glean-search', name: 'Glean Search', description: 'AI-powered workplace search across 100+ apps including Slack, Jira and Drive.', category: 'Enterprise AI', url: 'https://glean.com/product', upvotes: 6140 },
    { company_id: co('together-ai'), slug: 'together-inference', name: 'Together Inference', description: 'Run top open-source models at scale: Llama 3, Mistral, Qwen and more.', category: 'ML Infrastructure', url: 'https://api.together.ai', upvotes: 5720 },
    { company_id: co('replit'), slug: 'replit-agent', name: 'Replit Agent', description: 'Build full-stack apps from natural language. Deploy instantly to production.', category: 'AI Coding', url: 'https://replit.com/ai', upvotes: 8340 },
    { company_id: co('heygen'), slug: 'heygen-interactive-avatar', name: 'Interactive Avatar', description: 'Real-time talking AI avatar with live two-way conversation powered by LLMs.', category: 'Video AI', url: 'https://heygen.com/interactive-avatar', upvotes: 5820 },
    { company_id: co('synthesia'), slug: 'synthesia-studio', name: 'Synthesia STUDIO', description: 'Create AI videos with 230+ avatars in 140+ languages. No camera needed.', category: 'Video AI', url: 'https://synthesia.io/features/studio', upvotes: 6240 },
    { company_id: co('sierra'), slug: 'sierra-platform', name: 'Sierra Platform', description: 'Deploy AI agents for customer service with brand-consistent conversational AI.', category: 'Enterprise AI', url: 'https://sierra.ai/product', upvotes: 4380 },
    { company_id: co('weights-and-biases'), slug: 'wandb-weave', name: 'Weave', description: 'LLMOps platform for tracing, evaluating and improving AI application quality.', category: 'Developer Tools', url: 'https://wandb.ai/site/weave', upvotes: 4920 },
    { company_id: co('weights-and-biases'), slug: 'wandb-platform', name: 'W&B Platform', description: 'MLOps platform used by 900k+ ML practitioners to track experiments.', category: 'ML Platform', url: 'https://wandb.ai', upvotes: 8640 },
    { company_id: co('lovable'), slug: 'lovable-app', name: 'Lovable', description: 'Build full-stack web apps from text in seconds. Powered by Claude and React.', category: 'AI Coding', url: 'https://lovable.dev', upvotes: 7840 },
    { company_id: co('stability-ai'), slug: 'stable-diffusion-3', name: 'Stable Diffusion 3', description: 'Open weights multimodal diffusion transformer with improved text rendering.', category: 'Image Generation', url: 'https://stability.ai/stable-diffusion-3', upvotes: 9420 },
    { company_id: co('stability-ai'), slug: 'stable-audio', name: 'Stable Audio', description: 'AI music and sound generation from text. Generate up to 3-minute tracks.', category: 'Audio AI', url: 'https://stableaudio.com', upvotes: 5640 },
    { company_id: co('descript'), slug: 'descript-studio-sound', name: 'Studio Sound', description: 'AI audio enhancement removing noise and making recordings studio quality.', category: 'Audio AI', url: 'https://descript.com/studio-sound', upvotes: 5280 },
    { company_id: co('captions'), slug: 'captions-ai-creator', name: 'Captions AI Creator', description: 'Record, edit and enhance videos with AI. Automatic captions and eye contact correction.', category: 'Video AI', url: 'https://captions.ai', upvotes: 6840 },
    { company_id: co('d-id'), slug: 'd-id-agents', name: 'D-ID Agents', description: 'Create lifelike AI agents with face, voice, and personality for real-time interactions.', category: 'Video AI', url: 'https://d-id.com/agents', upvotes: 4620 },
    { company_id: co('luma-ai'), slug: 'luma-genie', name: 'Genie', description: 'Generate 3D objects from text or images in seconds.', category: 'AI 3D', url: 'https://lumalabs.ai/genie', upvotes: 4820 },
    { company_id: co('pika'), slug: 'pika-2-0', name: 'Pika 2.0', description: 'Next-gen video generation with improved physics and cinematic quality.', category: 'Video Generation', url: 'https://pika.art', upvotes: 6540 },
  ].filter(p => p.company_id);

  const { error: productsError } = await supabase.from('products').insert(productsData);
  if (productsError) { console.log('Products note:', productsError.message); } else { console.log(`Products: ${productsData.length} inserted`); }

  // ── 4. NEWS ARTICLES ──────────────────────────────────────────────────────
  console.log('Seeding news articles...');
  const newsData = [
    { title: 'OpenAI GPT-4o Launches with Real-Time Audio and Vision', summary: 'New flagship model combines text, vision and audio available to free users.', url: 'https://techcrunch.com/2024/05/13/openai-gpt-4o', source: 'TechCrunch', published_at: '2024-05-13T18:00:00Z', tags: ['Product Launch', 'OpenAI', 'Multimodal'] },
    { title: 'OpenAI Raises $6.6B at $157B Valuation', summary: 'Largest venture round in history led by Thrive Capital.', url: 'https://wsj.com/openai-funding-2024', source: 'WSJ', published_at: '2024-10-02T10:00:00Z', tags: ['Funding', 'OpenAI', 'Record'] },
    { title: 'Anthropic Claude 3.5 Sonnet Tops AI Benchmarks', summary: 'New model outperforms GPT-4o on coding and reasoning while being faster and cheaper.', url: 'https://theverge.com/anthropic-claude-3-5', source: 'The Verge', published_at: '2024-06-20T14:00:00Z', tags: ['Product Launch', 'Anthropic', 'Benchmark'] },
    { title: 'Mistral AI Releases Mistral Large 2 Open-Weights Model', summary: '123B parameter model rivaling frontier models released under research license.', url: 'https://venturebeat.com/mistral-large-2', source: 'VentureBeat', published_at: '2024-07-24T10:00:00Z', tags: ['Open Source', 'Mistral AI', 'LLM'] },
    { title: 'Perplexity Pro Launches with Unlimited Searches at $20/Month', summary: 'AI search engine introduces premium tier with advanced model access.', url: 'https://techcrunch.com/perplexity-pro', source: 'TechCrunch', published_at: '2024-01-10T09:00:00Z', tags: ['Product', 'Perplexity', 'Search'] },
    { title: 'Cursor Raises $60M Series A Led by a16z', summary: 'AI code editor backed by Andreessen Horowitz accelerates beyond 100k developers.', url: 'https://techcrunch.com/cursor-series-a', source: 'TechCrunch', published_at: '2024-03-08T11:00:00Z', tags: ['Funding', 'Cursor', 'Developer Tools'] },
    { title: 'ElevenLabs Becomes Fastest-Growing AI Voice Unicorn', summary: 'Company crosses $1B valuation less than 2 years after launch.', url: 'https://bloomberg.com/elevenlabs-unicorn', source: 'Bloomberg', published_at: '2024-01-22T12:00:00Z', tags: ['Milestone', 'ElevenLabs', 'Unicorn'] },
    { title: 'Midjourney V6 Alpha Drops with Photorealistic Prompting', summary: 'Latest release brings dramatic quality improvements and native text rendering.', url: 'https://theverge.com/midjourney-v6-alpha', source: 'The Verge', published_at: '2023-12-21T15:00:00Z', tags: ['Product Launch', 'Midjourney', 'Image AI'] },
    { title: 'Runway Gen-3 Alpha Produces Hollywood-Quality Video', summary: 'New model generates 10-second clips with unprecedented temporal consistency.', url: 'https://techcrunch.com/runway-gen3-alpha', source: 'TechCrunch', published_at: '2024-06-17T14:00:00Z', tags: ['Product Launch', 'Runway', 'Video AI'] },
    { title: 'Hugging Face Raises $235M Series D Led by Google, Nvidia, Amazon', summary: 'Open-source AI model hub achieves $4.5B valuation with tech giant backing.', url: 'https://techcrunch.com/huggingface-series-d', source: 'TechCrunch', published_at: '2023-08-24T13:00:00Z', tags: ['Funding', 'Hugging Face', 'Open Source'] },
    { title: 'Cohere Launches Command R+ for Enterprise RAG', summary: '104B parameter model optimized for retrieval-augmented generation in production.', url: 'https://venturebeat.com/cohere-command-r-plus', source: 'VentureBeat', published_at: '2024-04-04T10:00:00Z', tags: ['Product Launch', 'Cohere', 'Enterprise AI'] },
    { title: 'Databricks Valued at $62B in Latest Fundraise', summary: 'Data and AI company raises $10B in largest private tech round of 2024.', url: 'https://reuters.com/databricks-62b', source: 'Reuters', published_at: '2024-09-17T11:00:00Z', tags: ['Funding', 'Databricks', 'Enterprise'] },
    { title: 'Scale AI Signs $1B US Government AI Data Contract', summary: 'Company wins landmark contract for AI-ready data infrastructure for the Pentagon.', url: 'https://bloomberg.com/scale-ai-pentagon', source: 'Bloomberg', published_at: '2024-04-18T10:00:00Z', tags: ['Government', 'Scale AI', 'Defense'] },
    { title: 'Character.AI Surpasses 20M Daily Active Users', summary: 'AI companionship app sees surge driven by Gen Z, averaging 2 hours per day.', url: 'https://techcrunch.com/character-ai-dau', source: 'TechCrunch', published_at: '2024-03-15T12:00:00Z', tags: ['Milestone', 'Character.AI', 'Growth'] },
    { title: 'Harvey Expands to 100 Top Global Law Firms', summary: 'Legal AI secures partnerships with Allen and Overy, PwC and major institutions.', url: 'https://reuters.com/harvey-law-firms', source: 'Reuters', published_at: '2024-06-01T09:00:00Z', tags: ['Partnership', 'Harvey', 'Legal Tech'] },
    { title: 'Groq LPU Achieves 500 Tokens Per Second on Llama 3', summary: 'Language Processing Unit delivers 10x faster inference than GPU-based alternatives.', url: 'https://venturebeat.com/groq-lpu-llama3', source: 'VentureBeat', published_at: '2024-04-18T13:00:00Z', tags: ['Performance', 'Groq', 'Inference'] },
    { title: 'Groq Raises $640M to Build AI Inference Cloud', summary: 'SoftBank-led round funds expansion of LPU chip production and data centers.', url: 'https://techcrunch.com/groq-640m', source: 'TechCrunch', published_at: '2024-08-05T10:00:00Z', tags: ['Funding', 'Groq', 'AI Infrastructure'] },
    { title: 'LangChain Announces LangGraph for Stateful AI Agents', summary: 'New framework enables complex multi-step AI workflows with memory and branching.', url: 'https://techcrunch.com/langchain-langgraph', source: 'TechCrunch', published_at: '2024-01-17T10:00:00Z', tags: ['Product Launch', 'LangChain', 'AI Agents'] },
    { title: 'Pinecone Serverless Reduces Vector Database Costs by 50x', summary: 'Vector database scales to zero when idle, eliminating idle compute costs.', url: 'https://theverge.com/pinecone-serverless', source: 'The Verge', published_at: '2024-01-22T11:00:00Z', tags: ['Product Launch', 'Pinecone', 'Infrastructure'] },
    { title: 'Cognition Devin Passes Technical Screens on Upwork', summary: 'AI software engineer earns money on freelance platform passing coding tests.', url: 'https://techcrunch.com/cognition-devin-upwork', source: 'TechCrunch', published_at: '2024-03-12T09:00:00Z', tags: ['AI Agents', 'Cognition', 'Autonomous AI'] },
    { title: 'Replit Agent Builds and Deploys Full Apps from Text', summary: 'AI agent mode lets users describe apps in plain English and get working software.', url: 'https://venturebeat.com/replit-agent-2024', source: 'VentureBeat', published_at: '2024-08-07T12:00:00Z', tags: ['Product Launch', 'Replit', 'AI Agents'] },
    { title: 'Sierra AI Raises $175M Series B at $4.5B Valuation', summary: 'Bret Taylor AI customer service startup secures major Sequoia-backed round.', url: 'https://techcrunch.com/sierra-series-b', source: 'TechCrunch', published_at: '2024-10-03T10:00:00Z', tags: ['Funding', 'Sierra', 'Customer Service AI'] },
    { title: 'Weights and Biases Launches Weave for LLM Observability', summary: 'MLOps platform expands to help teams trace, debug and evaluate LLM apps.', url: 'https://venturebeat.com/wandb-weave-llm', source: 'VentureBeat', published_at: '2024-03-20T11:00:00Z', tags: ['Product Launch', 'W&B', 'LLMOps'] },
    { title: 'HeyGen Reaches 40000 Business Customers with Video Translation', summary: 'AI video startup sees explosive growth powered by viral multilingual dubbing.', url: 'https://bloomberg.com/heygen-growth', source: 'Bloomberg', published_at: '2024-04-10T13:00:00Z', tags: ['Milestone', 'HeyGen', 'Video AI'] },
    { title: 'Synthesia Wins Emmy Award for AI Video Innovation', summary: 'AI video platform recognized by Television Academy for synthetic media technology.', url: 'https://reuters.com/synthesia-emmy', source: 'Reuters', published_at: '2024-02-14T10:00:00Z', tags: ['Award', 'Synthesia', 'Video AI'] },
    { title: 'Adept AI Team Joins Amazon for Alexa and AWS AI', summary: 'AI agent startup team acquired by Amazon to accelerate AI capabilities.', url: 'https://techcrunch.com/adept-amazon', source: 'TechCrunch', published_at: '2024-06-26T11:00:00Z', tags: ['Acquisition', 'Adept', 'Amazon'] },
    { title: 'Luma Dream Machine Goes Viral with 500K Videos in First Week', summary: 'AI video generator sees unprecedented adoption on launch crashing servers.', url: 'https://theverge.com/luma-dream-machine-viral', source: 'The Verge', published_at: '2024-06-12T14:00:00Z', tags: ['Viral', 'Luma AI', 'Video AI'] },
    { title: 'Magic.dev Raises $320M to Build 100M Token Context AI Coder', summary: 'AI coding startup claims breakthrough in long-context understanding.', url: 'https://techcrunch.com/magic-dev-320m', source: 'TechCrunch', published_at: '2024-02-18T12:00:00Z', tags: ['Funding', 'Magic', 'AI Coding'] },
    { title: 'Lovable Hits $50M ARR in 6 Months After Launch', summary: 'AI website builder achieves record growth becoming fastest growing SaaS ever.', url: 'https://venturebeat.com/lovable-arr', source: 'VentureBeat', published_at: '2025-01-15T10:00:00Z', tags: ['Milestone', 'Lovable', 'Growth'] },
    { title: 'Pika Labs 1.0 Launches with Expanded Video Editing Features', summary: 'Video AI startup transitions from research demo to full production product.', url: 'https://techcrunch.com/pika-1-0', source: 'TechCrunch', published_at: '2023-11-28T14:00:00Z', tags: ['Product Launch', 'Pika', 'Video AI'] },
    { title: 'Character AI and Google Sign $2.7B Licensing Deal', summary: 'Character.AI founders Noam Shazeer and Daniel De Freitas return to Google Brain.', url: 'https://techcrunch.com/character-ai-google', source: 'TechCrunch', published_at: '2024-08-02T10:00:00Z', tags: ['Acquisition', 'Character.AI', 'Google'] },
    { title: 'Stability AI Files for Bankruptcy Protection', summary: 'Once-valued-at-$4B AI image company faces financial difficulties after leadership changes.', url: 'https://wsj.com/stability-ai-bankruptcy', source: 'WSJ', published_at: '2024-07-15T09:00:00Z', tags: ['Business', 'Stability AI', 'Restructuring'] },
  ];

  const { data: insertedNews, error: newsError } = await supabase.from('news_articles').insert(newsData).select();
  if (newsError) { console.log('News note:', newsError.message); } else { console.log(`News: ${newsData.length} inserted`); }

  // ── 5. COMPANY-NEWS LINKS ─────────────────────────────────────────────────
  if (insertedNews && insertedNews.length > 0) {
    console.log('Linking news to companies...');
    const fn = (t: string) => insertedNews.find(n => n.title.includes(t))?.id;
    const links = [
      { company_id: co('openai'), news_article_id: fn('GPT-4o Launches') },
      { company_id: co('openai'), news_article_id: fn('Raises $6.6B') },
      { company_id: co('anthropic'), news_article_id: fn('Claude 3.5 Sonnet') },
      { company_id: co('mistral-ai'), news_article_id: fn('Mistral Large 2') },
      { company_id: co('perplexity'), news_article_id: fn('Perplexity Pro Launches') },
      { company_id: co('cursor'), news_article_id: fn('Cursor Raises $60M') },
      { company_id: co('elevenlabs'), news_article_id: fn('ElevenLabs Becomes') },
      { company_id: co('midjourney'), news_article_id: fn('Midjourney V6 Alpha') },
      { company_id: co('runway'), news_article_id: fn('Runway Gen-3 Alpha') },
      { company_id: co('hugging-face'), news_article_id: fn('Hugging Face Raises $235M') },
      { company_id: co('cohere'), news_article_id: fn('Command R+') },
      { company_id: co('databricks'), news_article_id: fn('Databricks Valued at $62B') },
      { company_id: co('scale-ai'), news_article_id: fn('Scale AI Signs $1B') },
      { company_id: co('character-ai'), news_article_id: fn('Character.AI Surpasses') },
      { company_id: co('character-ai'), news_article_id: fn('Character AI and Google') },
      { company_id: co('harvey'), news_article_id: fn('Harvey Expands to 100') },
      { company_id: co('groq'), news_article_id: fn('Groq LPU Achieves') },
      { company_id: co('groq'), news_article_id: fn('Groq Raises $640M') },
      { company_id: co('langchain'), news_article_id: fn('LangGraph') },
      { company_id: co('pinecone'), news_article_id: fn('Pinecone Serverless Reduces') },
      { company_id: co('cognition'), news_article_id: fn('Cognition Devin') },
      { company_id: co('replit'), news_article_id: fn('Replit Agent Builds') },
      { company_id: co('sierra'), news_article_id: fn('Sierra AI Raises $175M') },
      { company_id: co('weights-and-biases'), news_article_id: fn('Weave for LLM') },
      { company_id: co('heygen'), news_article_id: fn('HeyGen Reaches') },
      { company_id: co('synthesia'), news_article_id: fn('Synthesia Wins Emmy') },
      { company_id: co('adept'), news_article_id: fn('Adept AI Team') },
      { company_id: co('luma-ai'), news_article_id: fn('Dream Machine Goes Viral') },
      { company_id: co('magic'), news_article_id: fn('Magic.dev Raises') },
      { company_id: co('lovable'), news_article_id: fn('Lovable Hits $50M') },
      { company_id: co('pika'), news_article_id: fn('Pika Labs 1.0') },
      { company_id: co('stability-ai'), news_article_id: fn('Stability AI Files') },
    ].filter(l => l.company_id && l.news_article_id);

    const { error: cnError } = await supabase.from('company_news').insert(links);
    if (cnError) { console.log('Links note:', cnError.message); } else { console.log(`Company-news links: ${links.length} inserted`); }
  }

  console.log('\nSupplemental seed complete!');
}

run();
