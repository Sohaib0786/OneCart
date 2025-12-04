import User from "../model/userModel.js";

// Get currently logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: `getCurrentUser error: ${error.message}` });
  }
};

// Get Admin info
export const getAdmin = async (req, res) => {
  try {
    if (!req.adminEmail) {
      return res.status(401).json({ message: "Unauthorized: Admin email missing" });
    }

    return res.status(200).json({
      email: req.adminEmail,
      role: "admin",
    });
  } catch (error) {
    console.error("getAdmin error:", error);
    return res.status(500).json({ message: `getAdmin error: ${error.message}` });
  }
};
