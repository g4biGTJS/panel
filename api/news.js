import fs from "fs";
import path from "path";

export default async function handler(req, res) { // NOTE: Added 'async' here
    const file = path.join(process.cwd(), "news.json");

    if (req.method === "GET") {
        try {
            const data = fs.readFileSync(file, "utf8");
            return res.status(200).send(data);
        } catch (error) {
            // Handle case where news.json doesn't exist yet (return empty array)
            if (error.code === 'ENOENT') {
                fs.writeFileSync(file, '[]');
                return res.status(200).send('[]');
            }
            return res.status(500).json({ error: "Failed to read file." });
        }
    }

    if (req.method === "POST") {
        // --- START FIX: Manually parse the request body ---
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

        const articles = data.articles;
        // --- END FIX ---

        if (!articles) {
             return res.status(400).json({ error: "Missing 'articles' in body." });
        }
        
        try {
            fs.writeFileSync(file, JSON.stringify(articles, null, 2));
            return res.status(200).json({ ok: true });
        } catch (error) {
            return res.status(500).json({ error: "Failed to write file." });
        }
    }

    res.status(405).end();
}
