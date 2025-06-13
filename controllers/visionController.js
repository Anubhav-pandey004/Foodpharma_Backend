const vision = require('@google-cloud/vision');

// Creates a client (use service account key or set env variable GOOGLE_APPLICATION_CREDENTIALS)
const client = 'AIzaSyDx8ggNQ-0x3_1GMdDeJJEMqqq50jxCDPI';

// Analyze Image
exports.analyzeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;

    res.json({ success: true, text: detections[0]?.description || '' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Vision API error' });
  }
};
