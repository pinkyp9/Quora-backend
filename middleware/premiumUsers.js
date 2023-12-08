import  {User}  from "../model/userModel.js";  
const authorizePremium = async(req, res, next) => {
    try {
        const user = await User.findById(req.userId);

    if (!user) {
      throw new Error('User not found');
    }
    if (user.role === "premium") {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized. Only premium users can upload profile pictures." });
    }   
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    
        
    }
    
  };

  export default authorizePremium;