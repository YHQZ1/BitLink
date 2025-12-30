import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User.js";
import { findOrCreateOAuthUser } from "../services/authService.js";
import { hashPassword, verifyPassword } from "../services/passwordService.js";

/* ------------------------------------------------------------------
   LOCAL AUTH
------------------------------------------------------------------- */

export const signup = async (req, res) => {
  try {
    const { password, name } = req.body;
    const email = req.body.email?.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      email,
      name,
      passwordHash,
      authProviders: [{ provider: "local", providerId: email }],
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

/* ------------------------------------------------------------------
   GITHUB OAUTH
------------------------------------------------------------------- */

export const githubLogin = (req, res) => {
  const redirectUri = `${process.env.BASE_URL}/api/auth/github/callback`;

  const githubAuthUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=user:email`;

  res.redirect(githubAuthUrl);
};

export const githubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const githubAccessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      }
    );

    const githubUser = userResponse.data;
    const primaryEmail = emailResponse.data.find(
      (e) => e.primary && e.verified
    )?.email;

    if (!primaryEmail) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth?error=no_verified_email`
      );
    }

    const { user, isNewUser } = await findOrCreateOAuthUser({
      provider: "github",
      providerId: String(githubUser.id),
      email: primaryEmail.toLowerCase(),
      name: githubUser.name || githubUser.login,
      avatar: githubUser.avatar_url,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}&isNewUser=${isNewUser}`
    );
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
};

/* ------------------------------------------------------------------
   GOOGLE OAUTH
------------------------------------------------------------------- */

export const googleLogin = (req, res) => {
  const redirectUri = `${process.env.BASE_URL}/api/auth/google/callback`;

  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  res.redirect(googleAuthUrl);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser = userResponse.data;

    if (!googleUser.email) {
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=no_email`);
    }

    const { user, isNewUser } = await findOrCreateOAuthUser({
      provider: "google",
      providerId: googleUser.sub,
      email: googleUser.email.toLowerCase(),
      name: googleUser.name,
      avatar: googleUser.picture,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}&isNewUser=${isNewUser}`
    );
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
};
