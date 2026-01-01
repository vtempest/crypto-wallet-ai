import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articleCache, articleQA } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

interface Article {
  html?: string;
  cite?: string;
  title?: string;
  url?: string;
  author?: string;
  author_cite?: string;
  author_short?: string;
  author_type?: string;
  date?: string;
  source?: string;
  word_count?: number;
}

interface CachedArticle extends Article {
  followUpQuestions?: string[];
  qaHistory?: Array<{ question: string; answer: string }>;
}

// GET /api/article?url=... - Get article with cache
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = await db
      .select()
      .from(articleCache)
      .where(eq(articleCache.url, url))
      .limit(1);

    if (cached.length > 0) {
      const cachedArticle = cached[0];

      // Update hit count and last accessed
      await db
        .update(articleCache)
        .set({
          hitCount: sql`${articleCache.hitCount} + 1`,
          lastAccessed: sql`(unixepoch())`,
        })
        .where(eq(articleCache.url, url));

      // Get Q&A history
      const qaHistory = await db
        .select({
          question: articleQA.question,
          answer: articleQA.answer,
        })
        .from(articleQA)
        .where(eq(articleQA.articleUrl, url));

      const response: CachedArticle = {
        url: cachedArticle.url,
        title: cachedArticle.title || undefined,
        cite: cachedArticle.cite || undefined,
        author: cachedArticle.author || undefined,
        author_cite: cachedArticle.author_cite || undefined,
        author_short: cachedArticle.author_short || undefined,
        author_type: cachedArticle.author_type || undefined,
        date: cachedArticle.date || undefined,
        source: cachedArticle.source || undefined,
        word_count: cachedArticle.word_count || undefined,
        html: cachedArticle.html || undefined,
        followUpQuestions: cachedArticle.followUpQuestions as string[],
        qaHistory: qaHistory,
      };

      return NextResponse.json({
        cached: true,
        article: response,
      });
    }

    // If not in cache, fetch from external API
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(
      `https://app.qwksearch.com/api/extract?url=${encodedUrl}`
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.statusText}`);
    }

    const article: Article = await response.json();

    // Store in cache
    await db.insert(articleCache).values({
      url: url,
      title: article.title || null,
      cite: article.cite || null,
      author: article.author || null,
      author_cite: article.author_cite || null,
      author_short: article.author_short || null,
      author_type: article.author_type || null,
      date: article.date || null,
      source: article.source || null,
      word_count: article.word_count || null,
      html: article.html || null,
      followUpQuestions: [],
      hitCount: 1,
    });

    return NextResponse.json({
      cached: false,
      article: {
        ...article,
        followUpQuestions: [],
        qaHistory: [],
      },
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// POST /api/article - Store Q&A or update follow-up questions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, question, answer, followUpQuestions } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // If storing Q&A pair
    if (question && answer) {
      await db.insert(articleQA).values({
        articleUrl: url,
        question,
        answer,
      });
    }

    // If updating follow-up questions
    if (followUpQuestions && Array.isArray(followUpQuestions)) {
      await db
        .update(articleCache)
        .set({
          followUpQuestions: followUpQuestions,
        })
        .where(eq(articleCache.url, url));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing article data:', error);
    return NextResponse.json(
      { error: 'Failed to store article data' },
      { status: 500 }
    );
  }
}
