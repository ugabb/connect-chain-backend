import { prisma } from "../database/prisma-client";
import {
  User,
  UserCreate,
  UserLogin,
  UserResponse,
} from "../interface/user.interface";
import { UserRepository } from "../repositories/user.repository";

import { sha256 } from "crypto-hash";

class UserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(user: UserLogin): Promise<{
    userResponse: UserResponse;
    payload: { userId: string; username: string; secure: boolean };
  }> {
    // verify if user exist
    const userExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { username: user.username }],
      },
    });
    if (!userExist) throw new Error("User not exist");

    const userResponse: UserResponse = {
      username: userExist.username,
      email: userExist.email,
      id: userExist.id,
      name: userExist.name,
      profileImage: userExist.profileImage,
    };

    // verify if password is matching
    const passwordMatch = user.password === userExist.password; // use bcrypt to hash password
    if (!passwordMatch) throw new Error("Password don't match");

    const payload = {
      userId: userExist.id,
      username: user.username,
      secure: true,
    };

    return { userResponse, payload };
  }

  async createUser(user: UserCreate): Promise<User> {
    //check if user exist
    const userExist = await prisma.user.findFirst({
      where: {
        username: user.username,
      },
    });

    if (userExist) throw new Error("User Already Exist");

    // encrypt password
    // user.password = await sha256(user.password);

    // first capital letter
    user.firstName =
      user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
    user.lastName =
      user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);

    const userCreated = await this.userRepository.createUser(user);

    return userCreated;
  }

  async listUsers(): Promise<User> {
    const users = await this.userRepository.listUsers();

    if (users.length <= 0) {
      throw new Error("No users found!");
    }
    //@ts-ignore
    return users;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.getUserByUsername(username);
    //@ts-ignore
    return user;
  }

  async updateUser(
    userId: string,
    updateFields: Partial<UserCreate>
  ): Promise<User> {
    const userExist = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userExist) {
      throw new Error("User does not exist");
    }

    updateFields.updatedAt = new Date();
    const updatedUser = await this.userRepository.updateUser(
      userId,
      updateFields
    );
    return updatedUser;
  }

  async deleteUser(username: string): Promise<User> {
    const deletedUser = await this.userRepository.deleteUser(username);

    return deletedUser;
  }
}

export { UserUseCase };
