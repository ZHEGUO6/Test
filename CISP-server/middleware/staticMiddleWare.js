const fs = require("fs");
const path = require("path");
module.exports = async function (req, res, next) {
  if (req.path.startsWith("/static")) {
    const reg = /(.jpg|.png|.jpeg|.gif|.webp)$/;
    if (req.path.match(reg)) {
      const resource = await fs.promises.readFile(
        path.resolve(__dirname, `../public${req.path.slice(7)}`)
      );
      res.send(resource);
    } else {
      const resource = await fs.promises.readFile(
        path.resolve(__dirname, `../public${req.path.slice(7)}`),
        "utf8"
      );
      res.send(resource);
    }
  } else {
    next();
  }
};
