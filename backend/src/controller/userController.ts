import User from "../models/User";
import { Request, Response } from "express";

import * as authService from "../services/authService";
import { generateToken } from "../utils/jwtUtils";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("Register");

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Please provide name, email & password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User Already Exists!" });
    }

    const user = await authService.registerUser(req.body);
    const token = generateToken(user);
    res
      .status(201)
      .json({ message: "User registered successfully", token, user: user });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: (error as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("Login");
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email & password" });
    }

    const result = await authService.loginUser(email, password);
    if (!result) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const { user, token } = result;
    res.json({
      message: "Login successful",
      token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: (error as Error).message,
    });
  }
};
