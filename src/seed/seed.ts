import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://agzkleqebkeyzdtgawbr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnemtsZXFlYmtleXpkdGdhd2JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk4MDgwMywiZXhwIjoyMDg3NTU2ODAzfQ.Zmwh5on21cGkc5NfoNmtOASuI0pKP8OS2mRqlCv4m6s" as string;

export const supabase = createClient(supabaseURL, supabaseAnonKey);
const randomPastDate = (days = 14) =>
  new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * days);

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🌱 Seeding begins...");

  // ---------------- USERS ----------------

  const usernames = [
    "codeNomad",
    "bugHunter",
    "stackOverlord",
    "pixelProphet",
    "lateNightDev",
    "chessTheory",
    "memeCompiler",
    "aiWanderer",
    "minimalSyntax",
    "refactorKing",
  ];

  const userMap = new Map<string, string>();

  for (const username of usernames) {
    const { data } = await supabase.auth.admin.createUser({
      email: `${username}@test.com`,
      password: "password123",
      email_confirm: true,
    });

    if (!(data && data.user)) return;
    const userId = data!.user.id;
    userMap.set(username, userId);

    await supabase.from("profiles").insert({
      id: userId,
      username,
      display_name: username,
      bio: `Hi, I'm ${username}. I have strong opinions about indentation.`,
      avatar_url: `https://picsum.photos/seed/${username}/200`,
      created_at: randomPastDate(),
    });
  }

  // ---------------- COMMUNITIES ----------------

  const communitySeeds = [
    { seed_key: "comm_dev", name: "dev-talk" },
    { seed_key: "comm_memes", name: "memes" },
    { seed_key: "comm_career", name: "career-advice" },
    { seed_key: "comm_chess", name: "chess-club" },
    { seed_key: "comm_ai", name: "ai-discussions" },
    { seed_key: "comm_uni", name: "university-life" },
    { seed_key: "comm_productivity", name: "productivity" },
    { seed_key: "comm_react", name: "react-help" },
    { seed_key: "comm_unpopular", name: "unpopular-opinions" },
    { seed_key: "comm_sideprojects", name: "side-projects" },
  ];

  const communityMap = new Map<string, string>();

  for (const comm of communitySeeds) {
    const { data } = await supabase
      .from("communities")
      .insert({
        name: comm.name,
        description: `Welcome to ${comm.name}`,
        user_id: pick([...userMap.values()]),
        created_at: randomPastDate(),
        seed_key: comm.seed_key,
      })
      .select()
      .single();
    await delay(1000);
    const { data: data2 } = await supabase
      .from("communities")
      .select("*")
      .eq("seed_key", comm.seed_key)
      .single();
    data.id = data2.id;

    communityMap.set(comm.seed_key, data.id);
    await delay(50);
  }

  // ---------------- POSTS ----------------

  const postMap = new Map<string, string>();

  const titles = [
    "Anyone else feel impostor syndrome?",
    "Hot take: Tabs > Spaces",
    "Best way to stay productive?",
    "React state is confusing me",
    "I built my first fullstack app!",
    "What’s the hardest bug you’ve fixed?",
  ];

  for (const [seed_key, communityId] of communityMap) {
    for (let i = 0; i < 5; i++) {
      const postSeed = `${seed_key}_post_${i}`;

      const createdAt = randomPastDate();

      await supabase.from("posts").insert({
        title: pick(titles),
        content: "Long thoughtful discussion happens here.",
        image_url:
          Math.random() > 0.4
            ? `https://picsum.photos/seed/${postSeed}/600/400`
            : null,
        community_id: communityId,
        user_id: pick([...userMap.values()]),
        created_at: createdAt,
        seed_key: postSeed,
      });
      await delay(1000);

      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("seed_key", postSeed)
        .single();

      postMap.set(postSeed, data.id);
      await delay(50);
    }
  }

  // ---------------- COMMENTS + REPLIES ----------------

  const commentMap = new Map<string, string>();

  const commentPool = [
    "This is painfully relatable.",
    "I disagree but respectfully.",
    "Have you tried simplifying it?",
    "This happened to me last week.",
    "You’re overthinking it.",
  ];

  for (const [postSeed, postId] of postMap) {
    const baseTime = randomPastDate();
    await delay(50);

    for (let i = 0; i < 3; i++) {
      const commentSeed = `${postSeed}_comment_${i}`;

      await supabase.from("comments").insert({
        content: pick(commentPool),
        user_id: pick([...userMap.values()]),
        post_id: postId,
        created_at: new Date(baseTime.getTime() + i * 600000),
        seed_key: commentSeed,
      });
      await delay(1000);
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("seed_key", commentSeed)
        .single();

      commentMap.set(commentSeed, data.id);

      // 50% chance of reply
      if (Math.random() > 0.5) {
        await supabase.from("comments").insert({
          content: "Replying because this is interesting.",
          user_id: pick([...userMap.values()]),
          post_id: postId,
          parent_comment_id: data.id,
          created_at: new Date(baseTime.getTime() + i * 900000),
        });
      }
    }
  }

  // ---------------- VOTES ----------------

  for (const [postSeed, postId] of postMap) {
    for (let i = 0; i < 4; i++) {
      await supabase.from("votes").insert({
        post_id: postId,
        user_id: pick([...userMap.values()]),
        vote: Math.random() > 0.2 ? 1 : -1,
        created_at: randomPastDate(),
        seed_key: `${postSeed}_vote_${i}`,
      });
    }
  }

  console.log("✅ Seeding complete.");
  console.log(`Users: ${userMap.size}`);
  console.log(`Communities: ${communityMap.size}`);
  console.log(`Posts: ${postMap.size}`);
}

main();
