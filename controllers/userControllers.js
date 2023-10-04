import user from "../model/userModel.js";
// POST: /signup
export async function signUp(req, res){
    try {
        const { username, password, email } = req.body;

        // Check if the user already exists
        const existingUser = await user.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Create a new user
        const newUser = new user({ username, password, email });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
