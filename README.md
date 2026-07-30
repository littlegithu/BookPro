# BookPro

A full-stack medical appointment booking platform with a React frontend and Flask backend.

## Project Structure

```
BookPro/
├── backend/          # Flask REST API
│   ├── app.py
│   ├── model.py
│   ├── schema.py
│   ├── resources.py
│   ├── auth.py
│   ├── extensions.py
│   ├── seed.py
│   ├── .env          # Contains Neon database URI and other secrets (not committed)
│   └── Pipfile
├── src/              # React frontend
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── services/
│   └── ...
└── package.json
```

## Setup

### Database (Neon PostgreSQL)

1. Create a Neon PostgreSQL database at https://neon.tech
2. Copy your connection string
3. Paste it into `backend/.env` as `DATABASE_URI=postgresql://...`
4. The `.env` file is gitignored and should not be committed

### Backend

```bash
cd backend
pip install pipenv
pipenv install
pipenv run flask db init
pipenv run flask db migrate -m "Initial migration"
pipenv run flask db upgrade
pipenv run python seed.py
pipenv run flask run
```

The backend will run on `http://localhost:5000`.

### Auth Server (Better Auth)

```bash
cd auth-server
npm install
npm run dev
```

The auth server will run on `http://localhost:3001`.

### Frontend

In a new terminal:

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

## API Endpoints

- `POST /users/login` - Login
- `POST /users` - Register
- `GET /users` - List users
- `GET /users/<id>` - Get user
- `PUT /users/<id>` - Update user
- `DELETE /users/<id>` - Delete user

- `GET /doctors` - List doctors
- `GET /doctors/<id>` - Get doctor
- `POST /doctors` - Create doctor
- `PUT /doctors/<id>` - Update doctor
- `DELETE /doctors/<id>` - Delete doctor

- `GET /patients` - List patients
- `GET /patients/<id>` - Get patient

- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `GET /appointments/<id>` - Get appointment
- `PUT /appointments/<id>` - Update appointment
- `DELETE /appointments/<id>` - Delete appointment

- `GET /hospitals` - List hospitals
- `GET /hospitals/<id>` - Get hospital

- `GET /reviews` - List reviews
- `GET /reviews/<id>` - Get review

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, React Router
- **Backend**: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-RESTful, Flask-Bcrypt, Flask-CORS, Marshmallow
- **Database**: PostgreSQL (hosted on Neon)
