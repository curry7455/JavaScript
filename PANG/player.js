class Player {
    constructor(name, pad) {
        this.name = name;
        this.score = 0;
        this.highScore = 0;
        this.pad = pad;
    }

    updateScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }
}
