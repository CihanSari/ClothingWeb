import { MyWebServer } from "./webserver";

export function main() {
  const lastArg = Number(process.argv[process.argv.length - 1]);
  if (isNaN(lastArg)) {
    const PORT = Number(process.env.PORT) || 80;
    new MyWebServer(PORT);
  } else {
    new MyWebServer(lastArg);
  }
}
