export default function handler(req, res) {
    const servers = global.servers || [];

    res.json({
        success: true,
        activeServers: servers
    });
}
