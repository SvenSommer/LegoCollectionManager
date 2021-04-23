export class PartnameFrequencyModel {
    public wordposition: number;
    public word: string;
    public nearwords: Array<NearWords>;
    public counter: number;
    public overallcounter: number;

    constructor(data = null) {
        if (data) {
            this.wordposition = data.wordposition;
            this.word = data.word;
            this.nearwords = data.nearWords;
            this.counter = data.counter;
            this.overallcounter = data.overallcounter;
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

export class PartnameFrequencyModelExport {
    public wordposition: number;
    public word: string;
    public nearwords: string;
    public counter: number;
    public overallcounter: number;

    constructor(data = null) {
        if (data) {
            this.wordposition = data.wordposition;
            this.word = data.word;
            this.nearwords = data.nearWords;
            this.counter = data.counter;
            this.overallcounter = data.overallcounter;
        }
    }
}