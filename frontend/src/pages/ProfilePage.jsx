import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import RecipeGrid from '../components/RecipeGrid';
import AuthButton from '../components/AuthButton';
import Loader from '../components/Loader';

const GET_USER_PROFILE = gql`
  query getUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      name
      email
      avatar
      followers {
        id
        name
        avatar
      }
      following {
        id
        name
        avatar
      }
      recipes {
        id
        title
        image
        cookingTime
        category
        ratings {
          rating
        }
        likes {
          id
          user {
            id
          }
        }
      }
      
    }
  }
`;

const ProfilePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('recipes');
  const { data, loading, error } = useQuery(GET_USER_PROFILE, { 
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });

  if (loading) return <div className="text-center py-8"><Loader/></div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  const user = data.getUserProfile;
  const isCurrentUser = user.id === id; // You'll need to get current user ID from context/auth

  // Extract recipes from likedRecipes
  const likedRecipes = user.likedRecipes?.map(like => like.recipe) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={user.avatar || 'https://i.pravatar.cc/150'}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-black object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.followers?.length || 0}</div>
                <div className="text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.following?.length || 0}</div>
                <div className="text-gray-600">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.recipes?.length || 0}</div>
                <div className="text-gray-600">Recipes</div>
              </div>
            </div>
            <div className="flex gap-4">
              {isCurrentUser && (
                <>
                  <Link
                    to="/create-recipe"
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Create Recipe
                  </Link>
                  <AuthButton isLoggedIn={true} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`pb-2 px-4 ${activeTab === 'recipes' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
          >
            Recipes ({user.recipes?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`pb-2 px-4 ${activeTab === 'likes' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
          >
            Likes ({likedRecipes.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`pb-2 px-4 ${activeTab === 'following' ? 'border-b-2 border-black font-semibold' : 'text-gray-600'}`}
          >
            Following ({user.following?.length || 0})
          </button>
        </div>

        {activeTab === 'recipes' && (
          <RecipeGrid recipes={user.recipes || []} />
        )}

        {activeTab === 'likes' && (
          <RecipeGrid recipes={likedRecipes} />
        )}

        {activeTab === 'following' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.following?.length > 0 ? (
              user.following.map(user => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg flex items-center gap-4"
                >
                  <img
                    src={user.avatar || 'https://i.pravatar.cc/50'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <Link
                      to={`/profile/${user.id}`}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {isCurrentUser ? "You're not following anyone yet" : "This user isn't following anyone"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;