import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
/* 
1. get request
2. validate request w/ zod
3. check db if user email exists
4. check if passwordHash is same
5. sign and generate jwt
*/
const loginSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string(),
});

export async function POST(request: Request) {
  let body = await request.json();

  const parsed = loginSchema.parse(body);

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, parsed.email));

  const passwordCompare = await bcrypt.compare(parsed.password, user.password);
  if (!passwordCompare) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN!, {
    expiresIn: "1h",
  });

  const cookieStore = await cookies();
  cookieStore.set("jwt", token, {
    httpOnly: true, //js cant read it
    secure: process.env.NODE_ENV === "production", //use https in prod
    sameSite: "strict", //csrf
    path: "/",
    maxAge: 60 * 60,
  });

  return NextResponse.json({ message: "logged in" }, { status: 200 });
}
