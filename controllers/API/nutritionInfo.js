const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemInstruction } = require("../API/NuePrompt");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API2);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});

const nutritionInfo = async (req, res) => {
  try {
    const nutrition = req.body.nutritionData;
    const productName = req.body.productName;
    const Prompt = `my product Name is ${productName}\n ${nutrition}`
    console.log("nutrition received:\n", nutrition);

    if (!nutrition) {
      return res
        .status(400)
        .json({ success: false, message: "No nutrition provided." });
    }

    const result = await model.generateContent(Prompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleanedText);
      console.log("Parsed JSON:", parsed);
      return res.status(200).json({
        success: true,
        message: "AI analysis complete.",
        data: parsed,
      });
    } catch (err) {
      console.error("Failed to parse cleaned JSON:", err);
      console.log("Cleaned Raw Text:\n", cleanedText);
      return res.status(500).json({
        success: false,
        message: "Failed to analyze nutrition.",
        error: "",
      });
    }
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze nutrition.",
      error: error.message,
    });
  }
};

module.exports = nutritionInfo;
