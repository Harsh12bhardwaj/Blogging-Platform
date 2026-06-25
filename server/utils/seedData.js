const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/category");
const Blogs = require("../models/blogs");
const Comment = require("../models/comment");
const Vote = require("../models/vote");
const LoginActivity = require("../models/LoginActivity");

// Function to generate hashed password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seedDatabase() {
  try {
    console.log("🧹 Clearing existing database data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Blogs.deleteMany({}),
      Comment.deleteMany({}),
      Vote.deleteMany({}),
      LoginActivity.deleteMany({}),
    ]);

    console.log("👥 Seeding Users...");
    const hashedPassword = await hashPassword("password123");

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@demo.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    });

    const author = await User.create({
      name: "Jane Writer",
      email: "author@demo.com",
      password: hashedPassword,
      role: "user",
      isActive: true,
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    });

    const alex = await User.create({
      name: "Alex Developer",
      email: "alex@demo.com",
      password: hashedPassword,
      role: "user",
      isActive: true,
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    });

    const sarah = await User.create({
      name: "Sarah Designer",
      email: "sarah@demo.com",
      password: hashedPassword,
      role: "user",
      isActive: true,
      profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256",
    });

    console.log("📂 Seeding Categories...");
    const categories = await Category.create([
      { name: "Web Development", isActive: true },
      { name: "AI & Machine Learning", isActive: true },
      { name: "Career Advice", isActive: true },
      { name: "UI/UX Design", isActive: true },
      { name: "Lifestyle", isActive: true },
    ]);

    console.log("📝 Seeding Blogs...");
    const blog1 = await Blogs.create({
      blogTitle: "Mastering React 19: New Hooks and Server Actions",
      blogSubTitle: "A deep dive into the latest features of React 19 and how to leverage them in production.",
      blogType: "Web Development",
      blogContent: `
        <p>React 19 is officially here! With this release, the React team has introduced several revolutionary features designed to simplify state management and improve data fetching patterns.</p>
        <h4 style="font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">Key Features Overview:</h4>
        <ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>useActionState:</strong> A new hook that automates managing form submissions and their pending/error states cleanly on the client side.</li>
          <li><strong>Server Actions:</strong> Secure RPC endpoints that allow client-side forms to execute direct backend functionality.</li>
          <li><strong>Document Metadata Support:</strong> Direct support for rendering title, meta, and link tags anywhere in your component tree, which React will hoist to the head.</li>
        </ul>
        <p>These features combined significantly reduce the amount of boilerplate code required to build highly interactive, server-integrated applications. We will explore how to integrate these with Express in our upcoming developer guides.</p>
      `,
      author: author._id,
      isActive: true,
    });

    const blog2 = await Blogs.create({
      blogTitle: "Designing Sleek User Interfaces with Glassmorphism",
      blogSubTitle: "How to craft modern, frosted-glass styles that recruiters and clients love.",
      blogType: "UI/UX Design",
      blogContent: `
        <p>Glassmorphism has taken the design world by storm. Characterized by frosted-glass effects, vibrant colorful backgrounds, and subtle borders, it creates an elegant sense of visual hierarchy.</p>
        <h4 style="font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem;">Core Glassmorphism Properties:</h4>
        <ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem;">
          <li>Multi-layered approach using vibrant underlying background colors.</li>
          <li>Frosted glass overlay achieved via CSS <code>backdrop-filter: blur(8px)</code>.</li>
          <li>A thin, semi-transparent white border to define the edge of the card or modal.</li>
          <li>Subtle drop shadow to establish depth and floating effects.</li>
        </ul>
        <p>When used sparingly, glassmorphism offers a stunning, professional touch to websites. Try implementing it in your landing page and auth card headers to immediately impress recruiters!</p>
      `,
      author: sarah._id,
      isActive: true,
    });

    const blog3 = await Blogs.create({
      blogTitle: "The Developer's Guide to Cracking the Technical Interview",
      blogSubTitle: "Practical strategies for presenting your projects and demonstrating senior-level competence.",
      blogType: "Career Advice",
      blogContent: `
        <p>Technical interviews are more than just writing code; they are about communication, problem-solving, and professional presentation.</p>
        <p>To truly stand out, developers should focus on explainability. Walk the interviewer through your structural design decisions. For example, why choose MongoDB over SQL for your Blogging Platform? Discussing data model scalability, flexible JSON structures, and index performance shows that you think like a software architect, not just a syntax typist.</p>
        <p>Always have 2-3 impressive project walkthroughs prepared where you can deep dive into authentication, rate-limiting, and state optimization mechanisms.</p>
      `,
      author: alex._id,
      isActive: true,
    });

    const blog4 = await Blogs.create({
      blogTitle: "Why AI Will Not Replace Engineers, but Supercharge Them",
      blogSubTitle: "Exploring the symbiotic relationship between developers and AI coding assistants.",
      blogType: "AI & Machine Learning",
      blogContent: `
        <p>There is a lot of discussion about AI replacing software engineers. However, the reality points towards a symbiotic relationship where AI acts as a co-pilot rather than a driver.</p>
        <p>AI tools can generate boilerplate code, write basic unit tests, and help debug errors in seconds. This allows human engineers to focus on higher-level architectural decisions, product design, system performance, and user experience. The future belongs to developers who learn to guide AI models effectively to build robust, secure, and highly scalable software products.</p>
      `,
      author: admin._id,
      isActive: true,
    });

    console.log("💬 Seeding Comments...");
    await Comment.create([
      {
        blog: blog1._id,
        author: alex._id,
        content: "This is a great write-up on React 19! The explanation of Server Actions was super clear.",
      },
      {
        blog: blog1._id,
        author: admin._id,
        content: "Excellent article. Can't wait for React 19 stable patterns to become standard across meta-frameworks.",
      },
      {
        blog: blog2._id,
        author: author._id,
        content: "Love the visual examples! Glassmorphism adds so much depth to UI cards.",
      },
      {
        blog: blog3._id,
        author: sarah._id,
        content: "So true! Communication is easily 50% of the interview score.",
      },
    ]);

    console.log("👍 Seeding Votes...");
    await Vote.create([
      { blog: blog1._id, user: alex._id, type: "like" },
      { blog: blog1._id, user: sarah._id, type: "like" },
      { blog: blog1._id, user: admin._id, type: "like" },
      { blog: blog2._id, user: author._id, type: "like" },
      { blog: blog2._id, user: alex._id, type: "like" },
      { blog: blog3._id, user: admin._id, type: "like" },
      { blog: blog4._id, user: author._id, type: "like" },
    ]);

    console.log("📊 Seeding Login Activity...");
    // Seed some hourly logins for today to make the charts look active
    const now = new Date();
    const mockLogins = [];
    
    // We generate logins scattered across different hours of today
    for (let hour = 0; hour < now.getUTCHours(); hour++) {
      // 1 to 4 logins per hour to look organic
      const count = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < count; i++) {
        const timestamp = new Date();
        timestamp.setUTCHours(hour, Math.floor(Math.random() * 60), 0, 0);
        // Randomly pick a user
        const users = [admin._id, author._id, alex._id, sarah._id];
        const user = users[Math.floor(Math.random() * users.length)];
        mockLogins.push({ user, timestamp });
      }
    }
    if (mockLogins.length > 0) {
      await LoginActivity.create(mockLogins);
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Function to run check-and-seed
async function seedIfNeeded() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("📢 Empty database detected. Initiating automatic seeding...");
      await seedDatabase();
    } else {
      console.log("ℹ️ Database contains existing users. Skipping auto-seeding.");
    }
  } catch (error) {
    console.error("❌ Error checking/seeding database:", error);
  }
}

// Execute directly if run as a standalone script
if (require.main === module) {
  require("dotenv").config();
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("❌ MONGODB_URI is not defined in environment variables!");
    process.exit(1);
  }

  mongoose
    .connect(mongoURI)
    .then(async () => {
      console.log("🔌 MongoDB connected for seeding...");
      await seedDatabase();
      mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
  seedIfNeeded,
};
