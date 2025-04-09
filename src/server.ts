import { error } from "console";
import app from "./app";
import config from "./app/config";
import mongoose from "mongoose"

async function main() {
    await mongoose.connect(config.db_url as string)

    app.listen(config.port, () => {
    console.log(`Server is listening on ${config.port}`);
  });
}

main().then(() => console.log("Mongodb is connected successfully")).catch(error => console.log(error));


