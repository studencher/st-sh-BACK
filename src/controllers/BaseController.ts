import { NextFunction, Request, Response } from 'express';
import {Logger} from "../studentcher-shared-utils/helpers/Logger";

export abstract  class BaseController {
    constructor(protected logger: Logger) {
    }
    get = async (_req: Request, _res: Response, _next: NextFunction) :Promise<void> => {

    }

    add = async (_req: Request, _res: Response, _next: NextFunction) :Promise<void> => {

    }

    edit = async (_req: Request, _res: Response, _next: NextFunction) :Promise<void> => {

    }

    delete  = async (_req: Request, _res: Response, _next: NextFunction) :Promise<void> => {

    }


}

