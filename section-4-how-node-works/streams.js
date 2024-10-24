const fs = require("node:fs");
const server = require("node:http").createServer();

server.on("request", (req, res) => {
  // Solution 1: Simple, leads to problems, don't use for production...
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  // Solution 2: Streams
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on("end", () => {
  //   res.end;
  // });
  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("File not found.");
  // });
  // Solution 3: Final
  const readable = fs.createReadStream("test-file.txt");
  // readableSource.pipe(writeableDest)
  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
