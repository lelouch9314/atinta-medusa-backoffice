import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    databaseDriverOptions:
      process.env.NODE_ENV !== "development"
        ? {
            connection: {
              ssl: { rejectUnauthorized: false },
            },
            client: "pg",
            debug: false,
          }
        : {
            connection: {
              ssl: false,
            },
            client: "pg",
            debug: false,
          },
  },
  admin: {
    vite: (config) => {
      return {
        server: {
          host: "0.0.0.0",
          // Allow all hosts when running in Docker (development mode)
          // In production, this should be more restrictive
          allowedHosts: ["localhost", ".localhost", "127.0.0.1"],
          hmr: {
            // HMR websocket port inside container
            port: 5173,
            // Port browser connects to (exposed in docker-compose.yml)
            clientPort: 5173,
          },
        },
      };
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/design",
    },
    {
      resolve: "./src/modules/customization",
    },
    {
      resolve: "./src/modules/reviews",
    },
    {
      resolve: "./src/modules/professional-design",
    },
    {
      resolve: "./src/modules/storefront-cms",
    },
    {
      resolve: "@medusajs/medusa/translation",
    },
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // specific options if needed
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.WE_REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.WE_REDIS_URL,
        // suggested additional options for production use
        jobOptions: {
          removeOnComplete: {
            // keep jobs for 1 hour or up to 1000 jobs
            age: 3600,
            count: 1000,
          },
          removeOnFail: {
            // keep jobs for 1 hour or up to 1000 jobs
            age: 3600,
            count: 1000,
          },
        },
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              name: "Local Notification Provider",
              channels: ["email"],
            },
          },
        ],
      },
    },
  ],
  featureFlags: {
    translation: true,
  },
  plugins: [
    {
      resolve: "@agilo/medusa-analytics-plugin",
      options: {},
    },
  ],
});
