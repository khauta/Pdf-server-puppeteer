declare module 'express-healthcheck' {
    import { RequestHandler } from 'express';
    interface Options {
        healthy?: () => any;
        test?: () => any;
    }
    function healthcheck(options?: Options): RequestHandler;
    export = healthcheck;
}
