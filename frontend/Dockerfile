# Install dependencies only when needed
ARG DOCKER_IMAGE_PREFIX=""
FROM ${DOCKER_IMAGE_PREFIX}node:18.19-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update && apk upgrade && apk add --no-cache --upgrade libcrypto3 libssl3
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Development image
FROM deps as dev

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "dev"]

# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Rebuild the source code only when needed
# This stage is needed so env variables are loaded on build time of nextjs and CMS pages can be fetched and generated
FROM deps AS builder-test

ENV NODE_ENV test

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Test image, copy all the files and run next
# We use this for e2e testing.
FROM builder-test AS test
WORKDIR /app

ENV NODE_ENV test

# https://nextjs.org/docs/api-reference/next/image#built-in-loaders
# https://nextjs.org/docs/messages/sharp-missing-in-production
RUN yarn add sharp

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system nextjs --uid 1001

COPY --from=builder-test /app/next-i18next.config.js ./
COPY --from=builder-test /app/next.config.js ./
COPY --from=builder-test /app/public ./public
COPY --from=builder-test /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder-test --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder-test --chown=nextjs:nodejs /app/.next/static ./.next/static

# user should own this dir to be able to create cache dir for example
RUN chown -R nextjs:nodejs ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]


# Production image, copy all the files and run next
FROM builder AS prod
WORKDIR /app

ENV NODE_ENV production

# https://nextjs.org/docs/api-reference/next/image#built-in-loaders
# https://nextjs.org/docs/messages/sharp-missing-in-production
RUN yarn add sharp

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system nextjs --uid 1001

COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# user should own this dir to be able to create cache dir for example
RUN chown -R nextjs:nodejs ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
