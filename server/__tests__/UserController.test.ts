import UserController from "../src/controllers/UserController";
import { Pool } from "pg";
import "dotenv/config";

describe("User controller class", () => {
  const pool = new Pool({
    host: "127.0.0.1",
    port: 5432,
    database: "marketsim",
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
  });

  beforeAll(async () => {
    await pool.connect();
  });

  const userController = new UserController(pool);

  test("creates user", async () => {
    const user = {
      name: "name",
      email: "email",
      nickname: "nickname",
      picture: "picture",
      balance: 1000000,
    };
    expect((await userController.createUser("test1", user)).name).toBe("name");
    return;
  });

  test("gets user", async () => {
    const user = await userController.getUser("test");
    const user1 = await userController.getUser("undefined");
    expect(user?.email).toBe("email");
    expect(user1).toBeUndefined;
    return;
  });

  test("get holdings", async () => {
    expect(await userController.getHoldings("test")).toEqual([]);
    return;
  });
  return;
});
