import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { product, url, contentType } = await request.json();
  if (!product || !contentType) {
    return Response.json({ error: 'product and contentType are required' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 500 });
  }

  const ctx = `
Product: ${product.productName}
Category: ${product.category}
Description: ${product.description}
Key Features: ${(product.keyFeatures || []).join(', ')}
Applications: ${(product.applications || []).join(', ')}
Target Customers: ${(product.targetCustomers || []).join(', ')}
Industries: ${(product.industries || []).join(', ')}
Primary Keywords: ${(product.primaryKeywords || []).join(', ')}
Secondary Keywords: ${(product.secondaryKeywords || []).join(', ')}
USPs: ${(product.uniqueSellingPoints || []).join(', ')}
Problem Solved: ${product.problemSolved || ''}
Product URL: ${url}
Brand: Micron Aerosols | Made in India | Est. 1989 | "Global Standards. Imagined in India."`;

  const prompts = {
    'seo-title-meta': `Generate SEO-optimized titles and meta descriptions for this product page.

${ctx}

Provide:
1. THREE title tag options (50–60 characters each) — include primary keyword, brand name
2. THREE meta description options (145–155 characters each) — include key benefit and CTA
3. The recommended H1 heading for the product page
4. Three H2 subheadings to use in the product description

Format with clear labels. Prioritize keywords industrial buyers actually search.`,

    'blog-post': `Write a comprehensive, SEO-optimized blog post / product guide for Micron Aerosols.

${ctx}

Write a complete article with these sections:
## [Compelling Headline with primary keyword]
**Introduction** — hook with the problem, preview the solution (100 words)
## What is [Product Name]?
## Key Features and Benefits (detailed bullet list)
## How to Use [Product Name] — Step by Step
## Industries and Applications
## Why Choose Micron Aerosols?
## Frequently Asked Questions (5 Q&As)
## Conclusion + Call to Action

Target length: 1200–1500 words. Use keywords naturally. Write for engineers and procurement managers searching Google. Emphasize Made in India and Global Standards quality.`,

    'youtube-script': `Write a complete YouTube video script and all YouTube metadata.

${ctx}

Create:
**VIDEO TITLE** (SEO-optimized, max 60 characters)
**THUMBNAIL TEXT** (5 words max, shown on the thumbnail image)

**SCRIPT** (4–5 minutes):
- Hook (first 15 seconds — must grab attention immediately)
- Introduction (who we are, what this product is)
- Problem the product solves
- Product demonstration narration (describe what to show on camera)
- Key features walkthrough (mention each feature)
- Real-world applications
- Why Micron Aerosols (Made in India, 1989, global quality)
- Call to action (visit website, subscribe, contact for bulk)

**YOUTUBE DESCRIPTION** (500 words, SEO-rich, include product URL)
**VIDEO CHAPTERS** (with timestamps)
**20 YOUTUBE TAGS** (mix of broad and specific)`,

    'instagram-content': `Create a complete Instagram content pack for this product.

${ctx}

Create:
**5 INSTAGRAM FEED POST CAPTIONS** (different angles):
Post 1 — Product Introduction
Post 2 — Educational: How to use it
Post 3 — Application spotlight
Post 4 — Made in India pride
Post 5 — Customer problem/solution

Each caption: 150–200 words, include relevant emojis, strong CTA, end with 30 hashtags (mix popular + niche).

**3 REEL IDEAS**:
For each reel: Title | Concept | Shot list | Text overlays | Suggested audio type

**INSTAGRAM BIO** (150 characters max)

**5 STORY IDEAS** with interactive elements (polls, questions, countdowns)`,

    'linkedin-posts': `Create LinkedIn content for this industrial product.

${ctx}

Create **5 LinkedIn posts** (one for each angle):
1. Problem/Solution post
2. Product feature spotlight
3. Made in India manufacturing pride
4. Customer success story (realistic but fictional)
5. Industry insight / thought leadership

Each post: 200–300 words, professional B2B tone, end with a question to drive comments. Include relevant hashtags.

Then: **ONE LinkedIn Article outline** (800 words) about the industry challenge this product solves.

**5 core LinkedIn hashtags** to always use.`,

    'quora-answers': `Write detailed Quora answers for questions related to this product.

${ctx}

Write 5 complete Quora answer sets:

For each:
**QUESTION TO FIND ON QUORA:** [exact search phrase]
**ANSWER:** (300–400 words, genuinely helpful expert advice, mention Micron Aerosols and the product as one good option — not as the only answer)

Answers should read as real expert knowledge, not advertising. Include specific technical details that demonstrate expertise.`,

    'indimart-listing': `Create a complete, optimized IndiaMART product listing.

${ctx}

Create:
**PRODUCT TITLE** (100 characters max, keyword-optimized for IndiaMART search)
**PRODUCT DESCRIPTION** (600–800 words, highly detailed technical description)
**SPECIFICATIONS TABLE** (all technical specs in a clean table format)
**10 KEY FEATURES** (bullet list)
**APPLICATIONS LIST** (all use cases)
**INDIAMART KEYWORDS** (comma-separated list of 20 keywords to add)
**SUGGESTED CATEGORY PATH** on IndiaMART
**5 LISTING FAQs** (Q&A format)

Format everything ready to copy-paste directly into IndiaMART's product listing form.`,

    'schema-markup': `Generate complete Schema.org structured data markup for this product page.

${ctx}

Generate these JSON-LD blocks (each in a separate code block):

1. **Product Schema** — with all relevant properties (name, description, brand, manufacturer, url, offers, image)
2. **FAQ Schema** — with 5 common questions about this product
3. **HowTo Schema** — for how to use this product (5 steps)
4. **BreadcrumbList Schema** — for the product page navigation
5. **Organization Schema** — for Micron Aerosols (add to homepage only)

Format as ready-to-use JSON-LD code blocks to paste into the website's <head> section.`,

    'email-template': `Create email marketing templates for B2B outreach about this product.

${ctx}

Create:
**1. COLD OUTREACH EMAIL**
Subject line (A/B options) | Preview text | Body (200 words) | CTA button text

**2. PRODUCT ANNOUNCEMENT EMAIL** (for existing customers)
Subject line | Preview text | Body (300 words) | CTA

**3. FOLLOW-UP EMAIL** (after an inquiry)
Subject line | Body (150 words) | CTA

**4. NEWSLETTER SECTION** (200 words, product spotlight format)

For every email include: subject line, preview text, personalization placeholders [Company Name], [First Name].`,
  };

  const prompt = prompts[contentType] || `Generate comprehensive digital marketing content for: ${contentType}\n\n${ctx}`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const stream = client.messages.stream({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 4000,
            system: `You are a senior digital marketing expert specializing in Indian B2B industrial products.
Create content that ranks on Google, gets cited by AI tools (Gemini, ChatGPT, Perplexity), and converts industrial buyers.
Always write content that is:
- Technically accurate and credible
- Keyword-optimized without being spammy
- Formatted with headers (##), bullets, numbered lists
- Ready to use immediately (copy-paste ready)
- Proud of "Made in India" while emphasizing global quality standards`,
            messages: [{ role: 'user', content: prompt }],
          });

          stream.on('text', (text) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`));
          });

          stream.on('finalMessage', () => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
            controller.close();
          });

          stream.on('error', (err) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`));
            controller.close();
          });
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
