import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const createDefaultAdmin = async () => {
    try {
      const defaultEmail = "maria_admin@yopmail.com";
      const defaultPassword = "Admin@123";    
  
      // Check if admin already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: defaultEmail },
      });
  
      if (existingUser) {
        console.log("Default admin already exists");
        return;
        
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  
      // Create default admin user
      const user = await prisma.user.create({
        data: {
          email: defaultEmail,
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
          role: "ADMIN", // ← force admin role
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
  
    console.log("Default admin created successfully", user)
    } catch (error) {
      console.error("Default Admin Creation Error:", error);
     
    }
  };
  