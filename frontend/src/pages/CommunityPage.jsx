import { useQuery, gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GET_TOP_USERS = gql`
  query GetTopUsers {
    getTopUsers {
      id
      name
      avatar
      followersCount
      recipeCount
    }
  }
`;

const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity {
    getRecentActivity {
      id
      type
      user {
        id
        name
        avatar
      }
      recipe {
        id
        title
      }
      createdAt
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($targetUserId: ID!) {
    followUser(targetUserId: $targetUserId) {
      id
      follower {
        id
        name
      }
      following {
        id
        name
      }
      createdAt
    }
  }
`;

const CommunityPage = () => {
  const navigate = useNavigate();
  const { data: topUsersData, loading: topUsersLoading, error: topUsersError } = useQuery(GET_TOP_USERS);
  const { data: activityData, loading: activityLoading, error: activityError } = useQuery(GET_RECENT_ACTIVITY);
  const [followUser] = useMutation(FOLLOW_USER, {
    refetchQueries: [{ query: GET_TOP_USERS }],
  });
  const handleFollow = async (targetUserId) => {
    try {
      await followUser({ variables: { targetUserId } });
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  // console.log(topUsersData)
  // console.log(activityData)
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return <FaHeart className="text-red-500" />;
      case 'COMMENT':
        return <FaComment className="text-blue-500" />;
      case 'NEW_RECIPE':
        return <FaUtensils className="text-green-500" />;
      default:
        return <FaUserPlus className="text-purple-500" />;
    }
  };

  const renderActivityText = (activity) => {
    switch (activity.type) {
      case 'LIKE':
        return (
          <>
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleUserClick(activity.user.id)}
            >
              {activity.user.name}
            </span> liked your recipe{' '}
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleRecipeClick(activity.recipe.id)}
            >
              {activity.recipe.title}
            </span>
          </>
        );
      case 'COMMENT':
        return (
          <>
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleUserClick(activity.user.id)}
            >
              {activity.user.name}
            </span> commented on your recipe{' '}
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleRecipeClick(activity.recipe.id)}
            >
              {activity.recipe.title}
            </span>
          </>
        );
      case 'NEW_RECIPE':
        return (
          <>
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleUserClick(activity.user.id)}
            >
              {activity.user.name}
            </span> posted a new recipe{' '}
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleRecipeClick(activity.recipe.id)}
            >
              {activity.recipe.title}
            </span>
          </>
        );
      default:
        return (
          <>
            <span 
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => handleUserClick(activity.user.id)}
            >
              {activity.user.name}
            </span> started following you
          </>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cooking Community</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Top Chefs</h2>
          {topUsersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : topUsersError ? (
            <div className="text-red-500">Error loading top users</div>
          ) : (
            <div className="space-y-4">
              {topUsersData.getTopUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium w-6">{index + 1}.</span>
                      <img
                        src={user.avatar || 'http://i.pravatar.cc/50'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">
                        {user.followersCount} followers • {user.recipeCount} recipes
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(user.id);
                    }}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
                  >
                    Follow
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {activityLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activityError ? (
            <div className="text-red-500">Error loading recent activity</div>
          ) : (
            <div className="space-y-4">
              {activityData.getRecentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 border-b"
                >
                  <div className="mt-1">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {renderActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityPage;