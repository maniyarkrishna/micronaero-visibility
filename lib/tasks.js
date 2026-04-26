// ═══════════════════════════════════════════════════════════════════
//  MICRON AEROSOLS — COMPLETE TASK ENGINE
//  Generates 80+ actionable tasks for any product
// ═══════════════════════════════════════════════════════════════════

export const PHASES = [
  { id: 1,  label: 'Foundation',   icon: '🏗️' },
  { id: 2,  label: 'On-Page SEO',  icon: '📄' },
  { id: 3,  label: 'Content',      icon: '✍️' },
  { id: 4,  label: 'YouTube',      icon: '📺' },
  { id: 5,  label: 'Instagram',    icon: '📸' },
  { id: 6,  label: 'LinkedIn',     icon: '🔷' },
  { id: 7,  label: 'Directories',  icon: '📂' },
  { id: 8,  label: 'Q&A',         icon: '💬' },
  { id: 9,  label: 'AI Search',    icon: '🤖' },
  { id: 10, label: 'Monitoring',   icon: '📊' },
];

export const PLATFORM_COLORS = {
  google:     'bg-red-50 text-red-700',
  youtube:    'bg-orange-50 text-orange-700',
  instagram:  'bg-purple-50 text-purple-700',
  linkedin:   'bg-blue-50 text-blue-700',
  bing:       'bg-sky-50 text-sky-700',
  indimart:   'bg-amber-50 text-amber-700',
  quora:      'bg-red-50 text-red-800',
  technical:  'bg-green-50 text-green-700',
  content:    'bg-violet-50 text-violet-700',
  'ai-search':'bg-teal-50 text-teal-700',
  directory:  'bg-yellow-50 text-yellow-800',
  monitoring: 'bg-slate-100 text-slate-600',
};

