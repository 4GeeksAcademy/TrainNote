# Crazy Mountain Bike Social Club - AI Coding Agent Guide

## Project Overview
**Full-stack React + Flask application** for mountain bike enthusiasts to track routes, manage bikes/parts, and share activities with friends. Deployed via Render with PostgreSQL backend.

## Architecture & Critical Patterns

### Backend (Flask API)
- **Structure**: [src/api/](src/api/) with models, routes, utils, and admin setup
- **Database**: SQLAlchemy ORM with Alembic migrations (see [migrations/](migrations/))
- **Key Models** ([src/api/models.py](src/api/models.py)):
  - `User`: Email/password auth with JWT tokens; `bikes` relationship (one-to-many)
  - `Bike`: User-owned bicycles with `parts` relationship (one-to-many)
  - `BikePart`: Components tracking wear (`km_current` vs `km_life`)
- **Authentication**: JWT tokens issued on login via `flask-jwt-extended`; `@jwt_required()` protects routes
- **Admin Panel**: Auto-generated with `flask-admin` at `/admin/` (models auto-registered in [src/api/admin.py](src/api/admin.py))

### Frontend (React + Vite)
- **Layout**: Nested routing via [src/front/routes.jsx](src/front/routes.jsx); `<Layout>` wrapper maintains Navbar/Footer across pages
- **State Management**: Context + Reducer pattern in [src/front/hooks/useGlobalReducer.jsx](src/front/hooks/useGlobalReducer.jsx) for global app state
- **Async Operations**: `useFetchWithLoader` hook in [src/front/hooks/useFetchWithLoader.js](src/front/hooks/useFetchWithLoader.js) enforces minimum 700ms loader display (UX polish)
- **Loader Provider**: [src/front/context/loaderContext.jsx](src/front/context/loaderContext.jsx) manages loading state across API calls
- **Key Pages**: Login/Signup → Home (dashboard) → Profile → Routes (detail/registration/explore/saved)

### Data Flow
1. User logs in at `/login` → JWT token stored (client-side, location TBD—verify before adding storage)
2. Protected pages call API with `Authorization: Bearer <token>` header
3. Backend validates JWT, returns user data + relationships (bikes, parts, routes)
4. Frontend renders data using global reducer for state consistency
5. Cloudinary widgets handle image/video uploads (see [src/front/components/CloudinaryUploadWidget.jsx](src/front/components/CloudinaryUploadWidget.jsx))

## Development Workflows

### Backend Setup & Commands
```bash
# Install dependencies (Python 3.13, managed via Pipenv)
pipenv install

# Database migrations (Alembic)
pipenv run migrate          # Create migration from model changes
pipenv run upgrade          # Apply migrations
pipenv run downgrade        # Revert one migration
pipenv run reset_db         # Clear & reinit (see docs/assets/reset_migrations.bash)

# Test data
pipenv run insert-test-users 5    # Add 5 test users
pipenv run insert-test-data       # Run custom seed (edit src/api/commands.py)

# Run server
pipenv run start            # Flask on http://localhost:3001
```

### Frontend Setup & Commands
```bash
# Node 20+ required; Vite-based
npm install
npm run dev                 # Dev server
npm run build               # Production bundle
npm run lint                # ESLint check (zero warnings enforced)
```

### Environment Variables
- **Backend**: `.env` file (copy from `.env.example`); requires `DATABASE_URL`, `JWT_SECRET_KEY`, `VITE_BACKEND_URL`
- **Frontend**: Vite reads from `.env` as `VITE_*` (e.g., `VITE_BACKEND_URL`)
- **Database**: Supports PostgreSQL (production), SQLite (local dev), MySQL

## Code Patterns & Conventions

### React Components
- **Functional components only**; no class components
- **CSS Modules or BEM naming** (see [src/front/styles/](src/front/styles/))
- **Page components** wrap in `.jsx` extension; place in [src/front/pages/](src/front/pages/) with corresponding CSS
- **Shared components** in [src/front/components/](src/front/components/) (e.g., Navbar, Footer, CloudinaryUploadWidget)
- Example structure: `Login.jsx` imports sub-components from `components/LogIn/` (LoginHeader, LoginForm, SocialLogin)

### Flask Routes
- **Blueprint-based**: All routes in [src/api/routes.py](src/api/routes.py) registered at `/api` prefix in [src/app.py](src/app.py)
- **Error handling**: Use `APIException` utility for consistent error responses
- **Email validation**: `is_valid_email()` helper in [src/api/utils.py](src/api/utils.py)
- **JWT pattern**: `@jwt_required()` decorator + `get_jwt_identity()` to extract user ID from token

### Database Models
- **Serialization**: Add `.serialize()` method to all models (returns dict for API responses)
- **Relationships**: Use `db.relationship()` with `backref` and `cascade="all, delete-orphan"` for parent-child cleanup
- **Never serialize passwords** (security baseline, enforced in User model)

### Global State (Reducer)
- **Actions**: Dispatch with `{type: 'ACTION_NAME', payload: ...}` from any component
- **Store**: Accessed via `const { store, dispatch } = useGlobalReducer()`
- **Example**: `store.todos`, `store.message` (see [src/front/store.js](src/front/store.js))

## Integration Points & Dependencies

### External Services
- **Mapbox**: Embedded maps for route visualization (see components/Map/)
- **Cloudinary**: Image/video uploads via widget (src/front/components/CloudinaryUploadWidget.jsx)
- **Render**: Deployment target (Dockerfile.render, render.yaml configured)

### Key Dependencies
**Backend**: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-Admin, Cloudinary, Gunicorn
**Frontend**: React, React Router, Vite, ESLint

## Common Pitfalls & Best Practices

1. **Migrations**: Always run `pipenv run migrate` after model changes before `pipenv run upgrade`; check generated migration files in [migrations/versions/](migrations/versions/)
2. **JWT Token Storage**: Verify secure storage (httpOnly cookie vs localStorage) before adding auth flows
3. **Loader UX**: Use `useFetchWithLoader` for API calls to enforce consistent 700ms minimum display time
4. **CORS**: Already enabled in [src/app.py](src/app.py) and route blueprints; safe for local/remote frontend
5. **Admin Access**: `/admin/` accessible locally; protect in production via environment config

## File Structure Quick Reference
- **Backend code**: `src/api/` (models, routes, utils, admin, commands)
- **Frontend code**: `src/front/` (pages, components, hooks, context, styles, utils, services)
- **Database**: `migrations/` (Alembic version control), models in `src/api/models.py`
- **Docs**: `docs/` (HELP, PERFORMANCE, CHANGE_LOG)
- **Config**: `.env`, `pycodestyle.cfg`, `eslint.config.js`, `vite.config.js`

## Deployment Notes
- **Build command**: `npm run build` + `pipenv install --deploy` for Python
- **Render setup**: See `render.yaml` and `Dockerfile.render`; auto-runs migrations via `database.sh`
- **Database initialization**: Render executes migrations on deploy; local dev requires manual `pipenv run upgrade`
