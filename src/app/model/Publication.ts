import { Model, DataTypes, type Sequelize } from "sequelize";

import appConfig from "../../config/app";

class Publication extends Model {
  public title!: string;
  public content!: string;
  public image!: string;
  public user_id!: number;

  static initModel(sequelize: Sequelize): void {
    this.init(
      {
        title: {
          type: DataTypes.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 50],
              msg: "Title must be between 3 and 50 characters",
            },
          },
        },
        content: {
          type: DataTypes.TEXT,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 500],
              msg: "Content must be between 3 and 500 characters",
            },
          },
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "users", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        image: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        url: {
          type: DataTypes.VIRTUAL,
          defaultValue: "",
          get() {
            if (this.image || this.image !== "") {
              return `${appConfig.url}:${
                appConfig.port
              }/images/publications/${this.getDataValue("image")}`;
            }
          },
        },
      },
      { sequelize }
    );
  }

  // associations
  static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: "user_id" });
  }
}

export default Publication;
