export class GlobalVariable {
    public static apiCounter: number = 0;
    public static incrementCount = 0;
    public static totalCount = 0;
    public static cookie: any;
    public static userId = 1;
}

export const snooze = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));