export default function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).end();

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        // session-less simple allow
        return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ error: "Invalid password" });
}
