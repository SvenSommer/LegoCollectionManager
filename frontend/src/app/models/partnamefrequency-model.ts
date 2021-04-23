export class PartnameFrequencyModel {
    public wordposition: number;
    public word: string;
    public counter: number;
    public overallcounter: number;

    constructor(data = null) {
        if (data) {
            this.wordposition = data.wordposition;
            this.word = data.word;
            this.counter = data.counter;
            this.overallcounter = data.overallcounter;
        }
    }
}