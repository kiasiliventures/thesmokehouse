import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRole) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  const items = [
    {
      name: "Texas Brisket Plate",
      description: "12-hour smoked brisket with house pickles",
      category: "roasted_meat",
      price: 48000,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      is_available: true
    },
    {
      name: "Smoked Chicken Quarter",
      description: "Juicy smoked chicken, lightly glazed",
      category: "roasted_meat",
      price: 36000,
      image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1200&q=80",
      is_available: true
    },
    {
      name: "Maple Pork Ribs",
      description: "Sticky maple glaze, fall-off-the-bone",
      category: "roasted_meat",
      price: 45000,
      image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80",
      is_available: true
    },
    {
      name: "Smoked Goat Chops",
      description: "Char-finished goat chops with spice rub",
      category: "roasted_meat",
      price: 42000,
      image_url: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
      is_available: true
    },
    {
      name: "BBQ Beef Short Ribs",
      description: "Slow-smoked short ribs glazed in house BBQ",
      category: "roasted_meat",
      price: 52000,
      image_url: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80",
      is_available: true
    },
    {
      name: "Whole Smoked Tilapia",
      description: "Lake-style smoked tilapia with lemon pepper",
      category: "roasted_meat",
      price: 34000,
      image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80",
      is_available: true
    },
    {
      name: "Pepper Crust Pork Belly",
      description: "Crisp-edged pork belly with black pepper crust",
      category: "roasted_meat",
      price: 39000,
      image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1400&q=80",
      is_available: true
    },
    {
      name: "Honey Smoked Turkey",
      description: "Tender turkey slices with mild honey glaze",
      category: "roasted_meat",
      price: 37000,
      image_url: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&w=1200&q=80",
      is_available: true
    },
    {
      name: "Buttermilk Slaw",
      description: "Fresh crunchy slaw",
      category: "sides",
      price: 9000,
      image_url: null,
      is_available: true
    },
    {
      name: "Smokehouse Beans",
      description: "Slow-cooked beans with smoky depth",
      category: "sides",
      price: 10000,
      image_url: null,
      is_available: true
    },
    {
      name: "Cornbread",
      description: "Warm honey-butter cornbread",
      category: "sides",
      price: 7000,
      image_url: null,
      is_available: true
    },
    {
      name: "Sweet Tea",
      description: "Southern sweet tea",
      category: "drinks",
      price: 5000,
      image_url: null,
      is_available: true
    },
    {
      name: "House Lemonade",
      description: "Fresh lemon and mint",
      category: "drinks",
      price: 6000,
      image_url: null,
      is_available: true
    }
  ];

  const { error } = await supabase.from("menu_items").upsert(items, { onConflict: "name" });

  if (error) throw error;
  console.log("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
