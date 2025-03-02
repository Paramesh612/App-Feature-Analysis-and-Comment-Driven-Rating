import gplay from 'google-play-scraper';
import { jsonToCsv } from './jsonToCsv.js';

/**
 * Fetch reviews for scanner apps and save as CSV
 * @param {number} numApps - Number of apps to fetch
 * @param {number} numReviews - Number of reviews per app
 */
async function fetchAndSaveScannerReviews(numApps, numReviews) {
    try {
        console.log("Searching for scanner apps...");

        // Search for apps with 'scanner' keyword
        const apps = await gplay.search({
            term: 'scanner',   // search term
            num: numApps,      // number of apps to fetch
            category: gplay.category.TOOLS, // filtering by tools category (many scanner apps fall here)
            collection: gplay.collection.TOP_FREE // Only top free apps
        });

        console.log(`Fetched ${apps.length} scanner apps.`);

        let allReviews = [];

        for (const app of apps) {
            console.log(`Fetching reviews for ${app.title} (${app.appId})...`);

            // Fetch reviews for each app
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
                    Date: review.at ? review.at.toISOString() : "Unknown",
                    Score: review.score,
                    Text: review.text,
                    ReplyText: review.replyText || "No reply"
                });
            });

            console.log(`Fetched ${reviews.data.length} reviews for ${app.title}`);
        }

        // Convert reviews to CSV and save
        const selectedFields = ["Appname", "AppId", "Date", "Score", "Text"];
        jsonToCsv(allReviews, selectedFields, "scanner_reviews.csv");

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call function to fetch reviews for scanner apps
fetchAndSaveScannerReviews(100, 10000);