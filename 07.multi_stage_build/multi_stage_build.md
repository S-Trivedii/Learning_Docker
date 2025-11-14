# Docker Multi-Stage Build: Complete Beginner-Friendly Guide

This document explains Docker multi-stage builds **from the absolute basics**, answers common questions, and includes examples and best‑practice explanations.

---

## 📌 What is a Docker Image?

A Docker image is like a **blueprint** for creating a container. It contains:

- Source code
- Runtime (Node, Python, Go, etc.)
- Dependencies
- Build tools (if required)
- System libraries

You define how an image is created using a **Dockerfile**.

---

## ❗ Problem With Traditional (Single‑Stage) Docker Builds

A normal (single-stage) Dockerfile installs:
✔ runtime dependencies
✔ dev dependencies
✔ build tools
✔ compilers
✔ source code

This makes the final image:

- ❌ Large
- ❌ Slow to download
- ❌ Less secure
- ❌ Contains unnecessary files

To fix this → **multi-stage builds**.

---

# 📦 What is a Docker Multi‑Stage Build?

A multi-stage build means having **more than one `FROM` instruction** in a Dockerfile.

Each `FROM` creates a **new stage**.

The common pattern is:

- **Builder stage** → used for building/compiling the project
- **Runtime stage** → only contains what is needed to run the app

But note: **a multi-stage build does NOT always require both**. (Explained later)

---

# 🧱 Builder Stage (Build Environment)

This stage contains **everything needed to BUILD the project**, such as:

- Compilers
- npm / yarn
- Webpack
- TypeScript
- Babel
- devDependencies
- Source code

### Purpose

To compile, transpile, bundle, or generate the final output.

### Example

```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build   # outputs /app/dist
```

You **never ship this stage to production**.

---

# 🚀 Runtime Stage (Production Environment)

This stage contains only what is needed to **run the already‑built app**.

It includes:
✔ Node/Python/Java runtime
✔ Production dependencies only
✔ Final build output (`dist/`, binary files)

It does **NOT** include:
❌ compilers
❌ npm/yarn build tools
❌ dev dependencies
❌ temporary build files

### Example

```dockerfile
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
CMD ["node", "dist/index.js"]
```

---

# 🎯 Why Use Multi‑Stage Builds?

### ✔ Smaller image size

Only production files are copied.

### ✔ More secure

No build tools included.

### ✔ Faster deployment

Smaller images = faster Docker pulls.

### ✔ Cleaner production environment

Only the final output is shipped.

### ✔ Allows separate build and runtime environments

Builder may be large, runtime can be tiny.

---

# 🧩 Complete Example: Node.js Multi‑Stage Build

```dockerfile
# Stage 1: Builder
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
CMD ["node", "dist/index.js"]
```

The final image is **much smaller** and contains only production artifacts.

---

# ❓ Important Questions You Asked

## 1️⃣ **Is there always a builder stage AND a runtime stage?**

**No.**

Multi‑stage builds simply mean **multiple `FROM` statements**.

They can have:

- Only a builder stage
- Only runtime stages
- Builder → runtime (most common)
- 3, 4, or more stages (complex pipelines)

---

## 2️⃣ **Can we have a multi‑stage build without building anything?**

Yes.

This is a multi-stage build even though nothing is compiled:

```dockerfile
FROM ubuntu:22.04 AS base
RUN apt install -y curl

FROM ubuntu:22.04
COPY --from=base /usr/bin/curl /usr/bin/curl
CMD ["curl", "--version"]
```

---

## 3️⃣ **Can we build and run in the same stage?**

Yes — that’s a **single‑stage build**, NOT multi-stage.

Example (not recommended):

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/index.js"]
```

---

## 4️⃣ **When should you use multi-stage builds?**

Use multi-stage when:

- Your project requires build tools
- You want the smallest possible final image
- You want clean separation between build and runtime
- You want secure and minimal production containers

Most real-world apps **should use multi-stage builds**.

---

## 5️⃣ **When multi-stage builds are NOT needed**

If your project:

- Has no build step
- Runs directly from source
- Has tiny dependencies

Example: a simple Python script.

---

# 🧠 Final Summary (One-Line)

**Builder stage builds the project → runtime stage runs the project.**

And multi-stage builds make Docker images:
✔ smaller
✔ faster
✔ secure
✔ clean

---

**NOTE:** You can visit `Dockerfile.new` to see how a multi-stage build look like.
