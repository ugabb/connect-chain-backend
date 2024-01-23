import { prisma } from "../database/prisma-client";
import { User, UserCreate } from "../interface/user.interface";
import { UserRepository } from "../repositories/user.repository";

class UserUseCase {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(user: UserCreate): Promise<User> {
    //check if user exist
    // const userExist = await this.userRepository.

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
