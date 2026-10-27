# Larder

A recipe book built with the MERN stack. Recipes are stored in MongoDB Atlas and managed through a REST API.

## Setup

1. Create a free cluster on MongoDB Atlas, add a database user, and allow network access from `0.0.0.0/0`.
2. Open `backend/.env` and replace the `MONGO_URI` value with your own connection string.
3. Start the backend:

```
cd backend
npm install
npm run dev
```

4. Start the frontend in a second terminal:

```
cd frontend
npm install
npm run dev
```

5. Open http://localhost:5173

## API

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | /api/recipes | List all recipes |
| GET | /api/recipes/:id | Get one recipe |
| POST | /api/recipes | Create a recipe |
| PUT | /api/recipes/:id | Update a recipe |
| DELETE | /api/recipes/:id | Delete a recipe |
