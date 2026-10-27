import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const splitLines = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const check = (values) => {
  const errors = {};
  const name = values.name.trim();

  if (name.length < 2) errors.name = 'Enter a recipe name of at least 2 characters';
  else if (name.length > 80) errors.name = 'Keep the name under 80 characters';

  if (!CATEGORIES.includes(values.category)) errors.category = 'Choose a category';

  if (splitLines(values.ingredients).length === 0) {
    errors.ingredients = 'List at least one ingredient';
  }

  if (splitLines(values.steps).length === 0) {
    errors.steps = 'Write at least one preparation step';
  }

  const time = Number(values.cookingTime);
  if (String(values.cookingTime).trim() === '') {
    errors.cookingTime = 'Enter the cooking time in minutes';
  } else if (!Number.isInteger(time) || time < 1) {
    errors.cookingTime = 'Cooking time must be a whole number above zero';
  } else if (time > 1440) {
    errors.cookingTime = 'Cooking time cannot exceed 1440 minutes';
  }

  return errors;
};

function Field({ id, label, hint, error, children }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}

export default function RecipeForm({ initial, onSubmit, busy, submitLabel, cancelTo }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const found = check(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      name: values.name.trim(),
      category: values.category,
      ingredients: splitLines(values.ingredients),
      steps: splitLines(values.steps),
      cookingTime: Number(values.cookingTime),
    });
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <Field id="name" label="Recipe name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={change}
          placeholder="Brown butter banana bread"
          autoComplete="off"
        />
      </Field>

      <div className="form__row">
        <Field id="category" label="Category" error={errors.category}>
          <select id="category" name="category" value={values.category} onChange={change}>
            <option value="" disabled>
              Select one
            </option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field id="cookingTime" label="Cooking time in minutes" error={errors.cookingTime}>
          <input
            id="cookingTime"
            name="cookingTime"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={values.cookingTime}
            onChange={change}
            placeholder="45"
          />
        </Field>
      </div>

      <Field
        id="ingredients"
        label="Ingredients"
        hint="One ingredient per line"
        error={errors.ingredients}
      >
        <textarea
          id="ingredients"
          name="ingredients"
          value={values.ingredients}
          onChange={change}
          placeholder={'3 ripe bananas\n120 g unsalted butter\n200 g plain flour'}
        />
      </Field>

      <Field
        id="steps"
        label="Preparation steps"
        hint="One step per line"
        error={errors.steps}
      >
        <textarea
          id="steps"
          name="steps"
          value={values.steps}
          onChange={change}
          placeholder={'Heat the oven to 175 C.\nBrown the butter and let it cool.\nMash the bananas and fold in the flour.'}
        />
      </Field>

      <div className="form__actions">
        <button type="submit" className="btn btn--solid" disabled={busy}>
          {busy ? 'Saving' : submitLabel}
        </button>
        <Link to={cancelTo} className="btn btn--line">
          Cancel
        </Link>
      </div>
    </form>
  );
}
