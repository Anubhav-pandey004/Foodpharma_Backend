const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemInstruction } = require("../API/IngPrompt");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});

const IngredientInfo = async (req, res) => {
  try {
    // console.log("Raw Data\n",req.body.ingredientsData);
    // const ingredients = req.body.ingredientsData?.join(" ");
    const ingredients = req.body.ingredientsData;
    const productName = req.body.productName;
    const Prompt = `my product Name is ${productName}\n ${ingredients}`
    console.log("Ingredients received:\n", ingredients);

    if (!ingredients) {
      return res
        .status(400)
        .json({ success: false, message: "No ingredients provided." });
    }

    const result = await model.generateContent(Prompt);
    // console.log("Pure Result \n",result);
    const responseText = result.response.text();
    // console.log("AI Response:\n", responseText);
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
        message: "Failed to analyze ingredients.",
        error: "",
      });
    }
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze ingredients.",
      error: error.message,
    });
  }
};

module.exports = IngredientInfo;
