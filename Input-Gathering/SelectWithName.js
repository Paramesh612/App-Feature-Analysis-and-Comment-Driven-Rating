import gplay from 'google-play-scraper';
import { jsonToCsv } from './jsonToCsv.js';

/**
 * Fetch reviews for a given app name.
 * If the exact app is not found, it retrieves the closest match.
 * @param {string} appName - Name of the app to search for.
 * @param {number} numReviews - Number of reviews to fetch.
 */
async function fetchReviewsByAppName(appName, numReviews) {
    try {
        console.log(`Searching for app: ${appName}...`);

        // Search for the app on Google Play
        const searchResults = await gplay.search({ term: appName, num: 5 });

        if (searchResults.length === 0) {
            console.error(`No app found for "${appName}".`);
            return;
        }

        // Pick the first search result as the closest match
        const app = searchResults[0];
        console.log(`Found closest match: ${app.title} (${app.appId})`);

        // Fetch reviews for the identified app
        console.log(`Fetching ${numReviews} reviews for ${app.title}...`);
        const reviews = await gplay.reviews({
            appId: app.appId,
            sort: gplay.sort.NEWEST,
            num: numReviews
        });

        // Process reviews and extract required fields
        let allReviews = reviews.data.map(review => ({
            Appname: app.title,
            Date: review.at ? review.at.toISOString() : "Unknown",
            Score: review.score,
            Text: review.text || "No text",
            ReplyText: review.replyText || "No reply"
        }));

        console.log(`Fetched ${reviews.data.length} reviews for ${app.title}.`);

        // Convert to CSV and save
        const selectedFields = ["Appname", "Date", "Score", "Text"];
        jsonToCsv(allReviews, selectedFields, `${app.title.replace(/ /g, "_")}_reviews.csv`);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Example usage: Fetch reviews for "Instagram"
fetchReviewsByAppName("Polaris Office: Edit&View, PDF",  15000);
