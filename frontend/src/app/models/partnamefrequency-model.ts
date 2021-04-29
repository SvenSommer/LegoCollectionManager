export class PartnameFrequencyModel {
    public wordposition: number;
    public word: string;
    public counter: number;

    constructor(data = null) {
        if (data) {
            this.wordposition = data.wordposition;
            this.word = data.word;
       //     this.nearwords = data.nearWords;
            this.counter = data.counter;
        }
    }
}

export class NearWords {
    [x: string]: any;
    public w: string;
    public c: number;
   
    constructor(w, c) {
        if (w && c) {
            this.w = w;
            this.c = c;
        }
    }
}

export class PartnameFrequencyCachingModel {
    public searchwords: string;
    public activeButtonsWords : string;
    public activeButtonsNumbers : string;
    
}