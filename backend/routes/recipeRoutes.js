import { Router } from 'express';
import mongoose from 'mongoose';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';

const router = Router();

router.param('id', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }
  next();
});

router.route('/').get(getRecipes).post(createRecipe);
router.route('/:id').get(getRecipe).put(updateRecipe).delete(deleteRecipe);

export default router;
