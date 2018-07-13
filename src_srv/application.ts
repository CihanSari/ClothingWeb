import { MyWebServer } from "./webserver";

export function main() {
  const lastArg = Number(process.argv[process.argv.length - 1]);
  if (isNaN(lastArg)) {
    new MyWebServer(80);
  } else {
    new MyWebServer(lastArg);
  }
}
