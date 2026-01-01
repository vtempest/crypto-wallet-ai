
import { NextRequest, NextResponse } from 'next/server';
import { searchWeb } from '@/lib/research/searxng'; // Import from local library

export const runtime = 'edge'; // Optional: Use edge runtime if compatible with dependencies, otherwise remove. 
// chrono-node might not be fully edge compatible if it uses big standard library features, but often it is. 
// safe to revert to nodejs if needed.

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const query = searchParams.get('q');
  const cat = searchParams.get('cat') || 'general';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const lang = searchParams.get('lang') || 'en-US';
  const safesearch = searchParams.get('safesearch') === 'true';
  const recency = searchParams.get('recency') || undefined;
  const publicInstances = searchParams.get('publicInstances') === 'true';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const startTime = Date.now();

  // Custom domains logic (placeholders for now as per user code being adapted)
  const searxngDomain = 'https://search.qwksearch.com'; // Hardcoded for now as user wanted this base
  const proxyDomain = '';

  let results = await searchWeb(query, {
    category: cat,
    recency,
    safesearch,
    maxRetries: 6,
    privateSearxng: publicInstances ? false : searxngDomain,
    proxy: proxyDomain,
    lang,
    page
  });

  // Retry logic if no results (from user code)
  // Check if results is empty array or empty result object.
  const hasResults = Array.isArray(results) ? results.length > 0 : results.results.length > 0;

  if (!hasResults) {
    // Retry with privateSearxng false
    results = await searchWeb(query, {
      category: cat,
      recency,
      safesearch,
      maxRetries: 6,
      privateSearxng: false,
      proxy: proxyDomain,
      lang,
      page
    });
  }

  const finalHasResults = Array.isArray(results) ? results.length > 0 : results.results.length > 0;

  if (!finalHasResults) {
    return NextResponse.json({ error: 'No results found' }, { status: 500 }); // Or 404
  }

  const elapsedTime = Date.now() - startTime;

  if (Array.isArray(results)) {
    return NextResponse.json({ results, elapsedTime });
  } else {
    return NextResponse.json({ ...results, elapsedTime });
  }
}
