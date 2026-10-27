import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getRecipe, deleteRecipe, errorMessage } from '../api/recipes';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { formatDate, formatTime } from '../utils/format';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState('loading');
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    getRecipe(id)
      .then((data) => {
        if (!active) return;
        setRecipe(data);
        setStatus('ready');
      })
      .catch((error) => {
        if (!active) return;
        setStatus('missing');
        toast.error(errorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [id, toast]);

  const remove = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(id);
      toast.success(`${recipe.name} was deleted`);
      navigate('/');
    } catch (error) {
      toast.error(errorMessage(error));
      setDeleting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container detail">
        <div className="skeleton-line skeleton-line--wide" />
        <div className="skeleton-line" />
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="container">
        <div className="empty">
          <h2>Recipe not found</h2>
          <p>It may have been deleted, or the link is wrong.</p>
          <Link to="/" className="btn btn--solid">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container detail" data-cat={recipe.category}>
      <Link to="/" className="back">
        All recipes
      </Link>

      <header className="detail__head">
        <span className="tag">{recipe.category}</span>
        <h1>{recipe.name}</h1>
        <dl className="detail__meta">
          <div>
            <dt>Cooking time</dt>
            <dd>{formatTime(recipe.cookingTime)}</dd>
          </div>
          <div>
            <dt>Ingredients</dt>
            <dd>{recipe.ingredients.length}</dd>
          </div>
          <div>
            <dt>Steps</dt>
            <dd>{recipe.steps.length}</dd>
          </div>
          <div>
            <dt>Added</dt>
            <dd>{formatDate(recipe.createdAt)}</dd>
          </div>
        </dl>
        <div className="detail__actions">
          <Link to={`/recipes/${recipe._id}/edit`} className="btn btn--solid">
            Edit recipe
          </Link>
          <button type="button" className="btn btn--line" onClick={() => setConfirming(true)}>
            Delete
          </button>
        </div>
      </header>

      <div className="detail__body">
        <section className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="steps">
          <h2>Method</h2>
          <ol>
            {recipe.steps.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete this recipe?"
        message={`${recipe.name} will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete recipe"
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
