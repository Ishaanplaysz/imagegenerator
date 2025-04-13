const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt, type } = req.body;

  const model = type === 'video'
    ? 'damo-vilab/modelscope-text-to-video-synthesis'
    : 'stability-ai/stable-diffusion';

  const version = type === 'video'
    ? 'cc6de26d93c0fc6c4544080d8c4a7b45ab5f8478da8319071a87fcccaf4e91a4'
    : 'db21e45fbf3f43caa2b38d776f6f4e827ad6b747d4f70c5f4c75f5ce4c8c3b5f';

  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version,
        input: { prompt },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
