"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theApp = require("./app");
const port = 8080; // default port to listen
// start the Express server
theApp.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map