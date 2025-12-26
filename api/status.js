export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Missing transaction ID" });
    }

    const SK = "sk_live_oRtiaFBte9HelEt9pC1QJwhy7FJLnw6Aogg4zPRvLcFtbhK1";
    const CRED = Buffer.from(SK + ":").toString('base64');

    try {
        const response = await fetch(`https://api.brpixdigital.com/functions/v1/transactions/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${CRED}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Proxy Status Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
