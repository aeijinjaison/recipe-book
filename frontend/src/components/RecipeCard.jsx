import { Link } from 'react-router-dom';
import { formatTime } from '../utils/format';

export default function RecipeCard({ recipe, index, onDelete }) {
  return (
    <article className="card" data-cat={recipe.category}>
      <Link to={`/recipes/${recipe._id}`} className="card__link">
        <div className="card__top">
          <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="tag">{recipe.category}</span>
        </div>
        <h3 className="card__title">{recipe.name}</h3>
        <div className="card__foot">
          <span className="card__time">{formatTime(recipe.cookingTime)}</span>
          <span className="card__open">View recipe</span>
        </div>
      </Link>
      <div className="card__actions">
        <Link to={`/recipes/${recipe._id}/edit`}>Edit</Link>
        <button type="button" onClick={() => onDelete(recipe)}>
          Delete
        </button>
      </div>
    </article>
  );
}
