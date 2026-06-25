import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseURL = "https://agzkleqebkeyzdtgawbr.supabase.co";
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseURL, supabaseAnonKey);

  const limit = 10;
  const page = Math.floor(Math.random() * 4) + 1;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.rpc("get_posts_with_counts");

  const feedMode = [
    "fresh",
    "rising",
    "rising_comments",
    "discussion",
  ][Math.floor(Math.random() * 4)];

  if (feedMode === "fresh") {
    query = query.order("created_at", { ascending: false });
  }

  if (feedMode === "rising") {
    query = query
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false });
  }

  if (feedMode === "rising_comments") {
    query = query
      .order("like_count", { ascending: false })
      .order("created_at", { ascending: false })
      .order("comment_count", { ascending: false });
  }

  if (feedMode === "discussion") {
    query = query
      .order("comment_count", { ascending: false })
      .order("created_at", { ascending: false });
  }

  const { data, error } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return Response.json({
    feedMode,
    page,
    data,
  });
}
