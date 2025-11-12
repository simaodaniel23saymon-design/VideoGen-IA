export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: 'Texto é obrigatório.' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Chave API não configurada.' });

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: texto,
        voice_settings: { stability: 0.5, similarity_boost: 0.8 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const audioUrl = 'https://example.com/audio.mp3';
    res.status(200).json({ audioUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na comunicação com ElevenLabs.' });
  }
}