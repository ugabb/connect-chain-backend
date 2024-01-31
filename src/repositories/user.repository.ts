import { prisma } from "../database/prisma-client";
import { User, IUserRepository, UserCreate } from "../interface/user.interface";

class UserRepository implements IUserRepository {
  async createUser(user: UserCreate): Promise<User> {
    // verify if user already exist
    const userExist = await prisma.user.findFirst({
      where: {
        username: user.username,
      },
    });

    if (userExist) {
      throw new Error("User already exist");
    }

    //@ts-ignore
    const userCreated: User = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password,
        profileImage: user.profileImage,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return userCreated;
  }

  async listUsers(): Promise<User[]> {
    //@ts-ignore
    const users: User[] = await prisma.user.findMany({
      include: {
        links: true,
      },
    });

    return users ?? null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    return user ?? null;
  }

  async updateUser(
    userId: string,
    updateFields: Partial<UserCreate>
  ): Promise<User> {
    // verify if user already exist

    const updatedUser: User = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
    });

    return updatedUser;
  }

  async deleteUser(username: string): Promise<User> {
    // verify if user already exist
    const userExist = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!userExist) {
      throw new Error("User does not exist");
    }
    const deletedUser = await prisma.user.delete({
      where: {
        username,
      },
      include: {
        links: true,
      },
    });

    return deletedUser;
  }
}

export { UserRepository };
