import User, { IUser } from "../models/User";
import { generateToken } from "../utils/jwtUtils";

export const registerUser = async (
  userData: Partial<IUser>
): Promise<IUser> => {
  const user = new User(userData);
  user.save();
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string } | null> => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return null;
  }

  await user.save();
  const token = generateToken(user);
  return { user, token };
};
