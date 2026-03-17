// utils/communitySeeder.ts
import { supabase } from '../supabase-client';

interface RandomAssignmentResult {
  user_id: string;
  username: string;
  communities_joined: number;
}

/**
 * Randomly assign users to communities
 * @param userCount Number of users to assign (default: 10)
 * @param maxPerUser Maximum communities per user (default: 3)
 */
export const seedRandomCommunityMembers = async (
  userCount: number = 10,
  maxPerUser: number = 3
): Promise<RandomAssignmentResult[]> => {
  try {
    const { data, error } = await supabase
      .rpc('assign_random_users_to_communities', {
        target_user_count: userCount,
        max_communities_per_user: maxPerUser
      });

    if (error) throw error;
    
    console.log('✅ Random assignment complete!');
    console.table(data);
    return data as RandomAssignmentResult[];
  } catch (error) {
    console.error('❌ Error assigning users:', error);
    throw error;
  }
};

/**
 * Get communities with no members
 */
export const getEmptyCommunities = async () => {
  const { data, error } = await supabase
    .from('communities')
    .select(`
      id,
      name,
      member_count:community_members(count)
    `)
    .eq('community_members.community_id', null);

  if (error) throw error;
  return data;
};

/**
 * Get users with no community memberships
 */
export const getLonelyUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      community_count:community_members(count)
    `)
    .eq('community_members.user_id', null);

  if (error) throw error;
  return data;
};