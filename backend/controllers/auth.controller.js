import axios from "axios";
import { signupUser, loginUser, oauthLogin } from "../services/auth.service.js";

export const signup = async (req, res) => {
  console.log("SIGNUP BODY:", req.body);

  try {
    const { email, password, name } = req.body;
    const result = await signupUser({ email, password, name });
    res.status(201).json(result);
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(400).json({
      error: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json(result);
  } catch {
    res.status(400).json({ error: "Invalid credentials" });
  }
};

export const githubLogin = (req, res) => {
  const redirectUri = `${process.env.BASE_URL}/api/auth/github/callback`;
  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=user:email`;

  res.redirect(url);
};

export const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email =
      emailRes.data.find((e) => e.primary && e.verified)?.email ||
      emailRes.data.find((e) => e.verified)?.email;

    if (!email) {
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=no_email`);
    }

    if (!email)
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);

    const { token, isNewUser } = await oauthLogin({
      provider: "github",
      providerId: String(userRes.data.id),
      email,
      name: userRes.data.name || userRes.data.login,
      avatar: userRes.data.avatar_url,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}&isNewUser=${isNewUser}`
    );
  } catch {
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
};

export const googleLogin = (req, res) => {
  const redirectUri = `${process.env.BASE_URL}/api/auth/google/callback`;
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile`;

  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    });

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
      }
    );

    const { email, sub, name, picture } = userRes.data;
    if (!email)
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);

    const { token, isNewUser } = await oauthLogin({
      provider: "google",
      providerId: sub,
      email,
      name,
      avatar: picture,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}&isNewUser=${isNewUser}`
    );
  } catch {
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
};
