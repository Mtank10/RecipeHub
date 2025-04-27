import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const demoRecipes = [
  {
    title: 'Authentic Margherita Pizza',
    description: 'Classic Neapolitan pizza with fresh basil, mozzarella, and tomato sauce',
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94',
    cookingTime: 20,
    steps: [
      'Prepare pizza dough',
      'Spread tomato sauce',
      'Add fresh mozzarella',
      'Bake at 475°F for 10-12 minutes',
      'Add fresh basil leaves'
    ],
    tags: ['italian', 'pizza', 'vegetarian'],
    category: 'Main Course',
    ingredients: [
      { name: 'Pizza dough', quantity: '1 ball' },
      { name: 'San Marzano tomatoes', quantity: '200g' },
      { name: 'Fresh mozzarella', quantity: '150g' },
      { name: 'Fresh basil', quantity: '10 leaves' }
    ],
    ratings: [5, 5, 4, 5],
    comments: [
      'Perfect pizza recipe!',
      'Used buffalo mozzarella - amazing!',
      'My new go-to pizza recipe'
    ],
    likes: 15
  },
  {
    title: 'Japanese Ramen',
    description: 'Rich pork broth ramen with chashu pork and soft-boiled eggs',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
    cookingTime: 180,
    steps: [
      'Prepare tonkotsu broth (12 hours)',
      'Marinate and cook chashu pork',
      'Prepare ramen noodles',
      'Soft-boil eggs',
      'Assemble all components'
    ],
    tags: ['japanese', 'noodles', 'pork'],
    category: 'Main Course',
    ingredients: [
      { name: 'Pork bones', quantity: '2kg' },
      { name: 'Ramen noodles', quantity: '200g' },
      { name: 'Pork belly', quantity: '300g' },
      { name: 'Soy sauce', quantity: '50ml' }
    ],
    ratings: [5, 5, 5, 4, 5],
    comments: [
      'Worth the effort!',
      'Best ramen I ever made',
      'Used chicken instead of pork'
    ],
    likes: 28
  },
  {
    title: 'Avocado Toast',
    description: 'Simple yet delicious breakfast with smashed avocado on sourdough',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
    cookingTime: 5,
    steps: [
      'Toast bread',
      'Mash ripe avocado',
      'Season with salt and pepper',
      'Add optional toppings'
    ],
    tags: ['breakfast', 'vegetarian', 'quick'],
    category: 'Breakfast',
    ingredients: [
      { name: 'Sourdough bread', quantity: '2 slices' },
      { name: 'Ripe avocado', quantity: '1 medium' },
      { name: 'Lemon juice', quantity: '1 tsp' }
    ],
    ratings: [4, 5, 4],
    comments: [
      'Perfect quick breakfast',
      'Added chili flakes - delicious!'
    ],
    likes: 12
  },
  {
    title: 'Beef Wellington',
    description: 'Elegant dish with beef tenderloin wrapped in puff pastry',
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d',
    cookingTime: 120,
    steps: [
      'Sear beef tenderloin',
      'Prepare mushroom duxelles',
      'Wrap in prosciutto and puff pastry',
      'Bake at 400°F for 35-40 minutes'
    ],
    tags: ['french', 'beef', 'special-occasion'],
    category: 'Main Course',
    ingredients: [
      { name: 'Beef tenderloin', quantity: '800g' },
      { name: 'Puff pastry', quantity: '1 sheet' },
      { name: 'Mushrooms', quantity: '300g' }
    ],
    ratings: [5, 4, 5, 5],
    comments: [
      'Impressed my dinner guests!',
      'Challenging but worth it'
    ],
    likes: 18
  },
  {
    title: 'Vegetable Curry',
    description: 'Flavorful Indian-style vegetable curry with coconut milk',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    cookingTime: 45,
    steps: [
      'Sauté onions and spices',
      'Add chopped vegetables',
      'Pour coconut milk',
      'Simmer for 30 minutes'
    ],
    tags: ['indian', 'vegetarian', 'vegan'],
    category: 'Main Course',
    ingredients: [
      { name: 'Mixed vegetables', quantity: '500g' },
      { name: 'Coconut milk', quantity: '400ml' },
      { name: 'Curry powder', quantity: '2 tbsp' }
    ],
    ratings: [4, 5, 4, 5],
    comments: [
      'Great vegan option!',
      'Added chickpeas for protein'
    ],
    likes: 22
  },
  {
    title: 'Chocolate Soufflé',
    description: 'Classic French dessert with rich chocolate flavor',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d',
    cookingTime: 30,
    steps: [
      'Melt chocolate and butter',
      'Whisk egg whites to stiff peaks',
      'Fold together gently',
      'Bake at 375°F for 15 minutes'
    ],
    tags: ['dessert', 'french', 'chocolate'],
    category: 'Dessert',
    ingredients: [
      { name: 'Dark chocolate', quantity: '200g' },
      { name: 'Eggs', quantity: '4 large' },
      { name: 'Sugar', quantity: '100g' }
    ],
    ratings: [5, 5, 4, 5],
    comments: [
      'Perfect for date night!',
      'First try and it worked!'
    ],
    likes: 14
  },
  {
    title: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta and olives',
    image: 'https://images.unsplash.com/photo-1546069901-45619606a9c6',
    cookingTime: 15,
    steps: [
      'Chop vegetables',
      'Add olives and feta',
      'Dress with olive oil and lemon',
      'Season to taste'
    ],
    tags: ['salad', 'mediterranean', 'vegetarian'],
    category: 'Appetizer',
    ingredients: [
      { name: 'Cucumber', quantity: '1 medium' },
      { name: 'Tomatoes', quantity: '3 medium' },
      { name: 'Feta cheese', quantity: '150g' }
    ],
    ratings: [4, 5, 5],
    comments: [
      'Perfect summer dish!',
      'Added some oregano - delicious'
    ],
    likes: 9
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Creamy Indian curry with grilled chicken',
    image: 'https://images.unsplash.com/photo-1589652717521-10c0d09dea1e',
    cookingTime: 60,
    steps: [
      'Marinate chicken in spices',
      'Grill chicken pieces',
      'Prepare tomato-based sauce',
      'Simmer together'
    ],
    tags: ['indian', 'chicken', 'curry'],
    category: 'Main Course',
    ingredients: [
      { name: 'Chicken thighs', quantity: '500g' },
      { name: 'Yogurt', quantity: '1 cup' },
      { name: 'Garam masala', quantity: '2 tbsp' }
    ],
    ratings: [5, 5, 4, 5],
    comments: [
      'Better than my local Indian restaurant!',
      'Used coconut milk instead of cream'
    ],
    likes: 25
  },
  {
    title: 'Banana Bread',
    description: 'Moist and flavorful banana bread with walnuts',
    image: 'https://images.unsplash.com/photo-1587131377963-89f268d0bb46',
    cookingTime: 60,
    steps: [
      'Mash ripe bananas',
      'Mix dry ingredients',
      'Combine wet and dry',
      'Bake at 350°F for 50-55 minutes'
    ],
    tags: ['baking', 'dessert', 'vegetarian'],
    category: 'Dessert',
    ingredients: [
      { name: 'Ripe bananas', quantity: '3 medium' },
      { name: 'Flour', quantity: '2 cups' },
      { name: 'Walnuts', quantity: '1/2 cup' }
    ],
    ratings: [4, 5, 5, 4],
    comments: [
      'Perfect way to use old bananas!',
      'Added chocolate chips - amazing!'
    ],
    likes: 17
  },
  {
    title: 'Shrimp Scampi',
    description: 'Garlicky shrimp with linguine in white wine sauce',
    image: 'https://images.unsplash.com/photo-1625944525803-d510d5a4a262',
    cookingTime: 25,
    steps: [
      'Cook linguine',
      'Sauté shrimp with garlic',
      'Deglaze with white wine',
      'Combine with pasta'
    ],
    tags: ['italian', 'seafood', 'pasta'],
    category: 'Main Course',
    ingredients: [
      { name: 'Shrimp', quantity: '400g' },
      { name: 'Linguine', quantity: '300g' },
      { name: 'White wine', quantity: '1/2 cup' }
    ],
    ratings: [5, 5, 4, 5],
    comments: [
      'Restaurant quality!',
      'Used gluten-free pasta - still great'
    ],
    likes: 20
  }
];


