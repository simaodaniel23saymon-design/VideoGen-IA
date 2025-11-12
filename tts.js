export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Texto é obrigatório.' });
      return;
    }
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Chave ELEVENLABS_API_KEY não definida no ambiente.' });
      return;
    }

    const voice = 'alloy';
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      res.status(response.status).json({ error: 'Erro na ElevenLabs', details: await response.text() });
      return;
    }
    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    res.status(500).json({ error: 'Falha no proxy', details: err.message });
  }
}
