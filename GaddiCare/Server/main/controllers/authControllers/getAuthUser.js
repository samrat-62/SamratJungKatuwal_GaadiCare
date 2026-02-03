const getAuthUser = async (req, res) => {
  try {
    return res.status(200).json(req.authUser || null);
  } catch (error) {
    console.error("Error fetching auth user:", error);
    return res.status(500).json(null);
  }
};

export default getAuthUser;
