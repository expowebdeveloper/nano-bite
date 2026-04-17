import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const HIDDEN_SYSTEM_EMAILS = [
  "maria_admin@yopmail.com",
  "evano88@yopmail.com",
];

export const createDefaultAdmin = async () => {
  try {
    const admins = [
      { email: "maria_admin@yopmail.com", password: "Admin@123" },
      { email: process.env.SMTP_USER, password: "Nanobite@13579" },
    ];

    for (const { email, password } of admins) {
      if (!email) {
        console.log("Skipping empty email");
        continue;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`Admin already exists: ${email}`);
        continue; // ✅ don't break loop
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: "Nano bite",
          first_name: "Nano",
          last_name: "Bite",
          address: "",
          state: "",
          city: "",
          zipCode: "",
          country: "",
          phone_number: "",
          role: "ADMIN",
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

      console.log(`Admin created: ${user.email}`);
    }
  } catch (error) {
    console.error("Default Admin Creation Error:", error);
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
  