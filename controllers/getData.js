
exports.getData = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Product code is required",
    });
  }

  try {
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${code}`);
    const data = await response.json();
    console.log("Fetched product data:", data);
    
    if (!data || !data.product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product data fetched successfully",
      product: data.product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching product data",
      error: error.message,
    });
  }
};