export function generateTasks(p, url) {
  const name = p.productName  || 'Product';
  const code = p.productCode  || '';
  const cat  = p.category     || 'Industrial';
  const kw1  = (p.primaryKeywords   || [])[0] || name;
  const kw2  = (p.primaryKeywords   || [])[1] || cat;
  const kw3  = (p.primaryKeywords   || [])[2] || 'India manufacturer';
  const kw4  = (p.primaryKeywords   || [])[3] || 'buy online';
  const skw1 = (p.secondaryKeywords || [])[0] || `${kw1} price`;
  const cust = (p.targetCustomers || []).join(', ') || 'manufacturers';
  const inds = (p.industries || []).join(', ') || 'industrial';
  const prob = p.problemSolved || `challenges in ${cat.toLowerCase()}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return [

    // ── PHASE 1: FOUNDATION ────────────────────────────────────────

    {
      id: 'gsc-setup', phase: 1, platform: 'Google', platformKey: 'google',
      platformIcon: '🔍', title: 'Set Up Google Search Console',
      why: `Tells Google that micronaero.com exists and lets you track exactly how "${name}" appears in search results. Without this you are flying blind.`,
      time: '45 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Open Google Search Console', instruction: 'Open Chrome browser. In the address bar type <strong>search.google.com/search-console</strong> and press Enter.' },
        { title: 'Sign in and add property', instruction: 'Click "Start now." Sign in with the company Google account. Under "Domain" type <strong>micronaero.com</strong> (without www). Click Continue.' },
        { title: 'Get verification code', instruction: 'Google shows a TXT record like <code>google-site-verification=XXXX</code>. Copy it and send to your web developer with the message: "Please add this as a DNS TXT record for micronaero.com."' },
        { title: 'Verify ownership', instruction: 'After the developer adds it (5-30 minutes), return to Search Console and click "Verify." You will see a green "Ownership verified!" screen.' },
        { title: 'Submit your sitemap', instruction: 'In the left sidebar click "Sitemaps." In the box type <strong>sitemap.xml</strong> and click "Submit." This tells Google about all your product pages.', note: 'Shopify automatically creates a sitemap at www.micronaero.com/sitemap.xml' },
      ],
      resources: [{ label: 'Google Search Console', url: 'https://search.google.com/search-console' }],
    },

    {
      id: 'ga4-setup', phase: 1, platform: 'Google', platformKey: 'google',
      platformIcon: '📊', title: 'Set Up Google Analytics 4',
      why: 'Shows how many people visit each product page, where they come from, and which marketing efforts are working.',
      time: '30 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Go to Google Analytics', instruction: 'Open <strong>analytics.google.com</strong>. Sign in with the same Google account.' },
        { title: 'Create account and property', instruction: 'Click "Start measuring." Account name: <strong>Micron Aerosols</strong>. Property name: <strong>micronaero.com</strong>. Time zone: India Standard Time. Currency: Indian Rupee (INR).' },
        { title: 'Get the Measurement ID', instruction: 'Select "Web" → enter <strong>www.micronaero.com</strong>. Copy the Measurement ID (looks like <strong>G-XXXXXXXXXX</strong>).' },
        { title: 'Install on website', instruction: 'Send this G-XXXXXXXXXX code to your developer and say: "Please add Google Analytics 4 with this Measurement ID to micronaero.com." On Shopify this is done via Online Store → Preferences → Google Analytics.' },
        { title: 'Test it is working', instruction: 'After installation, go back to analytics.google.com → Reports → Realtime. Open a new tab and visit micronaero.com. You should see "1 user" in the Realtime report.' },
      ],
      resources: [{ label: 'Google Analytics', url: 'https://analytics.google.com' }],
    },

    {
      id: 'gbp-setup', phase: 1, platform: 'Google', platformKey: 'google',
      platformIcon: '📍', title: 'Set Up Google Business Profile',
      why: 'Shows Micron Aerosols on Google Maps and local search results. Buyers searching for "aerosol manufacturer near me" or by city will find you.',
      time: '60 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Open Google Business Profile', instruction: 'Go to <strong>business.google.com</strong>. Click "Manage now" and sign in.' },
        { title: 'Add business details', instruction: 'Business name: <strong>Micron Aerosols</strong>. Category: <strong>Chemical Manufacturer</strong>. Address: company\'s full address. Website: <strong>www.micronaero.com</strong>. Phone: company phone number.' },
        { title: 'Upload photos', instruction: 'Add at least 10 photos: the factory exterior, products on shelves, product close-ups, team photos. More photos = higher ranking.' },
        { title: 'Write the business description', instruction: 'In the About section write: "Micron Aerosols — India\'s trusted specialty aerosol manufacturer since 1989. Products include ' + name + ', and 42+ industrial aerosols for electronics, welding, plastic moulding, and automotive industries. Global Standards. Imagined in India."' },
        { title: 'Verify by postcard', instruction: 'Google mails a postcard with a 5-digit code to your business address. It arrives in 5-14 days. When it arrives go to business.google.com and enter the code.' },
      ],
      resources: [{ label: 'Google Business Profile', url: 'https://business.google.com' }],
    },

    {
      id: 'bing-setup', phase: 1, platform: 'Bing', platformKey: 'bing',
      platformIcon: '📘', title: 'Set Up Bing Webmaster Tools',
      why: 'Bing powers Microsoft search AND feeds data to ChatGPT (via Bing) and Microsoft Copilot. Setting this up means your products appear across all Microsoft AI tools.',
      time: '20 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Open Bing Webmaster Tools', instruction: 'Go to <strong>www.bing.com/webmasters</strong>. Sign in with a Microsoft account (create one free at outlook.com if needed).' },
        { title: 'Add your site', instruction: 'Click "Add site." Type <strong>https://www.micronaero.com</strong>. Click Add.' },
        { title: 'Verify the site', instruction: 'Choose XML file verification. Download the file Bing gives you. Send it to your developer: "Please upload this BingSiteAuth.xml file to the root of micronaero.com."' },
        { title: 'Submit sitemap', instruction: 'Click "Sitemaps" in the left menu. Enter <strong>https://www.micronaero.com/sitemap.xml</strong>. Click Submit.' },
        { title: 'Import from Google Search Console', instruction: 'Click "Import from GSC" — Bing copies all your keyword data from Google automatically. This saves hours of manual setup.', note: 'This is one of the most powerful time-saving features in Bing Webmaster.' },
      ],
      resources: [{ label: 'Bing Webmaster Tools', url: 'https://www.bing.com/webmasters' }],
    },

    // ── PHASE 2: ON-PAGE SEO ─────────────────────────────────────

    {
      id: 'seo-title-meta', phase: 2, platform: 'Google', platformKey: 'technical',
      platformIcon: '🏷️', title: 'Optimize Page Title & Meta Description',
      why: `The title and meta description are the first things people see in Google results. A well-crafted title with "${kw1}" can double click-through rates overnight.`,
      time: '30 min', difficulty: 'Easy', frequency: 'One-time, review quarterly',
      contentType: 'seo-title-meta', generateLabel: 'Generate SEO Titles & Meta Descriptions',
      steps: [
        { title: 'Generate optimized options', instruction: 'Click "✨ Generate with AI" below. You will get 3 optimized title and meta description options written specifically for "' + name + '".' },
        { title: 'Log in to Shopify admin', instruction: 'Go to <strong>micronaero.myshopify.com/admin</strong>. Click Products → find "' + name + '" → click on it.' },
        { title: 'Update SEO fields', instruction: 'Scroll to the bottom of the product page. Click "Edit website SEO." Fill in:\n• Page title: use your chosen AI-generated title (max 60 characters)\n• Meta description: use the AI-generated description (max 155 characters)' },
        { title: 'Clean up URL', instruction: 'The URL handle should be clean: e.g. <strong>/products/' + slug + '</strong>. If it has random numbers, update it here.', warning: 'Tell your developer if you change the URL — they must set up a redirect from the old URL.' },
        { title: 'Save', instruction: 'Click "Save" in the top right of Shopify.' },
      ],
      resources: [
        { label: 'Shopify Products', url: 'https://micronaero.myshopify.com/admin/products' },
        { label: 'SERP Preview Tool', url: 'https://www.serpsim.com' },
      ],
    },

    {
      id: 'product-description', phase: 2, platform: 'Google', platformKey: 'technical',
      platformIcon: '📝', title: 'Write Keyword-Rich Product Description',
      why: `A detailed description with keywords like "${kw1}", "${kw2}", "${kw3}" helps Google rank the product page. It also converts visitors into buyers or leads.`,
      time: '60 min', difficulty: 'Easy', frequency: 'One-time, update every 6 months',
      contentType: 'blog-post', generateLabel: 'Generate Product Description Content',
      steps: [
        { title: 'Generate the content', instruction: 'Click "✨ Generate with AI" to get a full SEO-optimized product description for "' + name + '".' },
        { title: 'Open the product in Shopify', instruction: 'Shopify admin → Products → "' + name + '".' },
        { title: 'Rewrite the description', instruction: 'Replace or improve the description with this structure:\n• Opening paragraph: what the product is and what problem it solves\n• Key Features section (bulleted list)\n• Applications / Industries section\n• Specifications table\n• Why Micron Aerosols (Made in India, since 1989, global standards)\n\nKeywords to include naturally: ' + [kw1, kw2, kw3, kw4].join(', ') },
        { title: 'Use formatting', instruction: 'Use the editor toolbar to add H2/H3 headings to break up sections. Google rewards structured content.' },
        { title: 'Save and preview', instruction: 'Click Save, then click View to see the live page. Read it as a customer.' },
      ],
      resources: [],
    },

    {
      id: 'image-alt-text', phase: 2, platform: 'Google', platformKey: 'technical',
      platformIcon: '🖼️', title: 'Add Alt Text to All Product Images',
      why: 'Alt text tells Google what your images show. Google Images is a major discovery channel — engineers search for product images. Proper alt text makes "' + name + '" appear in image searches.',
      time: '20 min', difficulty: 'Beginner', frequency: 'Add to every new image',
      steps: [
        { title: 'Open product in Shopify', instruction: 'Shopify admin → Products → "' + name + '".' },
        { title: 'Click on the first product image', instruction: 'In the Media section, click on the first image. A window opens with an "Alt text" field.' },
        { title: 'Write descriptive alt text', instruction: 'Format: <code>' + name + ' [what the image shows] by Micron Aerosols India</code>\nExample: <code>' + name + ' aerosol spray can — ' + kw1 + ' — Made in India by Micron Aerosols</code>' },
        { title: 'Repeat for all images', instruction: 'Click each image and add unique alt text. Keep all of them slightly different but always include the product name.' },
        { title: 'Save', instruction: 'Click "Save" after updating each image.' },
      ],
      resources: [],
    },

    {
      id: 'schema-markup', phase: 2, platform: 'Google', platformKey: 'technical',
      platformIcon: '⚙️', title: 'Add Product Schema Markup',
      why: 'Schema markup lets Google show rich results — price, availability, ratings — next to your listing. Products with rich results get 30% more clicks than plain listings.',
      time: '45 min', difficulty: 'Easy', frequency: 'One-time per product',
      contentType: 'schema-markup', generateLabel: 'Generate Schema Markup Code',
      steps: [
        { title: 'Generate schema code', instruction: 'Click "✨ Generate with AI." You will get ready-to-use JSON-LD schema markup code for Product, FAQ, HowTo, and Organization.' },
        { title: 'Validate the code', instruction: 'Go to <strong>validator.schema.org</strong>. Paste the code. Click Validate. Fix any red errors.' },
        { title: 'Send to developer', instruction: 'Send the validated code to your developer: "Please add these JSON-LD schema blocks to the <head> of the product page at: ' + url + '"' },
        { title: 'Test with Google', instruction: 'After developer adds it, go to <strong>search.google.com/test/rich-results</strong>. Enter the product URL. Confirm Product ✓ and FAQPage ✓ appear.' },
      ],
      resources: [
        { label: 'Schema Validator', url: 'https://validator.schema.org' },
        { label: 'Rich Results Test', url: 'https://search.google.com/test/rich-results' },
      ],
    },

    // ── PHASE 3: CONTENT ─────────────────────────────────────────

    {
      id: 'blog-post', phase: 3, platform: 'Content', platformKey: 'content',
      platformIcon: '✍️', title: 'Publish a Comprehensive Blog Post',
      why: 'A 1200+ word guide about "' + name + '" captures all the long-tail search keywords buyers use during research. One blog post can rank for dozens of keywords and drive traffic for years.',
      time: '2 hours', difficulty: 'Easy', frequency: 'One-time per product',
      contentType: 'blog-post', generateLabel: 'Generate Full Blog Post',
      steps: [
        { title: 'Generate the blog post', instruction: 'Click "✨ Generate with AI." A complete, SEO-optimized blog post will be written. Copy everything.' },
        { title: 'Log in to Shopify', instruction: 'Shopify admin → Online Store → Blog posts → Create blog post.' },
        { title: 'Add title and content', instruction: 'Paste the AI-generated title and body. Format with headings, bullets, bold text using the editor toolbar.' },
        { title: 'Add images', instruction: 'Add the product image. Write alt text for it.' },
        { title: 'Set SEO metadata', instruction: 'Scroll to SEO section. Set URL to something clean like <strong>/blogs/news/guide-to-' + slug + '</strong>. Add an SEO meta description.' },
        { title: 'Add tags', instruction: 'Add tags: ' + [kw1, kw2, cat.toLowerCase(), 'made in india', 'industrial'].join(', ') },
        { title: 'Publish', instruction: 'Set status to "Published." Click Save. Copy the blog post URL — you will use it in social media tasks.' },
      ],
      resources: [],
    },

    {
      id: 'how-to-guide', phase: 3, platform: 'Content', platformKey: 'content',
      platformIcon: '📋', title: 'Publish a "How to Use" Step-by-Step Guide',
      why: 'Guides like "How to use ' + name + '" rank for "how to" searches and often appear as featured snippets — the answer box at the very top of Google, above all other results.',
      time: '90 min', difficulty: 'Easy', frequency: 'One-time per product',
      contentType: 'blog-post', generateLabel: 'Generate How-To Guide',
      steps: [
        { title: 'Generate the guide', instruction: 'Click "✨ Generate with AI" for a detailed how-to guide for "' + name + '".' },
        { title: 'Create a new blog post', instruction: 'Same steps as the blog post task. Create a second post titled: "How to Use ' + name + ' — Step by Step Guide"' },
        { title: 'Embed your YouTube video later', instruction: 'Once you create the YouTube video (Phase 4), come back and embed it in this guide. Pages with embedded videos rank significantly higher.', note: 'In Shopify blog post editor, click Insert → Video → paste the YouTube URL.' },
        { title: 'Add HowTo schema', instruction: 'Ask your developer to add HowTo JSON-LD schema to this page so Google can show your steps directly in search results.' },
      ],
      resources: [],
    },

    {
      id: 'email-templates', phase: 3, platform: 'Content', platformKey: 'content',
      platformIcon: '📧', title: 'Create B2B Email Outreach Templates',
      why: 'Email is the highest-converting B2B channel. Ready-made templates for "' + name + '" mean you can reach potential buyers consistently every week.',
      time: '45 min', difficulty: 'Easy', frequency: 'One-time per product',
      contentType: 'email-template', generateLabel: 'Generate Email Templates',
      steps: [
        { title: 'Generate templates', instruction: 'Click "✨ Generate with AI" to get cold outreach, follow-up, and newsletter templates for "' + name + '".' },
        { title: 'Save in a shared document', instruction: 'Copy all templates to a Google Doc titled "Email Templates — ' + name + '". Share with the sales team.' },
        { title: 'Build your contact list', instruction: 'Find potential buyers on:\n• LinkedIn (search for procurement managers, plant managers in ' + inds + ' companies)\n• IndiaMART (buyers who have listed requirements for ' + cat.toLowerCase() + ')\n• Export from your existing customer database' },
        { title: 'Personalize each email', instruction: 'Before sending each email, replace [Company Name] and [Application] with the real details. Never send a template that reads like a template.' },
        { title: 'Send consistently', instruction: 'Send 10-15 personalized emails per week. Track replies in a simple spreadsheet.' },
      ],
      resources: [],
    },

    // ── PHASE 4: YOUTUBE ─────────────────────────────────────────

    {
      id: 'youtube-channel', phase: 4, platform: 'YouTube', platformKey: 'youtube',
      platformIcon: '📺', title: 'Set Up & Optimize YouTube Channel',
      why: 'YouTube is the #2 search engine in the world. A professional Micron Aerosols channel means product videos appear when engineers search YouTube for demos and how-to guides.',
      time: '60 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Create YouTube channel', instruction: 'Go to <strong>youtube.com</strong>. Sign in with the company Google account. Click profile picture → Create a channel → Use a custom name → Enter <strong>Micron Aerosols</strong>.' },
        { title: 'Upload profile picture', instruction: 'Use the Micron Aerosols logo, saved as 800x800 pixels.' },
        { title: 'Create channel banner', instruction: 'The banner is 2560x1440 pixels. Use Canva (canva.com → search "YouTube channel art") to create one with: company logo, tagline "Global Standards. Imagined in India." and website www.micronaero.com.' },
        { title: 'Write channel description', instruction: 'In YouTube Studio → Customization → Basic info → Description, write: what Micron Aerosols makes, product categories S1000-S6000, industries served, founding year 1989, website, and keywords: aerosol manufacturer India, industrial sprays, specialty chemicals.' },
        { title: 'Add links', instruction: 'In the Links section add: Website (www.micronaero.com), Instagram, LinkedIn.' },
        { title: 'Set channel keywords', instruction: 'YouTube Studio → Settings → Channel → Basic info. Keywords: <strong>aerosol manufacturer India, ' + kw1 + ', industrial aerosols, specialty chemicals India, Micron Aerosols, Made in India</strong>' },
      ],
      resources: [
        { label: 'YouTube Studio', url: 'https://studio.youtube.com' },
        { label: 'Canva (free design)', url: 'https://www.canva.com' },
      ],
    },

    {
      id: 'youtube-video', phase: 4, platform: 'YouTube', platformKey: 'youtube',
      platformIcon: '🎬', title: 'Record & Upload Product Demo Video',
      why: 'A demonstration video for "' + name + '" on YouTube gets found for years. Videos also appear directly in Google search results — one video can drive traffic for the entire product lifetime.',
      time: '3–4 hours (including recording)', difficulty: 'Medium', frequency: 'Once per product',
      contentType: 'youtube-script', generateLabel: 'Generate Video Script & YouTube Description',
      steps: [
        { title: 'Generate the video script', instruction: 'Click "✨ Generate with AI." You will get a complete 4-5 minute video script, SEO-optimized YouTube title, description, and 20 tags.' },
        { title: 'Prepare for recording', instruction: 'You need: a smartphone (any modern iPhone or Android), stable surface or tripod, good natural light (film near a window during daytime), the actual product can.' },
        { title: 'Film these shots', instruction: '1. Product can on a clean surface — 5 sec\n2. Close-up of product label — 5 sec\n3. Shaking the can before use — 3 sec\n4. Spraying onto test surface — 15 sec\n5. The result after application — 10 sec\n6. Speaking to camera following the script\n7. Company website on a laptop — 5 sec', note: 'You do NOT need professional equipment. Good lighting and a steady hand are enough.' },
        { title: 'Edit with free software', instruction: 'Use CapCut (free app on phone or PC) or iMovie (Mac). Add: intro with company logo, background music (from YouTube Free Music Library), company website URL as text overlay at the end.' },
        { title: 'Upload to YouTube', instruction: 'YouTube Studio → Create → Upload videos → select your video file.' },
        { title: 'Fill in all details from the AI-generated content', instruction: 'Paste the AI-generated: title, description (full), all 20 tags. Set category to "Science & Technology." Upload a custom thumbnail (make one in Canva: 1280×720 px, show product clearly, add readable text).' },
        { title: 'Add chapters', instruction: 'At the top of the description, add timestamps:\n00:00 Introduction\n00:30 What is ' + name + '?\n01:00 How to use it\n02:00 Applications & Industries\n03:00 Contact & Order' },
        { title: 'Publish and pin a comment', instruction: 'Click Publish. Then post a comment with the product URL and applications. Pin it to the top of comments.' },
      ],
      resources: [
        { label: 'YouTube Studio', url: 'https://studio.youtube.com' },
        { label: 'CapCut (free editor)', url: 'https://www.capcut.com' },
        { label: 'Free Background Music', url: 'https://studio.youtube.com/channel/music' },
      ],
    },

    // ── PHASE 5: INSTAGRAM ───────────────────────────────────────

    {
      id: 'instagram-setup', phase: 5, platform: 'Instagram', platformKey: 'instagram',
      platformIcon: '📸', title: 'Set Up & Optimize Instagram Business Account',
      why: 'Instagram reaches engineers, procurement officers, and plant managers visually. An optimized profile and regular posts build brand recognition in the industrial community.',
      time: '45 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Create business account', instruction: 'Install Instagram app on your phone. Sign up or sign in. Go to Settings → Account → Switch to Professional Account → Business.' },
        { title: 'Set username', instruction: 'Use <strong>@micronaero</strong> or <strong>@micronaerosols</strong>. Check availability and claim it.' },
        { title: 'Write the bio', instruction: '150 characters maximum. Use:\n🏭 Industrial Aerosols | Made in India 🇮🇳\n✅ Electronics · Welding · Moulding · Auto\n📦 Bulk Orders Welcome\n🌐 micronaero.com' },
        { title: 'Set profile picture', instruction: 'Upload the Micron Aerosols logo (square, at least 320×320 px).' },
        { title: 'Add website link', instruction: 'In the "Website" field add <strong>www.micronaero.com</strong> — this is the only clickable link on Instagram.' },
        { title: 'Create Story Highlights', instruction: 'Create these highlight covers (use Canva for the covers): Products | How to Use | Industries | Made in India | Contact Us.' },
      ],
      resources: [{ label: 'Canva for Instagram', url: 'https://www.canva.com/instagram-posts/' }],
    },

    {
      id: 'instagram-content', phase: 5, platform: 'Instagram', platformKey: 'instagram',
      platformIcon: '📅', title: 'Create & Post Instagram Content for This Product',
      why: 'Consistent posts about "' + name + '" build brand visibility on Instagram\'s Explore page and hashtag searches — reaching buyers who discover industrial products through social media.',
      time: '3 hours for initial set, then 1 hr/week', difficulty: 'Easy', frequency: '3–4 posts per week',
      contentType: 'instagram-content', generateLabel: 'Generate Instagram Captions, Reels & Hashtags',
      steps: [
        { title: 'Generate content', instruction: 'Click "✨ Generate with AI." You will get 5 captions with hashtags, 3 reel ideas, bio suggestion, and 5 story ideas.' },
        { title: 'Take product photos', instruction: 'Using your phone, photograph:\n1. Product can on white background\n2. Product being used (spray in action)\n3. Before/after (surface without vs. with treatment)\n4. Product next to relevant equipment or tools\n5. Close-up of the label/product code' },
        { title: 'Record a Reel', instruction: 'A Reel is 15-60 seconds. Record a quick product demo. Use CapCut to add text overlays and music. Reels get 3-5× more reach than regular posts.' },
        { title: 'Post your first photo', instruction: 'Instagram → + → select photo → Next → paste the AI-generated caption and hashtags → Share.' },
        { title: 'Also post to Story', instruction: 'Share the same post to your Story. Add a "Link" sticker pointing to the product URL.' },
        { title: 'Save to Highlights', instruction: 'After posting the Story, tap the bookmark icon to save it to your "Products" highlight.' },
      ],
      resources: [],
    },

    // ── PHASE 6: LINKEDIN ────────────────────────────────────────

    {
      id: 'linkedin-page', phase: 6, platform: 'LinkedIn', platformKey: 'linkedin',
      platformIcon: '🔷', title: 'Set Up LinkedIn Company Page',
      why: 'LinkedIn is where procurement managers, plant heads, and engineers make B2B decisions. A complete company page ensures Micron Aerosols appears in their searches.',
      time: '60 min', difficulty: 'Beginner', frequency: 'One-time',
      steps: [
        { title: 'Create a company page', instruction: 'Go to <strong>linkedin.com</strong>. Sign in. Click "Work" (top right grid icon) → "Create a Company Page." Select "Small business."' },
        { title: 'Fill in company details', instruction: 'Name: Micron Aerosols | URL: micron-aerosols | Website: www.micronaero.com | Industry: Chemical Manufacturing | Founded: 1989.' },
        { title: 'Upload logo and banner', instruction: 'Logo: 300×300 px (company logo). Banner: 1128×191 px (products/factory image from Canva).' },
        { title: 'Write the About section', instruction: 'Write about: what Micron Aerosols does, products (mention ' + name + ' and others), industries served (' + inds + '), Made in India, global quality standards, years of experience. Include keywords: ' + [kw1, kw2, 'aerosol manufacturer India'].join(', ') },
        { title: 'Add specialties', instruction: 'Specialties: Aerosol Manufacturing, Specialty Chemicals, Industrial Sprays, Made in India, ' + cat + ', ' + kw1 },
        { title: 'Invite connections', instruction: 'Use "Invite connections" to invite your personal LinkedIn network to follow the page. Ask all colleagues to do the same.' },
      ],
      resources: [{ label: 'Create LinkedIn Page', url: 'https://www.linkedin.com/company/setup/new' }],
    },

    {
      id: 'linkedin-posts', phase: 6, platform: 'LinkedIn', platformKey: 'linkedin',
      platformIcon: '📢', title: 'Publish LinkedIn Posts for This Product',
      why: 'LinkedIn posts about "' + name + '" are seen directly by engineers, procurement officers, and plant managers. They generate inquiries and build industry authority.',
      time: '2 hours for 5 posts', difficulty: 'Easy', frequency: '3–4 posts per week',
      contentType: 'linkedin-posts', generateLabel: 'Generate 5 LinkedIn Posts',
      steps: [
        { title: 'Generate posts', instruction: 'Click "✨ Generate with AI" to get 5 LinkedIn posts (Problem/Solution, Product Feature, Made in India, Case Study, Industry Insight).' },
        { title: 'Post to LinkedIn', instruction: 'Go to your LinkedIn company page → Create a post → paste the content → add product image → Post.' },
        { title: 'Schedule remaining posts', instruction: 'Click the clock icon next to "Post" to schedule. Best times: Tuesday–Thursday, 8–10am or 12–2pm IST.' },
        { title: 'Engage with comments', instruction: 'Reply to ALL comments within 24 hours. LinkedIn promotes content that generates engagement.' },
        { title: 'Share the blog post', instruction: 'Share the blog post URL on LinkedIn with a summary of the 3 key points.' },
      ],
      resources: [],
    },

    // ── PHASE 7: DIRECTORIES ─────────────────────────────────────

    {
      id: 'indimart', phase: 7, platform: 'IndiaMART', platformKey: 'indimart',
      platformIcon: '🛒', title: 'Create IndiaMART Product Listing',
      why: 'IndiaMART is India\'s largest B2B marketplace. Buyers searching for "' + kw1 + '" on IndiaMART are actively ready to purchase — this is high-intent traffic that converts directly to inquiries.',
      time: '90 min', difficulty: 'Easy', frequency: 'One-time per product',
      contentType: 'indimart-listing', generateLabel: 'Generate IndiaMART Listing Content',
      steps: [
        { title: 'Generate listing content', instruction: 'Click "✨ Generate with AI" to get an optimized IndiaMART product title, description, specifications, and keywords.' },
        { title: 'Create/log in to seller account', instruction: 'Go to <strong>seller.indiamart.com</strong>. Register free for Micron Aerosols or log in if account exists.' },
        { title: 'Add new product', instruction: 'Product Catalog → Add Product.' },
        { title: 'Fill in all fields', instruction: 'Paste the AI-generated content:\n• Product name (optimized title)\n• Category (navigate to the right one)\n• Description\n• MOQ (ask sales team)\n• Price or "Get Quote"\n• Keywords' },
        { title: 'Upload 5+ product images', instruction: 'IndiaMART listings with 5+ images get significantly more inquiries than those with 1-2 images. Include product can, in-use shots, results.' },
        { title: 'Publish', instruction: 'Click Save/Publish. Then search IndiaMART for your keywords and confirm your listing appears.' },
      ],
      resources: [{ label: 'IndiaMART Seller Portal', url: 'https://seller.indiamart.com' }],
    },

    {
      id: 'tradeindia', phase: 7, platform: 'TradeIndia', platformKey: 'directory',
      platformIcon: '📂', title: 'Create TradeIndia Listing',
      why: 'TradeIndia is a major B2B directory used by buyers across India and internationally. Each additional directory listing increases chances of "' + name + '" being found by procurement teams.',
      time: '45 min', difficulty: 'Easy', frequency: 'One-time per product',
      steps: [
        { title: 'Register on TradeIndia', instruction: 'Go to <strong>www.tradeindia.com</strong>. Click "Sell on TradeIndia" → Register free seller account for Micron Aerosols.' },
        { title: 'Add product', instruction: 'My Catalog → Add Product. Copy and adapt the IndiaMART description you created — same structure, slightly different wording.' },
        { title: 'Upload images and publish', instruction: 'Upload 3-5 product images. Click Save & Publish. Listing goes live within 24 hours after review.' },
      ],
      resources: [{ label: 'TradeIndia', url: 'https://www.tradeindia.com' }],
    },

    {
      id: 'exporters-india', phase: 7, platform: 'ExportersIndia', platformKey: 'directory',
      platformIcon: '🌏', title: 'List on ExportersIndia.com',
      why: '"Made in India" industrial aerosols have strong export potential. ExportersIndia connects Indian manufacturers with buyers in Southeast Asia, Middle East, and Africa.',
      time: '30 min', difficulty: 'Easy', frequency: 'One-time',
      steps: [
        { title: 'Register', instruction: 'Go to <strong>www.exportersindia.com</strong> → "Sell with us" → Register free account.' },
        { title: 'Add the product', instruction: 'Add product with the same content as IndiaMART. Emphasize "Made in India," "Global Standards," and export readiness in the description.' },
        { title: 'Fill export details', instruction: 'Fill in FOB price (ask your sales team), MOQ, payment terms, packaging details. International buyers need this information.' },
      ],
      resources: [{ label: 'ExportersIndia', url: 'https://www.exportersindia.com' }],
    },

    {
      id: 'google-merchant', phase: 7, platform: 'Google', platformKey: 'google',
      platformIcon: '🛍️', title: 'Set Up Google Merchant Center (Free Shopping Listings)',
      why: 'Google Shopping shows products at the top of search results with an image, price, and brand — for free. This gives Micron Aerosols prime visual placement in Google without any ad spend.',
      time: '60 min', difficulty: 'Medium', frequency: 'One-time',
      steps: [
        { title: 'Create Merchant Center account', instruction: 'Go to <strong>merchants.google.com</strong>. Sign in with company Google account. Business name: Micron Aerosols. Website: www.micronaero.com. Country: India.' },
        { title: 'Verify website', instruction: 'Use Google Analytics verification (easiest) — select it and click Verify.' },
        { title: 'Connect Shopify', instruction: 'In Shopify admin → Apps → search "Google & YouTube" → Install → Connect to your Merchant Center. Shopify automatically syncs all products.' },
        { title: 'Fix any product issues', instruction: 'In Merchant Center → Products → All products. Review each product\'s status. Red warnings mean something needs fixing (usually an image quality issue or missing field in Shopify).' },
      ],
      resources: [{ label: 'Google Merchant Center', url: 'https://merchants.google.com' }],
    },

    // ── PHASE 8: Q&A ────────────────────────────────────────────

    {
      id: 'quora', phase: 8, platform: 'Quora', platformKey: 'quora',
      platformIcon: '💬', title: 'Answer Relevant Questions on Quora',
      why: 'Quora answers rank on Google and are frequently cited by AI tools like Perplexity and ChatGPT. A well-written answer about topics related to "' + name + '" can drive traffic for years.',
      time: '2 hours, then 30 min/week', difficulty: 'Easy', frequency: '2 answers per week',
      contentType: 'quora-answers', generateLabel: 'Generate Expert Quora Answers',
      steps: [
        { title: 'Generate answers', instruction: 'Click "✨ Generate with AI" to get 5 detailed, genuinely helpful Quora answers about topics related to "' + name + '".' },
        { title: 'Create Quora account', instruction: 'Go to <strong>www.quora.com</strong>. Sign up. Set your "Knows About" topics to: ' + [cat, 'Industrial Chemicals', 'Manufacturing', 'Electronics'].join(', ') + '. Add your title: "Product Specialist at Micron Aerosols."' },
        { title: 'Find relevant questions', instruction: 'Search Quora for: "' + kw1 + '", "' + kw2 + '", "' + prob.substring(0, 40) + '". Find questions with many views but few answers.' },
        { title: 'Post your answers', instruction: 'Paste and slightly personalize the AI-generated answers. They should be genuinely helpful — mention Micron Aerosols naturally as one good option, not as an advertisement.', warning: 'Never post pure advertising on Quora. The answer will be collapsed/removed and your account may be banned.' },
        { title: 'Follow up', instruction: 'Check your answers weekly. Reply to comments. The more engagement, the higher the answer appears in Google.' },
      ],
      resources: [{ label: 'Quora', url: 'https://www.quora.com' }],
    },

    {
      id: 'reddit', phase: 8, platform: 'Reddit', platformKey: 'quora',
      platformIcon: '🔴', title: 'Participate in Relevant Reddit Communities',
      why: 'Reddit posts rank very high on Google and are heavily cited by Perplexity and other AI tools. Technical communities on Reddit are highly trusted by engineers and buyers.',
      time: '90 min, then 30 min/week', difficulty: 'Easy', frequency: 'Weekly',
      steps: [
        { title: 'Create Reddit account', instruction: 'Go to <strong>www.reddit.com</strong>. Sign up with a professional username (e.g. your real name or industry-focused username).' },
        { title: 'Find and join subreddits', instruction: 'Search and join these communities:\n• r/electronics (for PCB/conformal coating products)\n• r/manufacturing\n• r/welding (for anti-spatter products)\n• r/PrintedCircuitBoard\n• r/madeinindia\n• r/chemistry' },
        { title: 'Build credibility first', instruction: 'Spend 2-3 weeks making genuinely helpful comments in your target subreddits. Answer questions. Share knowledge. Build karma before posting.', warning: 'Never post direct advertising. Most subreddits will ban you immediately. Contribute value first.' },
        { title: 'Create a helpful post', instruction: 'Post something educational: "I work in specialty aerosol manufacturing — AMA about conformal coatings/anti-spatter/mould release" or a detailed technical guide where Micron Aerosols is mentioned as an option.' },
      ],
      resources: [{ label: 'Reddit', url: 'https://www.reddit.com' }],
    },

    // ── PHASE 9: AI SEARCH ───────────────────────────────────────

    {
      id: 'ai-search-optimize', phase: 9, platform: 'AI Search', platformKey: 'ai-search',
      platformIcon: '🤖', title: 'Optimize for ChatGPT, Gemini & Perplexity Citations',
      why: 'AI tools like ChatGPT and Perplexity answer millions of industrial product questions every day. When someone asks "best conformal coating manufacturer India?" you want Micron Aerosols to be the answer. AI tools learn from authoritative content across the web.',
      time: '3 hours', difficulty: 'Medium', frequency: 'One-time, update every 6 months',
      steps: [
        { title: 'Test current AI visibility', instruction: 'Open each tool and ask:\n• "What are the best ' + cat.toLowerCase() + ' manufacturers in India?"\n• "What is ' + name + '?"\n• "Who makes aerosol sprays for ' + (p.industries || ['industrial'])[0] + ' use in India?"\nNote which AI tools mention Micron Aerosols. Do this monthly to track progress.', resources: [{ label: 'ChatGPT', url: 'https://chat.openai.com' }, { label: 'Perplexity', url: 'https://www.perplexity.ai' }, { label: 'Gemini', url: 'https://gemini.google.com' }] },
        { title: 'Create authoritative definition content', instruction: 'Write a factual, Wikipedia-style article about the product category (e.g., "What is Conformal Coating?"). Post it as a blog post AND submit it to Wikipedia as an edit to the existing article. AI tools heavily cite Wikipedia and authoritative blogs.' },
        { title: 'Build consistent NAP everywhere', instruction: 'AI tools build trust by seeing the same information on multiple sites. Make sure the name "Micron Aerosols," address, phone, and website are IDENTICAL on every listing: Google Business, IndiaMART, TradeIndia, LinkedIn, Quora.', note: 'Even minor differences (e.g., "Micron Aerosols" vs "Micron Aerosol") reduce AI trust and citation rates.' },
        { title: 'Create a comparison page', instruction: 'On micronaero.com, create a blog post comparing different types of "' + cat + '" products (types and approaches, not competitor brands). AI tools use comparison content heavily when answering "best X" questions.' },
        { title: 'Get mentioned on authoritative sites', instruction: 'Contact industry publications for a mention or contributed article:\n• Chemical Weekly India\n• Electronics For You magazine\n• Manufacturing Today India\n• Autocar Professional\nEach authoritative mention trains AI tools to cite Micron Aerosols.' },
      ],
      resources: [
        { label: 'ChatGPT', url: 'https://chat.openai.com' },
        { label: 'Perplexity AI', url: 'https://www.perplexity.ai' },
        { label: 'Google Gemini', url: 'https://gemini.google.com' },
      ],
    },

    {
      id: 'press-release', phase: 9, platform: 'AI Search', platformKey: 'ai-search',
      platformIcon: '📰', title: 'Submit a Press Release',
      why: 'Press releases on news sites create authoritative web mentions that AI models use as sources. A press release about "' + name + '" on reputable sites directly increases AI citation rates.',
      time: '3 hours', difficulty: 'Medium', frequency: 'Quarterly',
      steps: [
        { title: 'Write the press release', instruction: 'Format:\n• Headline: Micron Aerosols Expands Range with [Product] for [Industry]\n• Dateline: City, Date\n• Lead: Who, What, When, Where, Why (one paragraph)\n• Quote from company executive\n• Product details (2-3 paragraphs)\n• About Micron Aerosols boilerplate\n• Contact info\n\nAsk your manager for an executive quote.' },
        { title: 'Submit to free PR sites', instruction: 'Submit to: PRLog.com, OpenPR.com, Free-Press-Release.com' },
        { title: 'Email industry media', instruction: 'Email the press release directly to:\n• Chemical Weekly India\n• Electronics For You magazine\n• Manufacturing Today India\n• Autocar Professional\nFind their press/contact email on their websites.' },
        { title: 'Post on LinkedIn', instruction: 'Share the press release on the Micron Aerosols LinkedIn page as a long-form post.' },
      ],
      resources: [{ label: 'PRLog (free)', url: 'https://www.prlog.org' }],
    },

    // ── PHASE 10: MONITORING ─────────────────────────────────────

    {
      id: 'google-alerts', phase: 10, platform: 'Monitoring', platformKey: 'monitoring',
      platformIcon: '🔔', title: 'Set Up Google Alerts',
      why: 'Notifies you instantly when "' + name + '" or "Micron Aerosols" is mentioned anywhere online. Lets you respond to customer mentions and spot competitor moves.',
      time: '15 min', difficulty: 'Beginner', frequency: 'One-time setup',
      steps: [
        { title: 'Go to Google Alerts', instruction: 'Open <strong>alerts.google.com</strong>. Sign in with company Google account.' },
        { title: 'Create brand alert', instruction: 'Type <strong>Micron Aerosols</strong>. Options: As it happens | All sources | India. Enter your email. Click Create.' },
        { title: 'Create product alert', instruction: 'Create another alert for <strong>"' + name + '"</strong> (with quotation marks for exact match).' },
        { title: 'Create keyword alert', instruction: 'Create one more for <strong>"' + kw1 + '" India</strong> to track what buyers and competitors are saying about your product category.' },
      ],
      resources: [{ label: 'Google Alerts', url: 'https://alerts.google.com' }],
    },

    {
      id: 'weekly-review', phase: 10, platform: 'Monitoring', platformKey: 'monitoring',
      platformIcon: '📈', title: 'Weekly Google Search Console Review',
      why: 'Search Console shows exactly which keywords drive traffic to "' + name + '" and where new opportunities exist. This is where you see the results of all your work paying off.',
      time: '30 min every Monday', difficulty: 'Beginner', frequency: 'Weekly',
      steps: [
        { title: 'Open Search Console', instruction: 'search.google.com/search-console → select micronaero.com property.' },
        { title: 'Check Performance report', instruction: 'Click Performance (left sidebar). Set date range to "Last 28 days." Review: Total clicks, Impressions, Average position.' },
        { title: 'Filter by product page', instruction: 'In the Performance report, click "+ New" → Page → Contains → ' + url.replace('https://www.micronaero.com', '') + '\nThis shows only keywords bringing traffic to this specific product.' },
        { title: 'Find ranking opportunities', instruction: 'Look for keywords where Position is 5–20. These are your biggest quick wins — a bit more optimization can move them into the top 5.' },
        { title: 'Log in a spreadsheet', instruction: 'Each Monday, record: Date | Top 5 keywords | Clicks | Avg position. Over weeks this shows your progress clearly.' },
      ],
      resources: [{ label: 'Search Console', url: 'https://search.google.com/search-console' }],
    },

    {
      id: 'rank-tracking', phase: 10, platform: 'Monitoring', platformKey: 'monitoring',
      platformIcon: '🎯', title: 'Set Up Free Keyword Rank Tracking',
      why: 'Rank tracking shows you exactly where "' + name + '" appears in Google for your target keywords week by week. Without this, you cannot tell if your optimization is working.',
      time: '30 min setup, 15 min/week', difficulty: 'Beginner', frequency: 'Check weekly',
      steps: [
        { title: 'Set up Ubersuggest (free tier)', instruction: 'Go to <strong>app.neilpatel.com/en/ubersuggest</strong>. Sign in with Google. Enter micronaero.com. Click "Rank Tracking" → add keywords: ' + [kw1, kw2, kw3, skw1].join(', ') },
        { title: 'Record baseline', instruction: 'Note today\'s rankings in your Keyword Tracker spreadsheet. This is your Day 0 benchmark.' },
        { title: 'Check rankings manually', instruction: 'Open Chrome Incognito window (Cmd+Shift+N). Search each keyword. Count which position your product page appears. Incognito shows results without personalization.' },
      ],
      resources: [
        { label: 'Ubersuggest (free)', url: 'https://app.neilpatel.com/en/ubersuggest' },
        { label: 'Incognito: Cmd+Shift+N', url: '#' },
      ],
    },

    {
      id: 'monthly-audit', phase: 10, platform: 'Monitoring', platformKey: 'monitoring',
      platformIcon: '🔄', title: 'Monthly Content Refresh & Competitor Audit',
      why: 'Google rewards fresh, updated content. Monthly audits keep your rankings high, content accurate, and reveal gaps that competitors are exploiting.',
      time: '2 hours, first Monday of every month', difficulty: 'Easy', frequency: 'Monthly',
      steps: [
        { title: 'Audit the product page', instruction: 'Visit <strong>' + url + '</strong>. Check: Is everything accurate? Any new features or applications to add? Are prices/availability correct?' },
        { title: 'Update the blog post', instruction: 'Open your blog post. Add any new information. Update the date at the top to "Last updated: [Month Year]." Google rewards freshness.' },
        { title: 'Competitor check', instruction: 'Open Chrome Incognito. Search for "' + kw1 + '". Visit the websites ranking above you. Note what they have that you don\'t. Add that to your task list.' },
        { title: 'Check AI tool citations', instruction: 'Ask ChatGPT and Perplexity: "What are the best ' + cat.toLowerCase() + ' manufacturers in India?" Check if Micron Aerosols appears. Track this monthly.' },
        { title: 'Respond to all reviews', instruction: 'Check Google Business, IndiaMART, LinkedIn, and Instagram for new reviews or comments. Reply to ALL of them — positive and negative — professionally.' },
      ],
      resources: [],
    },

  ];
}
