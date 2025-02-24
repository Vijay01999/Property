import { InsertUser, User, Property, InsertProperty, users, properties, notifications } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { eq } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>; // New method for admin dashboard

  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: number): Promise<void>;
  getPropertiesByUser(userId: number): Promise<Property[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  private db;
  sessionStore: session.Store;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values({
      ...insertUser,
      createdAt: new Date(),
      isAdmin: false,
      theme: "system",
      emailNotifications: true,
    }).returning();
    return user;
  }

  async getProperties(): Promise<Property[]> {
    return await this.db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const results = await this.db.select().from(properties).where(eq(properties.id, id));
    return results[0];
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await this.db.insert(properties).values({
      ...insertProperty,
      createdAt: new Date(),
      status: 'active',
    }).returning();
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property> {
    const [property] = await this.db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  async deleteProperty(id: number): Promise<void> {
    await this.db.delete(properties).where(eq(properties.id, id));
  }

  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return await this.db
      .select()
      .from(properties)
      .where(eq(properties.userId, userId));
  }
}

// Create and export a single instance of the storage
export const storage = new DatabaseStorage();