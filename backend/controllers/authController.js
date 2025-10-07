// src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

// ------------------- LOCAL SIGNUP -------------------
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const user = new User({ username, email: email.toLowerCase(), password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------- LOCAL LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------- GITHUB LOGIN -------------------
export const githubLogin = (req, res) => {
  const redirectUri = "http://localhost:3000/api/auth/github/callback";
  const clientId = process.env.GITHUB_CLIENT_ID;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  res.redirect(githubAuthUrl);
};

// ------------------- GITHUB CALLBACK -------------------
export const githubCallback = async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // Exchange code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      { client_id: clientId, client_secret: clientSecret, code },
      { headers: { Accept: "application/json" } }
    );

    const githubAccessToken = tokenResponse.data.access_token;

    // Fetch user info from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      }
    );

    const primaryEmail = emailResponse.data.find((e) => e.primary)?.email;
    const githubUser = userResponse.data;

    // Find existing user by githubId or email
    let user = await User.findOne({
      $or: [{ githubId: githubUser.id }, { email: primaryEmail }],
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        githubId: githubUser.id,
        username: githubUser.login,
        email: primaryEmail || `${githubUser.login}@github.com`,
        avatar: githubUser.avatar_url,
      });
    } else {
      if (!user.githubId) {
        user.githubId = githubUser.id;
        user.avatar = githubUser.avatar_url;
        await user.save();
      }
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect with user info
    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${jwtToken}&isNewUser=${isNewUser}&username=${user.username}`
    );
  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
};
