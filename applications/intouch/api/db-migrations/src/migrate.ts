import path from "path";
import { config } from "dotenv";
import DBMigrate from "db-migrate";

config();

const migrate = async (context) => {
  const { query } = context.req;
  const { password, database, host, user, port, ssl, folder } = context;
  const { ssl_client_cert, ssl_client_key, ssl_server_ca, ssl_host } = ssl;

  if (query.migrate !== "true") {
    return {
      database,
      host,
      user,
      port
    };
  }

  if (!query.direction) {
    return {
      host,
      message: "Please add direction"
    };
  }

  const dbmigrate = DBMigrate.getInstance(true, {
    throwUncatched: true,
    cmdOptions: {
      "migrations-dir": folder
    },
    config: {
      dev: {
        driver: "pg",
        database,
        password,
        user,
        host,
        port,
        schema: "public",
        ...(ssl_server_ca && {
          ssl: {
            rejectUnauthorized: !!ssl_server_ca,
            ca: ssl_server_ca,
            cert: ssl_client_cert,
            key: ssl_client_key,
            host: ssl_host
          }
        })
      }
    }
  });

  let migrations = parseInt(query.migrations);

  if (isNaN(migrations)) {
    migrations = 1;
  }

  if (query.direction === "up") {
    return await dbmigrate.up();
  } else {
    return await dbmigrate.down();
  }
};

export default migrate;
