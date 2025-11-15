import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How to and style",
  "music",
  "news and politices",
  "people and blogs",
  "pets and animals",
  "science and technology",
  "sports",
  "travel and events",
];

async function main() {
  // console.log("Seeding categories...");
  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `videos related to ${name.toLowerCase()}`,
    }));
    await db.insert(categories).values(values);
    // console.log("categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}
main();
