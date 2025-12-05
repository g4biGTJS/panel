import { createClient } from "@vercel/kv";

// Initialize the Vercel KV client
const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

const ARTICLES_KEY = "glacier_articles"; // The key name for your data in KV

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // Read data from Vercel KV
            const articles = await kv.get(ARTICLES_KEY);
            // Return articles, defaulting to an empty array if nothing is found
            return res.status(200).json(articles || []);
        } catch (error) {
            console.error("KV GET Error:", error);
            return res.status(500).json({ error: "Failed to read articles from KV." });
        }
    }

    if (req.method === "POST") {
        // --- FIX: Manually parse the request body from the client ---
        let body = "";
        await new Promise(resolve => {
            req.on("data", chunk => body += chunk);
            req.on("end", resolve);
        });

        let data;
        try {
            data = JSON.parse(body || "{}");
        } catch (e) {
            return res.status(400).json({ error: "Invalid JSON body." });
        }
        // --- End of Body Parsing Fix ---

        const articles = data.articles;

        if (!articles || !Array.isArray(articles)) {
             return res.status(400).json({ error: "Missing or invalid 'articles' array in body." });
        }

        try {
            // Write data to Vercel KV
            await kv.set(ARTICLES_KEY, articles);
            return res.status(200).json({ ok: true });
        } catch (error) {
            console.error("KV POST Error:", error);
            return res.status(500).json({ error: "Failed to write articles to KV." });
        }
    }

    res.status(405).end();
}
