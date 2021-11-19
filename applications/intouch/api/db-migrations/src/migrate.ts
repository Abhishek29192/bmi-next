import { config } from "dotenv";
import DBMigrate from "db-migrate";

config();

const migrate = async (context) => {
  let result;
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
      "migrations-dir": folder,
      verbose: true
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

  try {
    if (query.direction === "up") {
      // result = await dbmigrate.up();
    } else {
      // result = await dbmigrate.down();
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(
      `Error running migration scripts ${query.direction}`,
      error.message
    );
    throw error;
  }

  return result;
};

export default migrate;