async function main() {
  // Create demo users
  const users = await Promise.all(
   [
    prisma.user.upsert({
      where: { email: 'healthy@demo.com' },
      update: {},
      create: {
        name: 'Healthy Eater',
    email: 'healthy@demo.com',
    provider: 'GOOGLE',
    providerId: 'google-222',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
        }
    }),
    prisma.user.upsert({
      where: { email: 'baker@demo.com' },
      update: {},
      create: {
        name: 'Baking Queen',
    email: 'baker@demo.com',
    provider: 'GOOGLE',
    providerId: 'google-333',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e'
  
        }
    }),
    prisma.user.upsert({
      where: { email: 'gordon@demo.com' },
      update: {},
      create: {
        name: 'Chef Gordon',
    email: 'gordon@demo.com',
    provider: 'GOOGLE',
    providerId: 'google-444',
    avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1'
  
        }
    }),
    prisma.user.upsert({
      where: { email: 'explorer@demo.com' },
      update: {},
      create: {
        name: 'Food Explorer',
    email: 'explorer@demo.com',
    provider: 'GOOGLE',
    providerId: 'google-555',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
  
        }
    }),
   ]
  );

  // Create recipes with relationships
  for (const recipeData of demoRecipes) {
    // Randomly select an author from our users
    const authorIndex = Math.floor(Math.random() * users.length);
    
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeData.title,
        description: recipeData.description,
        image: recipeData.image,
        cookingTime: recipeData.cookingTime,
        steps: recipeData.steps,
        tags: recipeData.tags,
        category: recipeData.category,
        author: { connect: { id: users[authorIndex].id } },
        ingredients: { create: recipeData.ingredients }
      }
    });

    // Create ratings
    // await Promise.all(recipeData.ratings.map((rating, index) =>
    //   prisma.rating.create({
    //     data: {
    //       rating,
    //       user: { connect: { id: users[index % users.length].id } },
    //       recipe: { connect: { id: recipe.id } }
    //     }
    //   })
    // ));

    // Create comments
    await Promise.all(recipeData.comments.map((content, index) =>
      prisma.comment.create({
        data: {
          content,
          user: { connect: { id: users[index % users.length].id } },
          recipe: { connect: { id: recipe.id } }
        }
      })
    ));

    // Create likes
    for (let i = 0; i < recipeData.likes; i++) {
      await prisma.recipeLike.create({
        data: {
          user: { connect: { id: users[i % users.length].id } },
          recipe: { connect: { id: recipe.id } }
        }
      });
    }
  }

  console.log('Database seeded successfully with 10 recipes and 5 users!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });