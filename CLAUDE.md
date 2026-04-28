# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Express 5 + MongoDB (Mongoose) REST API for user management. MVC-like structure.

## Commands

```bash
npm run start:dev      # Start dev server with nodemon (port 3000)
npm run start:prod     # Start production server (NODE_ENV=production)
npm run lint           # ESLint check (Node/CommonJS globals, Prettier integration)
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier format all files
npm run format:check   # Prettier check only
```

No test framework is configured.

## Architecture

```
index.js                  # Entry: loads .config.env, connects DB, starts server
app.js                    # Express app: morgan (dev), JSON body parser, routes, 404 handler, error controller
├── config/db.js          # Mongoose connection (DATABASE + DATABASE_PASSWORD from env)
├── routes/userRoute.js   # RESTful routes: GET/POST /users, GET/PATCH/DELETE /users/:id
├── controllers/
│   ├── userController.js # CRUD handlers: getUserList, getUserById, createUser, updateUserById, deleteUser
│   └── errorController.js# Global error handler: dev (verbose) vs prod (sanitized) responses
├── models/userModel.js   # Mongoose schema: name (unique), age, sex (enum), phone (regex), createdAt, + fullName virtual
└── utils/
    ├── appError.js       # Custom Error subclass with statusCode, status, isOperational flag
    ├── catchAsync.js     # Wraps async fns to forward rejected promises to next(err)
    └── apiFeatures.js    # Query builder: filter(), sort(), paginate(), select() — chain on User.find()
```

### Key Patterns

- **Async error handling**: All async controller handlers are wrapped with `catchAsync` — never use try/catch in controllers.
- **Operational errors**: Use `new AppError(message, statusCode)` to create known errors; `next(err)` passes them to the global error handler.
- **API query features**: The `APIFeatures` class accepts a Mongoose query and `req.query`, exposing chainable methods for filtering, sorting (comma-separated fields), pagination (`page`/`limit` params, default 10), and field selection.
- **Global error handler** (`errorController.js`): In development, returns full error object + stack trace. In production, returns only `isOperational` error messages; unexpected errors return a generic "服务器内部错误" (500).
- **Config**: Environment variables loaded from `.config.env` (gitignored, not committed). `NODE_ENV`, `PORT`, `DATABASE`, `DATABASE_PASSWORD` are required.
