module.exports = logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};
