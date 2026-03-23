import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import chalk from "chalk";
import launchPage from "./src/config/launchPage.js"

// loading environment variables
dotenv.config({
    path: "./.env"
});

app.get("/", (req, res) => {
    res.send(launchPage('CollegeFinder'));
});
app.get("/api/v1/health-check", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly." });
    console.log(chalk.bgMagenta(`[ ${new Date().toLocaleString()} ] Status: Server is healthy.`));
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(chalk.yellowBright(`Server is live! 🚀`));
            console.log(chalk.magentaBright(`🌐 Server is running on port:`));
            console.log(chalk.cyanBright(`http://localhost:${process.env.PORT || 8000}`));
            console.log(chalk.gray(`-----------------------------------------`));
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection failed: ", error);
    });