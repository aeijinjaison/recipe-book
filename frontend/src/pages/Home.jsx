import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, deleteRecipe, errorMessage } from '../api/recipes';
import { CATEGORIES } from '../constants';
import RecipeCard from '../components/RecipeCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const toast = useToast();
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [target, setTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      toast.error(errorMessage(error));
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const result = { All: recipes.length };
    CATEGORIES.forEach((item) => {
      result[item] = recipes.filter((recipe) => recipe.category === item).length;
    });
    return result;
  }, [recipes]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesCategory = category === 'All' || recipe.category === category;
      const matchesQuery = term === '' || recipe.name.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [recipes, query, category]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(target._id);
      setRecipes((list) => list.filter((recipe) => recipe._id !== target._id));
      toast.success(`${target.name} was deleted`);
      setTarget(null);
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container">
      <section className="hero">
        <p className="eyebrow">Your collection</p>
        <h1>
          Recipes worth <em>keeping</em>.
        </h1>
        <p className="hero__count">
          {status === 'ready'
            ? `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'} saved so far`
            : 'Opening the pantry'}
        </p>
      </section>

      <section className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search recipes"
        />
        <div className="chips">
          {['All', ...CATEGORIES].map((item) => (
            <button
              key={item}
              type="button"
              className={`chip${category === item ? ' is-active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
              <span>{counts[item] ?? 0}</span>
            </button>
          ))}
        </div>
      </section>

      {status === 'loading' ? (
        <div className="grid">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="card card--skeleton" />
          ))}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="empty">
          <h2>The pantry did not open</h2>
          <p>The server could not be reached. Check that the backend is running.</p>
          <button type="button" className="btn btn--solid" onClick={load}>
            Try again
          </button>
        </div>
      ) : null}

      {status === 'ready' && recipes.length === 0 ? (
        <div className="empty">
          <h2>Nothing on the shelf yet</h2>
          <p>Write down the first recipe you never want to lose.</p>
          <Link to="/new" className="btn btn--solid">
            Add a recipe
          </Link>
        </div>
      ) : null}

      {status === 'ready' && recipes.length > 0 && visible.length === 0 ? (
        <div className="empty">
          <h2>No matches</h2>
          <p>Try another name or switch the category.</p>
        </div>
      ) : null}

      {status === 'ready' && visible.length > 0 ? (
        <div className="grid">
          {visible.map((recipe, index) => (
            <RecipeCard key={recipe._id} recipe={recipe} index={index} onDelete={setTarget} />
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete this recipe?"
        message={target ? `${target.name} will be removed permanently. This cannot be undone.` : ''}
        confirmLabel="Delete recipe"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
