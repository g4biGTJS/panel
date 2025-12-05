export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).end();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // IMPORTANT: parse body manually (Vercel requirement)
    let body = "";

    await new Promise(resolve => {
        req.on("data", chunk => body += chunk);
        req.on("end", resolve);
    });

    const data = JSON.parse(body || "{}");
    const password = data.password;

    if (password === ADMIN_PASSWORD) {
        return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ error: "Invalid password" });
}
