let servers = global.servers || [];
global.servers = servers;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Only POST allowed" });
    }

    try {
        const data = req.body;

        if (!data || !data.jobId || !data.placeId) {
            return res.status(400).json({ success: false, error: "Invalid data" });
        }

        // Evitar duplicados
        const exists = servers.find(s => s.gameInstanceId === data.jobId);
        if (!exists) {
            servers.push({
                placeId: data.placeId,
                gameInstanceId: data.jobId,
                animalData: data.petData || null,
                time: Date.now()
            });
        }

        // Limpiar servers viejos (5 minutos)
        const now = Date.now();
        global.servers = servers = servers.filter(s => now - s.time < 5 * 60 * 1000);

        res.json({ success: true });

    } catch (e) {
        res.status(500).json({ success: false, error: e.toString() });
    }
}
