
export const logout = (req, res) => {
  try {
    if(req.authUser){

        res.clearCookie('accessToken', {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'strict', 
        });
    
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    return res.status(400).json({ message: 'No user logged in' });
   
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error while logging out' });
  }
};
