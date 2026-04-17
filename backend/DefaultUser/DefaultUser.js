import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const createDefaultAdmin = async () => {
  const admins = [
    { email: "maria_admin@yopmail.com", password: "Admin@123" },
    { email: process.env.SMTP_USER, password: "Nanobite@13579" },
  ];

  for (const { email, password } of admins) {
  if (!email) continue;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      // optional:
      // password: hashedPassword
    },
    create: {
      email,
      password: hashedPassword,
      fullName: "Default Admin",
      first_name: "Default",
      last_name: "Admin",
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log(`Admin ensured: ${email}`);
}
};

export const createDefaultDentist = async () => {
  try {
    const defaultEmail = "evano88@yopmail.com";
    const defaultPassword = "Admin@123";

    // Check if dentist already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: defaultEmail },
    });

    if (existingUser) {
      console.log("Default dentist already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        fullName: "Default Dentist",
        first_name: "Default",
        last_name: "Dentist",
        address: "",
        state: "",
        city: "",
        zipCode: "",
        country: "",
        phone_number: "",
        // role defaults to Dentist in Prisma schema, but set explicitly for clarity
        role: "Dentist",
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("Default dentist created successfully", user);
  } catch (error) {
    console.error("Default Dentist Creation Error:", error);
  }
};
  