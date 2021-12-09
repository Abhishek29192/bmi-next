import { config } from "dotenv";
import DBMigrate from "db-migrate";

config();

const migrate = async (context) => {
  const { query } = context.req;
  const { password, database, host, user, schema, port, ssl, folder } = context;
  const { ssl_client_cert, ssl_client_key, ssl_server_ca, ssl_host } = ssl;

  // eslint-disable-next-line
  console.log(
    `Running migration against: ${host} on db: ${database} with port: ${port}`
  );

  if (ssl_server_ca) {
    // eslint-disable-next-line
    console.log(`Using ssl: ${!!ssl} with ssl host: ${ssl_host}`);
  }

  // eslint-disable-next-line
  console.log(`Migration folder: ${folder}`);

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
    cmdOptions: {
      "migrations-dir": folder
    },
    config: {
      dev: {
        // we have one service per env, so here we can use whatever we want
        driver: "pg",
        database,
        password,
        schema,
        user,
        host,
        port,
        ssl: {
          rejectUnauthorized: true,
          ca: ssl_server_ca,
          key: ssl_client_key,
          cert: ssl_client_cert,
          host: ssl_host
        }
      }
    }
  });

  let migrations = parseInt(query.migrations);

  if (isNaN(migrations)) {
    migrations = 1;
  }

  try {
    if (query.direction === "up") {
      await dbmigrate.up();
    } else {
      await dbmigrate.down();
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log(
      `Error running migration scripts ${query.direction}`,
      error.message
    );
    throw error;
  }

  return {
    status: "migration completed"
  };
};

export default migrate;
