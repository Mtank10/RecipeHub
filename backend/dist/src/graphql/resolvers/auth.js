import  jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import dotenv from "dotenv";
import { GraphQLError } from "graphql";
import cloudinary from "../../services/cloudinary.js";
import {PubSub} from "graphql-subscriptions";

const pubsub = new PubSub()

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const authResolvers = {
  Query: {
    getCurrentUser: async (_, __, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
        
      return await prisma.user.findUnique({
        where: { id: context.user.id },
        
      });
    },
    getUserProfile: async (_, { id }) => {
      return await prisma.user.findUnique({
        where: { id }, // Correct way to pass id
        
      });
    },
    
    getTopUsers: async () => {
      return await prisma.user.findMany({
        orderBy: {
          followersCount: 'desc',
        },
        take: 10,
        select: {
          id: true,
          name: true,
          avatar: true,
          followersCount: true,
          _count: {
            select: {
              recipes: true,
            },
          },
        },
      }).then(users => 
        users.map(user => ({
          ...user,
          recipeCount: user._count.recipes,
        }))
      );
    },
    
    
    getRecentActivity: async (_, __, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      
      // Get activity from the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      return await prisma.activity.findMany({
        where: {
          OR: [
            { userId: context.user.id }, // User's own activity
            { targetUserId: context.user.id }, // Activity targeting the user
          ],
          createdAt: {
            gte: oneWeekAgo,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
        include: {
          user: true,
          recipe: true,
        },
      });
    },
    protectedData: async (_, __, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      return "Protected Data";
    },
    recipe: async (_, { id }) => {
      return  await prisma.recipe.findUnique({
       where: { id },
       include: { author: true, ingredients: true, comments: true, likes: true,bookmark:true, ratings: {include:{user:true}} ,likes: { include: { user: true } },},
     })
   },
   categories: async ()=>{
    const categories = await prisma.recipe.findMany({
      select:{
        category:true,
      },
      distinct:["category"],
    });
    console.log(categories)
    return categories.map((cat)=>cat.category);
  },
  recipes: async (_, { page = 1, limit = 10, category }) => {
    const offset = (page - 1) * limit;
    const where = category ? { category } : {};
    
    const recipes = await prisma.recipe.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        author: true,
        ingredients: true,
        comments: true,
        likes: { include: { user: true } },
        ratings: {
          include: {
            user: true,
            recipe:true
          }
        }
      },
    });
  
    const total = await prisma.recipe.count({ where });
    return {
      recipes,
      totalPages: Math.ceil(total / limit),
    };
  },
    
  
  getComments: async (_, { recipeId }) => {
    return await prisma.comment.findMany({
      where: { recipeId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },
  recipeRating: async (_, { id }) => {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { 
        ratings: {
          include: {
            user: true
          }
        } 
      },
    });
    return recipe;
  },
  getBookmarkedRecipes: async (_, __, context) => {
    if (!context.user) throw new GraphQLError("Unauthorized");
    
    return await prisma.bookmark.findMany({
      where: { userId: context.user.id },
      include: {
        recipe: {
          include: {
            author: true,
            likes: true,
          },
        },
      },
    });
  },
  
  },
  Mutation: {
    googleLogin: async (_, { providerId, name, email, avatar }) => {
      let user = await prisma.user.findUnique({ where: { providerId } });

      if (!user) {
        user = await prisma.user.create({
          data: { name, email, avatar, provider: "GOOGLE", providerId },
        });
      }

      const token = generateToken(user);
      return { user, token };
    },
    logout: async (_, __, { req }) => {
      try {
        if (req.session) {
          req.session.destroy((err) => {
            if (err) throw new GraphQLError("Error logging out");
          });
        }
        return true;
      } catch (error) {
        throw new GraphQLError("Error logging out");
      }
    },
    createRecipe: async (_, args, context) => {
      if (!context.user) throw new GraphQLError('Not authenticated');
      
      return prisma.recipe.create({
        data: {
          ...args,
          author: { connect: { id: context.user.id } },  // Get ID from context
          ingredients: { create: args.ingredients }
        }
      });
    },
    followUser: async (_, { targetUserId }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      if (context.user.id === targetUserId) throw new GraphQLError("Cannot follow yourself");
    
      return await prisma.userFollow.create({
        data: {
          follower: { connect: { id: context.user.id } },
          following: { connect: { id: targetUserId } }
        },
        include: {
          follower: true,
          following: true
        }
      });
    },
    unfollowUser: async (_, { targetUserId }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      
      return await prisma.userFollow.delete({
        where: {
          followerId_followingId: {
            followerId: context.user.id,
            followingId: targetUserId
          }
        },
        include: {
          follower: true,
          following: true
        }
      });
    },
    addComment: async (_, { recipeId, content }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");

      const comment = await prisma.comment.create({ data: { recipeId, content, userId: context.user.id } });

      pubsub.publish("COMMENT_ADDED",{commentAdded:comment})

      return comment;
      
    },
    rateRecipe: async (_, { recipeId, rating }, context) => {
      if (!context.user) throw new GraphQLError("Not authenticated");
      // console.log(recipeId,rating)
      return await prisma.rating.upsert({
        where: {
          userId_recipeId: {
            userId: context.user.id,
            recipeId:recipeId
          }
        },
        update: { rating },
        create: {
          rating,
          user: { connect: { id: context.user.id } },
          recipe: { connect: { id: recipeId } }
        },
        include: {
          user: true, // Include user in the response
          recipe:true
        }
      });
    },
    likeRecipe: async (_, { recipeId }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      
      const existingLike = await prisma.recipeLike.findFirst({
        where: {
          userId: context.user.id,
          recipeId
        }
      });

      if (existingLike) {
        throw new GraphQLError("Already liked");
      }

      return prisma.recipeLike.create({
        data: {
          user: { connect: { id: context.user.id } },
          recipe: { connect: { id: recipeId } }
        },
        include: { recipe: {include:{likes:true}} }
      });
    },

    unlikeRecipe: async (_, { recipeId }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");

      const like = await prisma.recipeLike.findFirst({
        where: {
          userId: context.user.id,
          recipeId
        }
      });

      if (!like) {
        throw new GraphQLError("Not liked");
      }

      await prisma.recipeLike.delete({
        where: { id: like.id },
        include: { recipe: true }
      });
      return await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: { likes: true }
      });
    },

    bookmarkRecipe: async (_, { recipeId }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");
      
      return prisma.bookmark.upsert({
        where: {
          userId_recipeId: {
            userId: context.user.id,
            recipeId
          }
        },
        create: {
          user: { connect: { id: context.user.id } },
          recipe: { connect: { id: recipeId } }
        },
        update: {}
      });
    },

    removeBookmark: async (_, { recipeId }, context) => {
      if (!context.user) throw new GraphQLError("Unauthorized");

      return prisma.bookmark.delete({
        where: {
          userId_recipeId: {
            userId: context.user.id,
            recipeId
          }
        }
      });
    },
    
  },
  Subscription:{
    commentAdded:{
      subscribe:(_ ,{recipeId})=>pubsub.asyncIterableIterator(["COMMENT_ADDED"])
  },
  
 },
};
