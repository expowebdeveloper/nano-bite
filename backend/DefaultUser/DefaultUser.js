import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const createDefaultAdmin = async () => {
  const admins = [
    { email: "maria_admin@yopmail.com", password: "Admin@123" },
    { email: process.env.SMTP_USER, password: "Nanobite@13579" },
  ];

  for (const { email, password } of admins) {
    try {
      if (!email) {
        console.log("Skipping admin with missing email (check SMTP_USER env)");
        continue;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        if (existingUser.role === "ADMIN" && !existingUser.isEmailVerified) {
          await prisma.user.update({
            where: { email },
            data: {
              isEmailVerified: true,
              emailVerificationToken: null,
              emailVerificationExpires: null,
            },
          });
          console.log(`Default admin auto-verified: ${email}`);
        } else {
          console.log(`Default admin already exists: ${email}`);
        }
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: "Default Admin",
          first_name: "Default",
          last_name: "Admin",
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

      console.log("Default admin created successfully", user);
    } catch (error) {
      console.error(`Default Admin Creation Error (${email}):`, error);
    }
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
  