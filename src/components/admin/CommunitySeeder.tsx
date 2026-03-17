
import * as React from 'react';
import { seedRandomCommunityMembers, getEmptyCommunities, getLonelyUsers } from '../../utils/communitySeeder';
import Loading from '../Loading';

interface ICommunitySeederProps {}

const CommunitySeeder: React.FunctionComponent<ICommunitySeederProps> = () => {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const [userCount, setUserCount] = React.useState(10);
  const [maxPerUser, setMaxPerUser] = React.useState(3);
  const [emptyCommunities, setEmptyCommunities] = React.useState(0);
  const [lonelyUsers, setLonelyUsers] = React.useState(0);

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [empty, lonely] = await Promise.all([
        getEmptyCommunities(),
        getLonelyUsers()
      ]);
      setEmptyCommunities(empty.length);
      setLonelyUsers(lonely.length);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const data = await seedRandomCommunityMembers(userCount, maxPerUser);
      setResults(data);
      await loadStats();
    } catch (error) {
      console.error('Seeding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-slate-900 rounded-xl border border-slate-800">
      <h2 className="text-2xl font-bold text-slate-100 mb-4">
        🌱 Community Seeder
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-slate-400">Empty Communities</p>
          <p className="text-2xl font-bold text-slate-200">{emptyCommunities}</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-slate-400">Users Without Communities</p>
          <p className="text-2xl font-bold text-slate-200">{lonelyUsers}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Number of users to assign
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={userCount}
            onChange={(e) => setUserCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-slate-300">{userCount} users</div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Max communities per user
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={maxPerUser}
            onChange={(e) => setMaxPerUser(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-right text-slate-300">{maxPerUser} communities</div>
        </div>
      </div>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="w-full py-3 bg-emerald-600/20 text-emerald-400 
          rounded-lg hover:bg-emerald-600/30 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          border border-emerald-800/50 font-medium"
      >
        {loading ? <Loading /> : '🚀 Seed Random Communities'}
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Results:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((result) => (
              <div key={result.user_id} 
                className="p-3 bg-slate-800/30 rounded-lg flex justify-between"
              >
                <span className="text-slate-300">u/{result.username}</span>
                <span className="text-emerald-400">
                  +{result.communities_joined} communities
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySeeder;