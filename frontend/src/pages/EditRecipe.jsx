import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { getRecipe, updateRecipe, errorMessage } from '../api/recipes';
import { useToast } from '../context/ToastContext';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [initial, setInitial] = useState(null);
  const [status, setStatus] = useState('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    getRecipe(id)
      .then((recipe) => {
        if (!active) return;
        setInitial({
          name: recipe.name,
          category: recipe.category,
          ingredients: recipe.ingredients.join('\n'),
          steps: recipe.steps.join('\n'),
          cookingTime: String(recipe.cookingTime),
        });
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

  const save = async (payload) => {
    setBusy(true);
    try {
      await updateRecipe(id, payload);
      toast.success('Changes saved');
      navigate(`/recipes/${id}`);
    } catch (error) {
      toast.error(errorMessage(error));
      setBusy(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container form-page">
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
          <p>There is nothing to edit here.</p>
          <Link to="/" className="btn btn--solid">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container form-page">
      <p className="eyebrow">Editing</p>
      <h1>Refine the recipe</h1>
      <p className="form-page__lead">Adjust anything, then save. Your collection updates at once.</p>
      <RecipeForm
        initial={initial}
        onSubmit={save}
        busy={busy}
        submitLabel="Save changes"
        cancelTo={`/recipes/${id}`}
      />
    </div>
  );
}
