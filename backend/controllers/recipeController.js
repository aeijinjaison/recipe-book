import Recipe from '../models/Recipe.js';

const handle = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const toList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split('\n').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const shape = (body) => ({
  name: body.name,
  category: body.category,
  ingredients: toList(body.ingredients),
  steps: toList(body.steps),
  cookingTime:
    body.cookingTime === '' || body.cookingTime == null
      ? undefined
      : Number(body.cookingTime),
});

export const getRecipes = handle(async (req, res) => {
  const recipes = await Recipe.find().sort({ createdAt: -1 });
  res.json(recipes);
});

export const getRecipe = handle(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  res.json(recipe);
});

export const createRecipe = handle(async (req, res) => {
  const recipe = await Recipe.create(shape(req.body));
  res.status(201).json(recipe);
});

export const updateRecipe = handle(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  recipe.set(shape(req.body));
  await recipe.save();
  res.json(recipe);
});

export const deleteRecipe = handle(async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  res.json({ message: 'Recipe deleted', id: recipe._id });
});
