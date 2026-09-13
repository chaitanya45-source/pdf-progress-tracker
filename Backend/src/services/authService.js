import { findUserByEmail } from "../dao/userDao.js";
import { ConflictError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";
import { createUser } from "../dao/userDao.js";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errorHandler.js";


export const registerUser = async(username , email , password) => {
   const user = await findUserByEmail(email);

   if (user) {
        throw new ConflictError("User already exits");
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = await createUser(username , email, hashedPassword);
   const token = signToken({id: newUser.id});
   return {token , user: newUser};
}

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signToken({ id: user.id });

  return { token, user };
};