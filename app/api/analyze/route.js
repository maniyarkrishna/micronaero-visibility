export async function POST(request) {
  const { url } = await request.json();
  if (!url) return Response.json({ error: 'URL is required' }, { status: 400 });

  // ── Step 1: Fetch the product page ────────────────────────────────────────
  let pageText = '';
  let pageHtml = '';
  try {
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VisibilityBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    pageHtml = await pageRes.text();
    pageText = pageHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 6000);
  } catch {
    // proceed with URL context only
  }

  // ── Step 2: If Groq key present → use AI analysis ─────────────────────────
  if (process.env.GROQ_API_KEY) {
    try {
      const product = await analyzeWithGroq(url, pageText);
      return Response.json({ success: true, product, url });
    } catch (err) {
      console.error('Groq analysis failed, using rule-based fallback:', err.message);
    }
  }

  // ── Step 3: Rule-based fallback (no API key needed) ───────────────────────
  const product = analyzeWithRules(url, pageText, pageHtml);
  return Response.json({ success: true, product, url });
}

// ── Groq AI analysis ─────────────────────────────────────────────────────────
async function analyzeWithGroq(url, pageText) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content: `You are a digital marketing expert specialising in Indian B2B industrial products.
Micron Aerosols (micronaero.com) manufactures specialty aerosol chemicals since 1989.
Products cover electronics, welding, plastic moulding, automotive sectors.
Return only valid JSON — no other text.`,
        },
        {
          role: 'user',
          content: `Analyze this Micron Aerosols product page and return marketing intelligence as JSON.

URL: ${url}
Page Content: ${pageText}

Return ONLY valid JSON:
{
  "productName": "Full product name with code e.g. 3100 Protektor® Conformal Coating",
  "productCode": "numeric code e.g. 3100",
  "brandName": "sub-brand if any e.g. Protektor®",
  "category": "product category e.g. Electronics Protection",
  "series": "series name e.g. S3000",
  "description": "2-3 sentence description of what the product is and does",
  "keyFeatures": ["feature1","feature2","feature3","feature4","feature5"],
  "applications": ["application1","application2","application3"],
  "targetCustomers": ["type1","type2","type3"],
  "industries": ["Industry1","Industry2"],
  "primaryKeywords": ["keyword1","keyword2","keyword3","keyword4","keyword5"],
  "secondaryKeywords": ["long tail 1","long tail 2","long tail 3"],
  "uniqueSellingPoints": ["USP1","USP2"],
  "madeInIndia": true,
  "priceRange": "price if visible or 'Contact for pricing'",
  "problemSolved": "one sentence: the core problem this product solves"
}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || '';
  const match = raw.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : raw);
}

// ── Rule-based fallback: extract product info from page text ─────────────────
function analyzeWithRules(url, pageText, pageHtml) {
  // Extract product name from URL slug
  const urlSlug = url.split('/').pop() || '';
  const nameFromSlug = urlSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();

  // Extract product code (4-digit number at start)
  const codeMatch = nameFromSlug.match(/^(\d{4})/);
  const productCode = codeMatch ? codeMatch[1] : '';

  // Detect category from URL or page content
  const text = (url + ' ' + pageText).toLowerCase();
  const categoryMap = [
    { keys: ['conformal','pcb','electronic','protektor','circuit'],     cat: 'Electronics Protection',   series: 'S3000', industry: 'Electronics' },
    { keys: ['anti-spatter','antispatter','welding','fabrication'],     cat: 'Welding & Fabrication',    series: 'S2000', industry: 'Welding' },
    { keys: ['mould','mold','release','extrusion','plastic'],           cat: 'Plastic Moulding',         series: 'S1000', industry: 'Plastics' },
    { keys: ['automotive','car','vehicle','brake','engine'],            cat: 'Automotive Maintenance',   series: 'S5000', industry: 'Automotive' },
    { keys: ['contact-cleaner','contact cleaner','electrical'],         cat: 'Electronics Protection',   series: 'S3000', industry: 'Electronics' },
    { keys: ['zinc','paint','coat','armor'],                            cat: 'Protective Coatings',      series: 'S2000', industry: 'Metal Fabrication' },
  ];
  let category = 'Industrial Aerosols', series = 'S4000', primaryIndustry = 'Manufacturing';
  for (const { keys, cat, series: s, industry } of categoryMap) {
    if (keys.some(k => text.includes(k))) {
      category = cat; series = s; primaryIndustry = industry; break;
    }
  }

  // Extract price
  const priceMatch = pageText.match(/Rs\.?\s*([\d,]+)/i);
  const priceRange = priceMatch ? `From ₹${priceMatch[1]}` : 'Contact for pricing';

  // Build keyword suggestions based on product name and category
  const baseName = nameFromSlug.replace(/^\d+\s*/, '').trim();
  const primaryKeywords = [
    baseName.toLowerCase(),
    `${baseName.toLowerCase()} India`,
    `${category.toLowerCase()} spray`,
    `${baseName.toLowerCase()} manufacturer`,
    `buy ${baseName.toLowerCase()} online`,
  ];
  const secondaryKeywords = [
    `${baseName.toLowerCase()} price`,
    `${baseName.toLowerCase()} bulk`,
    `made in India ${category.toLowerCase()}`,
  ];

  // Industry-specific customer types
  const customerMap = {
    'Electronics Protection': ['Electronics manufacturers', 'PCB assemblers', 'Defense contractors', 'EMS companies'],
    'Welding & Fabrication':  ['Welding shops', 'Steel fabricators', 'Shipyards', 'Auto body shops'],
    'Plastic Moulding':       ['Plastic moulders', 'Injection moulding units', 'Packaging manufacturers'],
    'Automotive Maintenance': ['Automotive workshops', 'Fleet managers', 'Auto parts manufacturers'],
    'Industrial Aerosols':    ['Manufacturing plants', 'Maintenance teams', 'Industrial distributors'],
  };
  const targetCustomers = customerMap[category] || customerMap['Industrial Aerosols'];

  return {
    productName:    nameFromSlug || 'Micron Aerosols Product',
    productCode:    productCode,
    brandName:      text.includes('protektor') ? 'Protektor®' : text.includes('mama') ? 'M.A.M.A.®' : 'Micron Aerosols',
    category,
    series,
    description:    `${nameFromSlug} is a premium ${category.toLowerCase()} solution by Micron Aerosols, manufactured in India to global quality standards. Designed for ${primaryIndustry.toLowerCase()} applications, it delivers consistent, professional results for industrial and professional users.`,
    keyFeatures:    [
      `Premium ${category} formulation`,
      'Made in India to global standards',
      'Easy aerosol application — no special equipment needed',
      'Consistent results across industrial environments',
      'Available in aerosol and bulk liquid formats',
    ],
    applications:   [
      `${primaryIndustry} production and maintenance`,
      `Industrial ${category.toLowerCase()} applications`,
      'OEM and contract manufacturing',
    ],
    targetCustomers,
    industries:     [primaryIndustry, 'Manufacturing', 'Industrial Maintenance'],
    primaryKeywords,
    secondaryKeywords,
    uniqueSellingPoints: [
      'Made in India to international quality standards',
      '35+ years of specialty aerosol manufacturing expertise',
      'Available in bulk for high-volume industrial use',
    ],
    madeInIndia:    true,
    priceRange,
    problemSolved:  `Inconsistent and expensive ${category.toLowerCase()} in industrial processes`,
  };
}
