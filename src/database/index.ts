import { Sequelize } from "sequelize";

import dbConfig from "../config/database";

// models

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mysql",
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// models arrays

export default sequelize;
