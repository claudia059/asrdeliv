import { Router, type IRouter } from "express";
import bcrypt from "bcrypt";
import { db, adminUsersTable } from "../db/src";
import { eq, and, ne } from "drizzle-orm";
import { AdminLoginBody } from "../api-zod/src";
import { signToken, requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message, issues: parsed.error.issues });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const userPayload = (req as any).user;
  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, userPayload.id))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  });
});

router.put("/auth/profile", requireAuth, async (req, res): Promise<void> => {
  const userPayload = (req as any).user;

  const { name, email, currentPassword, newPassword } = req.body as {
    name?: unknown; email?: unknown; currentPassword?: unknown; newPassword?: unknown;
  };

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    res.status(400).json({ error: "Name must be a non-empty string" }); return;
  }
  if (email !== undefined && (typeof email !== "string" || !email.includes("@"))) {
    res.status(400).json({ error: "Invalid email address" }); return;
  }
  if (newPassword !== undefined && (typeof newPassword !== "string" || (newPassword as string).length < 6)) {
    res.status(400).json({ error: "New password must be at least 6 characters" }); return;
  }

  // At least one field must be provided
  if (!name && !email && !newPassword) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }

  // Fetch current user from DB
  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, userPayload.id))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // If changing password, verify currentPassword first
  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: "Current password is required to set a new password" });
      return;
    }
    
    if (typeof currentPassword !== "string") {
      res.status(400).json({ error: "Current password must be a string" });
      return;
    }
    
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }
  }

  // If changing email, ensure it isn't taken by another user
  if (email && email !== user.email) {
    const [existing] = await db
      .select({ id: adminUsersTable.id })
      .from(adminUsersTable)
      .where(and(eq(adminUsersTable.email, email), ne(adminUsersTable.id, user.id)))
      .limit(1);
    if (existing) {
      res.status(409).json({ error: "Email is already in use" });
      return;
    }
  }

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (newPassword) updates.passwordHash = await bcrypt.hash(newPassword, 10);

  const [updated] = await db
    .update(adminUsersTable)
    .set(updates)
    .where(eq(adminUsersTable.id, user.id))
    .returning();

  res.json({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
