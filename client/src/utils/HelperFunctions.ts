import * as process from "process";

export function consoleLog(args:any):void{
    if (process.env.NODE_ENV !== 'PRODUCTION'){
        return console.log(args);
    }
}