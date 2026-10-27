import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { createRecipe, errorMessage } from '../api/recipes';
import { useToast } from '../context/ToastContext';
import { EMPTY_RECIPE } from '../constants';

export default function AddRecipe() {
  const navigate = useNavigate();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const save = async (payload) => {
    setBusy(true);
    try {
      await createRecipe(payload);
      toast.success('Recipe saved to your collection');
      navigate('/');
    } catch (error) {
      toast.error(errorMessage(error));
      setBusy(false);
    }
  };

  return (
    <div className="container form-page">
      <p className="eyebrow">New entry</p>
      <h1>Write it down</h1>
      <p className="form-page__lead">
        Capture the recipe while you still remember every detail.
      </p>
      <RecipeForm
        initial={EMPTY_RECIPE}
        onSubmit={save}
        busy={busy}
        submitLabel="Save recipe"
        cancelTo="/"
      />
    </div>
  );
}
