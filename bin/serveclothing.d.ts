import { RequestHandler } from "express";
export interface handlerInterface {
    path?: string;
    handler: RequestHandler;
}
export declare function serveClothing(clothingPath: string): handlerInterface[];
