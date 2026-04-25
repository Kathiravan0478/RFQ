# Production static build — pair with rfq-local-stack/docker-compose.yml (separate repos).
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# `npm ci` fails here when the lockfile omits optional transitive entries (e.g. @emnapi/* under
# rolldown wasm bindings) that npm on Linux expects. `npm install` resolves on the image OS.
RUN npm install --no-audit --no-fund

COPY . .

ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
