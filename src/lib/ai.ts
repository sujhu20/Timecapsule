
/**
 * AI System Logic
 * 
 * This module handles:
 * 1. Content Moderation (Text)
 * 2. Sentiment Analysis (for Feed Ranking)
 * 3. Embedding Generation (Future: for Vector Search)
 * 
 * NOTE: Currently runs in "Simulation Mode" until API Keys are configured.
 */

// Placeholder for OpenAI/Anthropic SDKs
// import OpenAI from 'openai';

interface AnalysisResult {
    flagged: boolean;
    category?: string;
    score: number; // 0 to 1 (1 = positive/safe, 0 = negative/unsafe)
}

const MODERATION_KEYWORDS = ['spam', 'abuse', 'hate', 'violence', 'illegal'];

export class AIService {
    private static instance: AIService;

    private constructor() { }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * Moderates text content for safety.
     * @param text The text to analyze
     */
    public async moderateContent(text: string): Promise<AnalysisResult> {
        // SIMULATION: Simple keyword check
        const lowerText = text.toLowerCase();
        const foundKeyword = MODERATION_KEYWORDS.find(k => lowerText.includes(k));

        if (foundKeyword) {
            return {
                flagged: true,
                category: foundKeyword,
                score: 0.1
            };
        }

        return {
            flagged: false,
            score: 0.9
        };
    }

    /**
     * Analyzes sentiment for feed ranking.
     * @param text The text to analyze
     */
    public async analyzeSentiment(text: string): Promise<number> {
        // SIMULATION: Length-based heuristic (longer often = more effort/quality in this context)
        // In production, use NLP model.
        const lengthScore = Math.min(text.length / 500, 1); // Cap at 1 for 500 chars
        return 0.5 + (lengthScore * 0.5);
    }

    /**
     * Generates a "feed score" for a capsule.
     */
    public async calculateFeedScore(capsule: {
        createdAt: Date;
        likesCount: number;
        commentsCount: number;
        sentimentScore?: number;
    }): Promise<number> {
        const RECENCY_WEIGHT = 0.4;
        const ENGAGEMENT_WEIGHT = 0.4;
        const QUALITY_WEIGHT = 0.2;

        const now = new Date().getTime();
        const created = new Date(capsule.createdAt).getTime();
        const hoursAge = (now - created) / (1000 * 60 * 60);

        // Decay score: 1.0 at 0 hours, approaches 0 over time (e.g., 7 days)
        const recencyScore = Math.max(0, 1 - (hoursAge / 168));

        // Engagement score (logarithmic to dampen viral outliers)
        const engagement = capsule.likesCount + (capsule.commentsCount * 2);
        const engagementScore = Math.min(Math.log(engagement + 1) / 5, 1); // Normalize logic

        const qualityScore = capsule.sentimentScore || 0.5;

        return (
            (recencyScore * RECENCY_WEIGHT) +
            (engagementScore * ENGAGEMENT_WEIGHT) +
            (qualityScore * QUALITY_WEIGHT)
        );
    }
}

export const aiService = AIService.getInstance();
