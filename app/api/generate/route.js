import { generateTemplateContent } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { product, url, contentType } = await request.json();
  if (!product || !contentType) {
    return Response.json({ error: 'product and contentType are required' }, { status: 400 });
  }

  const encoder = new TextEncoder();

  // ── Helper: stream a plain string as SSE ──────────────────────────────────
  function streamText(text) {
    return new ReadableStream({
      async start(controller) {
        // Stream in small chunks so the UI feels live
        const chunkSize = 80;
        for (let i = 0; i < text.length; i += chunkSize) {
          const chunk = text.slice(i, i + chunkSize);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`));
          // Small yield so the browser can render incrementally
          await new Promise(r => setTimeout(r, 8));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      },
    });
  }

  // ── If Groq API key is present, use Groq (better quality) ─────────────────
  if (process.env.GROQ_API_KEY) {
    try {
      const groqStream = await callGroq(product, url, contentType);
      return new Response(groqStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (err) {
      console.error('Groq error, falling back to templates:', err.message);
      // Fall through to templates on Groq failure
    }
  }

  // ── Fallback: Smart Templates (always works, no API key needed) ────────────
  const content = generateTemplateContent(contentType, product, url);
  return new Response(streamText(content), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// ── Groq AI call (streaming) ─────────────────────────────────────────────────
async function callGroq(product, url, contentType) {
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
    'seo-title-meta': `Generate SEO-optimized title tags and meta descriptions for this Micron Aerosols product page.\n\n${ctx}\n\nProvide 3 title options (50-60 chars each), 3 meta description options (145-155 chars each), recommended H1, and 3 H2 subheadings. Format clearly with labels.`,
    'blog-post': `Write a comprehensive 1200-1500 word SEO blog post / product guide for Micron Aerosols.\n\n${ctx}\n\nInclude: headline, introduction, what is the product, key features, how to use (step by step), applications, why choose Micron Aerosols, FAQ (5 Q&As), conclusion with CTA. Use ## headings and bullet points. Emphasize Made in India and global quality standards.`,
    'youtube-script': `Write a complete 4-5 minute YouTube video script with all YouTube metadata.\n\n${ctx}\n\nInclude: 2 title options, thumbnail text, full script with timestamps, YouTube description (500 words), video chapters, and 20 tags.`,
    'instagram-content': `Create a complete Instagram content pack.\n\n${ctx}\n\nCreate: 5 feed post captions (150-200 words each with 30 hashtags), 3 reel ideas with shot lists, Instagram bio (150 chars), 5 story ideas with interactive elements.`,
    'linkedin-posts': `Create LinkedIn content for this B2B industrial product.\n\n${ctx}\n\nCreate: 5 LinkedIn posts (Problem/Solution, Feature spotlight, Made in India pride, Customer success story, Industry insight). 200-300 words each, end with a question. Plus a LinkedIn article outline and 5 core hashtags.`,
    'quora-answers': `Write 5 detailed Quora answers for questions related to this product.\n\n${ctx}\n\nFor each: suggest the exact Quora question to find, then write a 300-400 word genuine expert answer that mentions Micron Aerosols naturally (not as advertising). Technical detail builds credibility.`,
    'indimart-listing': `Create a complete optimised IndiaMART product listing.\n\n${ctx}\n\nCreate: optimised product title, 600-800 word description, specifications table, 10 key features, application list, 20 search keywords, suggested category path, and 5 listing FAQs. Format ready to copy-paste into IndiaMART.`,
    'schema-markup': `Generate complete Schema.org JSON-LD structured data for this product page.\n\n${ctx}\n\nCreate: Product schema, FAQ schema (5 Q&As), HowTo schema (5 steps), BreadcrumbList schema, and Organization schema for Micron Aerosols. Format as ready-to-use <script> code blocks.`,
    'email-template': `Create B2B email marketing templates for this product.\n\n${ctx}\n\nCreate: cold outreach email (with A/B subject lines), product announcement email for existing customers, follow-up email after inquiry, newsletter product spotlight section. Include subject lines, preview text, and full bodies.`,
  };

  const prompt = prompts[contentType] || `Generate digital marketing content for: ${contentType}\n\n${ctx}`;

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 4000,
            stream: true,
            messages: [
              {
                role: 'system',
                content: `You are a senior digital marketing expert specialising in Indian B2B industrial products.
Create content that ranks on Google, gets cited by AI tools, and converts industrial buyers.
Always write content that is: technically accurate, keyword-optimised, formatted with headers/bullets, copy-paste ready, and proud of Made in India quality.`,
              },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Groq API error: ${err}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value).split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`));
              }
            } catch { /* skip malformed lines */ }
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`));
        controller.close();
        throw err; // propagate so caller can fall back to templates
      }
    },
  });
}
