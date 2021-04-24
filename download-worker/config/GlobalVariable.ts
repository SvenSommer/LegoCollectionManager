export class GlobalVariable {
    public static apiCounter: number = 0;
    public static incrementCount = 0;
    public static totalCount = 0;
    public static cookie: any;
    public static userId = 1;
    public static setDownloadLimit = 1;
    public static subSetDownloadLimit = 5;
    public static currentSetData: any;
}

export const snooze = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));