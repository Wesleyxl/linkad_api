import bcrypt from "bcryptjs";
import { Model, DataTypes, type Sequelize } from "sequelize";

import appConfig from "../../config/app";

class User extends Model {
  // attributes
  public name!: string;
  public email!: string;
  public image!: string;
  public password_hash!: string;
  public password!: string;
  public url!: string;
  public id!: number;

  static initModel(sequelize: Sequelize): void {
    this.init(
      {
        name: {
          type: DataTypes.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 50],
              msg: "Name must be between 3 and 50 characters",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          defaultValue: "",
          unique: true,
          validate: {
            isEmail: {
              msg: "Invalid email",
            },
          },
        },
        password_hash: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        password: {
          type: DataTypes.VIRTUAL,
          defaultValue: "",
          validate: {
            len: {
              args: [6, 50],
              msg: "Password must be between 6 and 50 characters",
            },
          },
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
              }/images/users/${this.getDataValue("image")}`;
            }
          },
        },
      },
      { sequelize }
    );

    // hash password
    this.addHook("beforeSave", async (user: User) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // validate password
  }

  async passwordIsValid(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password_hash);
  }
}

export default User;
