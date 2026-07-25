import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

/* 
1. validate request with zod
2. check db for existing user
3. hash pw
4. store user in db
5. send response
*/
const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  let body = await request.json();

  const parsed = registerSchema.parse(body);

  // console.log(parsed);
  // {}

  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.email));

  // console.log(existingUser);
  // []

  if (existingUser.length > 1) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);

  //add user to db
  const newUser = await db
    .insert(users)
    .values({ email: parsed.email, passwordHash });

  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
