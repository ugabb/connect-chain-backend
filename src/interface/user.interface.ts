import { z } from "zod";
import { linkSchema } from "./link.interface";

export const userSchema = z.object({
  id: z.string().uuid().nullable(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6),
  profileImage: z.string().url().nullable(),
  links: z.array(linkSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userResponseSchema = z.object({
  id: z.string().uuid().nullable(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  profileImage: z.string().url().nullable(),
});

export const userCreateSchema = z.object({
  id: z.string().uuid().nullable(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6),
  profileImage: z.string().url().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const userCredentialsLogin = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type User = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof userCredentialsLogin>;
export type UserResponse = z.infer<typeof userResponseSchema>;

export interface IUserRepository {
  createUser(user: UserCreate): Promise<User>;
  listUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | null>;
  updateUser(userId: string, updateFields: Partial<UserCreate>): Promise<User>;
  deleteUser(username: string): Promise<User>;
}
