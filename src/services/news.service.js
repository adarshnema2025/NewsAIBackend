const axios = require("axios");
const redisClient = require("../config/redisClient");

const BASE_URL = "https://gnews.io/api/v4/top-headlines";
const CACHE_TTL = 600; // 10 minutes in seconds

exports.getTopHeadlines = async ({ category, lang, country }) => {
    const cacheKey = `news:${category}:${lang}:${country}`;

    try {
        // 1. Try to get from cache
        if (redisClient.isOpen) {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log(`Cache Hit: ${cacheKey}`);
                return JSON.parse(cachedData);
            }
        }

        console.log(`Cache Miss: ${cacheKey}. Fetching from GNews...`);

        // 2. Fetch from GNews
        const response = await axios.get(BASE_URL, {
            params: {
                category,
                lang,
                country,
                apikey: process.env.GNEWS_API_KEY,
            },
        });

        const data = response.data;

        // 3. Save to cache
        if (redisClient.isOpen) {
            await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.error("News API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch news");
    }
};