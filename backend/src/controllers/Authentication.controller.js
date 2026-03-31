import {register,login} from "../services/Authentication.services.js";

export const registerUser = async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
