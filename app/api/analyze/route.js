import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  const { url } = await request.json();
  if (!url) return Response.json({ error: 'URL is required' }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY is not configured. Please add it to your environment variables.' }, { status: 500 });
  }

  try {
    // Fetch the product page
    let pageText = `Product page from Micron Aerosols at URL: ${url}`;
    try {
      const pageRes = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VisibilityBot/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      const html = await pageRes.text();
      pageText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 6000);
    } catch {
      // Fallback: proceed with URL context only
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: `You are a digital marketing and SEO expert specializing in Indian B2B industrial products.
Micron Aerosols (micronaero.com) is an Indian specialty aerosol chemical manufacturer founded in 1989,
tagline "Global Standards. Imagined in India." Products span electronics, welding, plastic moulding,
automotive sectors. Return only valid JSON.`,
      messages: [{
        role: 'user',
        content: `Analyze this Micron Aerosols product page and return comprehensive marketing intelligence as JSON.

URL: ${url}
Page Content: ${pageText}

Return ONLY valid JSON, no other text:
{
  "productName": "Full product name with code e.g. 3100 Protektor® Conformal Coating",
  "productCode": "numeric code e.g. 3100",
  "brandName": "sub-brand if any e.g. Protektor®",
  "category": "product category e.g. Electronics Protection",
  "series": "series name e.g. S3000",
  "description": "2-3 sentence description of what the product is and does",
  "keyFeatures": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "applications": ["application1", "application2", "application3"],
  "targetCustomers": ["Electronics manufacturers", "PCB assemblers", "type3"],
  "industries": ["Electronics", "Defense", "Automotive"],
  "primaryKeywords": ["most searched keyword", "keyword2", "keyword3", "keyword4", "keyword5"],
  "secondaryKeywords": ["long tail keyword 1", "long tail keyword 2", "long tail keyword 3"],
  "uniqueSellingPoints": ["USP1 specific", "USP2"],
  "madeInIndia": true,
  "priceRange": "price if visible or 'Contact for pricing'",
  "problemSolved": "one sentence: the core problem this product solves"
}`
      }],
    });

    let product;
    try {
      const raw = message.content[0].text.trim();
      const match = raw.match(/\{[\s\S]*\}/);
      product = JSON.parse(match ? match[0] : raw);
    } catch {
      return Response.json({ error: 'Could not parse product information. Please check the URL and try again.' }, { status: 500 });
    }

    return Response.json({ success: true, product, url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
