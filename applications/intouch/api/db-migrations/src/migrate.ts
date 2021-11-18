import { config } from "dotenv";
import DBMigrate from "db-migrate";

config();

const migrate = async (context) => {
  const { query } = context.req;
  const { password, database, host, user, port, ssl } = context;
  const { ssl_client_cert, ssl_client_key, ssl_server_ca } = ssl;

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
            sslrootcert: ssl_server_ca,
            sslcert: ssl_client_cert,
            sslkey: ssl_client_key,
            sslmode: { ENV: "ssl_mode" }
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
