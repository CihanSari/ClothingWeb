/// <reference types="express" />
import * as express from "express";
import { RequestHandler } from "express";
export interface handlerInterface {
    path?: string;
    handler: RequestHandler;
}
export declare function serveClothing(clothingPath: string, dataPath: string): express.Router;
