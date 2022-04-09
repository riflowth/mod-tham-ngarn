# Install required dependencies only when needed
FROM node:lts-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /opt/webserver
COPY /packages/frontend/package.json yarn.lock .
RUN yarn install --frozen-lockfile

# Rebuild the source code of application only when needed
FROM node:lts-alpine AS builder

WORKDIR /opt/webserver
COPY --from=deps /opt/webserver/node_modules ./node_modules
COPY /packages/frontend/. .
RUN yarn build && yarn install --frozen-lockfile --production

# For running the application
FROM node:lts-alpine AS runner

WORKDIR /opt/webserver

RUN apk add tzdata
ENV TZ Asia/Bangkok

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app

COPY --from=builder /opt/webserver/package.json ./package.json
COPY --from=builder /opt/webserver/node_modules ./node_modules
COPY --from=builder /opt/webserver/public ./public
COPY --from=builder /opt/webserver/next.config.js ./
COPY --from=builder --chown=app:nodejs /opt/webserver/.next ./.next

USER app
EXPOSE 3000

CMD [ "yarn", "start" ]
