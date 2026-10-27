import mongoose from 'mongoose';

export const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const hasEntries = (list) =>
  Array.isArray(list) &&
  list.length > 0 &&
  list.every((item) => typeof item === 'string' && item.trim().length > 0);

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [2, 'Recipe name must be at least 2 characters'],
      maxlength: [80, 'Recipe name must be under 80 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    ingredients: {
      type: [String],
      validate: { validator: hasEntries, message: 'Add at least one ingredient' },
    },
    steps: {
      type: [String],
      validate: { validator: hasEntries, message: 'Add at least one preparation step' },
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
      max: [1440, 'Cooking time cannot exceed 1440 minutes'],
      validate: {
        validator: Number.isInteger,
        message: 'Cooking time must be a whole number',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Recipe', recipeSchema);
