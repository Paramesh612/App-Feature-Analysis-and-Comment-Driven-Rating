import gplay from 'google-play-scraper';
import { jsonToCsv } from './jsonToCsv.js';

/**
 * Fetch reviews for top 50 social media apps and save as CSV
 * @param {number} numApps - Number of apps to fetch
 * @param {number} numReviews - Number of reviews per app
 */
async function fetchAndSaveReviews(numApps, numReviews, category) {
    try {
        console.log("Fetching top "+category+" apps...");

        // Fetch top 50 social media apps
        const apps = await gplay.list({
            category: gplay.category[category],
            collection: gplay.collection.TOP_FREE,
            num: numApps
        });

        console.log(`Fetched ${apps.length} ${category} apps.`);

        let allReviews = [];

        for (const app of apps) {
            console.log(`Fetching reviews for ${app.title} (${app.appId})...`);

            // Fetch reviews
            const reviews = await gplay.reviews({
                appId: app.appId,
                sort: gplay.sort.NEWEST,
                num: numReviews
            });

            // Process reviews and extract required fields
            reviews.data.forEach(review => {
                allReviews.push({
                    Appname: app.title,
                    AppId: app.appId,
                    Date: review.at? review.at.toISOString() : "Unknown",
                    Score: review.score,
                    Text: review.text,
                    ReplyText: review.replyText || "No reply"
                });
            });

            console.log(`Fetched ${reviews.data.length} reviews for ${app.title}`);
        }

        // Convert to CSV and save
        const selectedFields = ["Appname","AppId","Date", "Score", "Text"];
        jsonToCsv(allReviews, selectedFields, `${category}_reviews.csv`);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// fetchAndSaveReviews(numApps, numReviews, category)
fetchAndSaveReviews(100, 10000, "FINANCE");
