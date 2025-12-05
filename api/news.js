import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const file = path.join(process.cwd(), "news.json");

    if (req.method === "GET") {
        const data = fs.readFileSync(file, "utf8");
        return res.status(200).send(data);
    }

    if (req.method === "POST") {
        fs.writeFileSync(file, JSON.stringify(req.body.articles, null, 2));
        return res.status(200).json({ ok: true });
    }

    res.status(405).end();
}
