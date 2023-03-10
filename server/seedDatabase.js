import chalk from "chalk";
import keys from "./config/keys.s";
import Post from "./models/post.js";
import User from "./models/user.js";

import exec from "await-exec";


async function seedDatabase() {
  try {
    const users = await User.find({});
    const posts = await Post.find({});
    if (users.length === 0 && posts.length === 0) {
      console.log(
        chalk.yellow(
          "No users or posts in the database, creating sample data..."
        )
      );

      await exec(
        `mongoimport --collection=posts --db=snippets --file=./db/posts.json ${keys.database.url}`
      );
      await exec(
        `mongoimport --collection=users --db=snippets --file=./db/users.json ${keys.database.url}`
      );

      console.log(chalk.green(`Successfully populated database!!`));
    } else {
      console.log(
        chalk.yellow("Database already initiated, skipping populating script")
      );
    }
  } catch (error) {
    console.log(chalk.red(error));
  }
}

export default seedDatabase;
