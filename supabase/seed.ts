import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import { faqs } from "../src/data/faqs";
// Service role key is required for admin operations such as creating users.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable",
  );
  process.exit(1);
}

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  },
);

async function run() {
  console.log("Starting seed script...");

  // categories
  const categories = [
    { id: "cat-fiber", name: "Fiber Internet", slug: "fiber-internet" },
    {
      id: "cat-security",
      name: "Security Services",
      slug: "security-services",
    },
    { id: "cat-tech", name: "Tech Supply", slug: "tech-supply" },
    {
      id: "cat-training",
      name: "Training & Consulting",
      slug: "training-consulting",
    },
  ];

  await supabase.from("categories").upsert(categories, { onConflict: "id" });

  // products

  // questions (imported from shared static data)
  const questions = faqs.map((item) => ({ question: item.q, answer: item.a }));
  await supabase.from("questions").upsert(questions, { onConflict: "id" });

  // example requests (usually created by end users via the frontend)
  const requests = [
    {
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like more information about your services.",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      message: "Can you provide a quote for fibre installation?",
    },
  ];
  await supabase.from("requests").upsert(requests, { onConflict: "id" });

  // a sample member
  const members = [
    {
      id: "member-1",
      name: "Alice Admin",
      email: "alice@domain.com",
      phone: "555-1234",
      notes: "first staff member",
    },
  ];
  await supabase.from("members").upsert(members, { onConflict: "id" });

  // create an admin user if it doesn't exist
  const adminEmail = "admin@example.com";
  const adminPassword = "SuperSecret123!";

  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const already = existingUser?.users.find((u) => u.email === adminEmail);
  let adminId: string;
  if (already) {
    console.log("admin user already exists, skipping creation");
    adminId = already.id;
  } else {
    console.log("creating admin user");
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });
    if (error) throw error;
    adminId = data.user?.id as string;
  }

  // link role row
  await supabase
    .from("user_roles")
    .upsert({ user_id: adminId, role: "admin" }, { onConflict: "user_id" });

  console.log("seed complete");
}

run().catch((err) => {
  console.error("seed failed", err);
  process.exit(1);
});
