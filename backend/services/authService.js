import User from "../models/User.js";

/**
 * Find or create a user based on auth provider
 */
export async function findOrCreateOAuthUser({
  provider,
  providerId,
  email,
  name,
  avatar,
}) {
  // 1. Try to find user by provider
  let user = await User.findOne({
    authProviders: {
      $elemMatch: { provider, providerId },
    },
  });

  if (user) return { user, isNewUser: false };

  // 2. Try to find user by email (account linking)
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      user.authProviders.push({ provider, providerId });
      if (avatar) user.avatar = avatar;
      await user.save();
      return { user, isNewUser: false };
    }
  }

  // 3. Create new user
  user = await User.create({
    email,
    name,
    avatar,
    authProviders: [{ provider, providerId }],
  });

  return { user, isNewUser: true };
}
