/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  companyName: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  avatarUrl: string;
  createdAt: string;
  lastLogin: string;
  status: "Active" | "Pending Analysis" | "Suspended";
  isVerified: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
}

export interface VerificationToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
}

export interface PasswordResetToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
}

interface DatabaseSchema {
  users: User[];
  workspaces: Workspace[];
  sessions: Session[];
  verificationTokens: VerificationToken[];
  passwordResetTokens: PasswordResetToken[];
}

const DB_DIR = path.join(process.cwd(), "server", "data");
const DB_FILE = path.join(DB_DIR, "db.json");

class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: [],
      workspaces: [],
      sessions: [],
      verificationTokens: [],
      passwordResetTokens: []
    };
    this.initialize();
  }

  private initialize() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (error) {
      console.log("[DB INFO] Handled database initialization.");
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (error) {
      console.log("[DB INFO] Handled database save.");
    }
  }

  // Users Helper
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: Omit<User, "id" | "createdAt" | "lastLogin">): User {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const userIndex = this.data.users.findIndex(u => u.id === id);
    if (userIndex === -1) return undefined;
    
    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates
    };
    this.save();
    return this.data.users[userIndex];
  }

  // Workspaces Helper
  public getWorkspaces(): Workspace[] {
    return this.data.workspaces;
  }

  public findWorkspaceByOwner(ownerId: string): Workspace | undefined {
    return this.data.workspaces.find(w => w.ownerId === ownerId);
  }

  public createWorkspace(workspace: Omit<Workspace, "id" | "createdAt">): Workspace {
    const newWorkspace: Workspace = {
      ...workspace,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    this.data.workspaces.push(newWorkspace);
    this.save();
    return newWorkspace;
  }

  public updateWorkspace(id: string, name: string): Workspace | undefined {
    const wsIndex = this.data.workspaces.findIndex(w => w.id === id);
    if (wsIndex === -1) return undefined;
    this.data.workspaces[wsIndex].name = name;
    this.save();
    return this.data.workspaces[wsIndex];
  }

  // Sessions Helper
  public getSessions(): Session[] {
    return this.data.sessions;
  }

  public createSession(userId: string, expiresAt: Date): Session {
    const newSession: Session = {
      id: crypto.randomUUID(),
      token: crypto.randomUUID() + crypto.randomUUID(),
      userId,
      expiresAt: expiresAt.toISOString()
    };
    // Clean expired sessions
    this.data.sessions = this.data.sessions.filter(s => new Date(s.expiresAt) > new Date());
    this.data.sessions.push(newSession);
    this.save();
    return newSession;
  }

  public findSessionByToken(token: string): Session | undefined {
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return undefined;
    if (new Date(session.expiresAt) < new Date()) {
      this.deleteSession(session.token);
      return undefined;
    }
    return session;
  }

  public deleteSession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  public deleteSessionsForUser(userId: string) {
    this.data.sessions = this.data.sessions.filter(s => s.userId !== userId);
    this.save();
  }

  // Verification Tokens Helper
  public createVerificationToken(email: string, token: string, expiresAt: Date): VerificationToken {
    const newToken: VerificationToken = {
      id: crypto.randomUUID(),
      token,
      email,
      expiresAt: expiresAt.toISOString()
    };
    this.data.verificationTokens = this.data.verificationTokens.filter(t => t.email !== email);
    this.data.verificationTokens.push(newToken);
    this.save();
    return newToken;
  }

  public findVerificationToken(token: string): VerificationToken | undefined {
    return this.data.verificationTokens.find(t => t.token === token);
  }

  public deleteVerificationToken(token: string) {
    this.data.verificationTokens = this.data.verificationTokens.filter(t => t.token !== token);
    this.save();
  }

  // Password Reset Tokens Helper
  public createPasswordResetToken(email: string, token: string, expiresAt: Date): PasswordResetToken {
    const newToken: PasswordResetToken = {
      id: crypto.randomUUID(),
      token,
      email,
      expiresAt: expiresAt.toISOString()
    };
    this.data.passwordResetTokens = this.data.passwordResetTokens.filter(t => t.email !== email);
    this.data.passwordResetTokens.push(newToken);
    this.save();
    return newToken;
  }

  public findPasswordResetToken(token: string): PasswordResetToken | undefined {
    return this.data.passwordResetTokens.find(t => t.token === token);
  }

  public deletePasswordResetToken(token: string) {
    this.data.passwordResetTokens = this.data.passwordResetTokens.filter(t => t.token !== token);
    this.save();
  }
}

export const db = new LocalDatabase();
