import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Marketplace API is started on port ${PORT}`);
});
