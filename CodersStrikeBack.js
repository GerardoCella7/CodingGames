class CheckPoints{
    static #list = [];
    static #completed = false;
    constructor(info){
        this.x = parseInt(info[2]); // x position of the next check point
        this.y = parseInt(info[3]); // y position of the next check point
        this.dist = parseInt(info[4]); // distance to the next checkpoint
        this.angle = parseInt(info[5]); // angle between your pod orientation and the direction of the next checkpoint
    }

    static addIntoList(ck){
        if(this.#completed) return;

        const indexCK = this.getIndex(ck);
        if(indexCK < 0)
            this.#list.push(ck);
        else if(indexCK===0 && this.#list.length > 1)
            this.#completed = true;
    }

    static getIndex(ck){
        return this.#list.findIndex(e => e.x === ck.x && e.y === ck.y);
    }

    static get(index){
        const len = this.#list.length;
        return index < 0 || index > len-1 ? null : this.#list[index];
    }

    getDistanceMax(){
        return this.dist;
    }
}

class Info {
    static #list = [];
    constructor(info){
        this.x = parseInt(info[0]);
        this.y = parseInt(info[1]);
        this.ck = new CheckPoints(info);
        CheckPoints.addIntoList(this.ck);
    }

    setOpponentInfo(info){
        this.opponentX = parseInt(info[0]);
        this.opponentY = parseInt(info[1]);
    }

    static addIntoList(info){
        this.#list.push(info);
    }
}

class Engine{
    constructor(){
        this.powerMax = 100;
        this.powerMin = 20;
        this.power = 100;
        this.boost = {inUse: false, used: false};
        this.shield = false;
        this.brakeProgress = false;
        this.accelerationProgress = true;
    }

    brake(force, multiple = false){
        if(force < 0 || (this.brakeProgress && !multiple)) return;
        this.power -= force;
        if(this.power < this.powerMin) this.power = this.powerMin;
        this.brakeProgress = true;
        this.accelerationProgress = false;
    }

    accelerate(force, multiple = false){
        if(force < 0 || (this.accelerationProgress && !multiple)) return;
        this.power += force;
        if(this.power > this.powerMax) this.power = this.powerMax;
        this.brakeProgress = false;
        this.accelerationProgress = true;
    }

    stop(){
        this.power = this.powerMin;
        this.brakeProgress = true;
        this.accelerationProgress = false;
    }

    useShield(){
        this.shield = true;
    }

    resetShield(){
        this.shield = false;
    }

    useBoost(){
        if(this.boost.used) return;
        this.boost.inUse = true;
        this.boost.used = true;
    }

    endBoost(){
        if(!this.boost.used) return;
        this.boost.inUse = false
    }

    pilot(ck){
        const indexCP = CheckPoints.getIndex(ck);
        console.error(indexCP);
        if( indexCP < 0) return;

        const initialCK = CheckPoints.get(indexCP);
        const distNextCKMax = initialCK.getDistanceMax();
        const distNextCK = ck.dist;

        console.error(distNextCK, distNextCKMax, this);

        if(distNextCK < distNextCKMax / 1.6 && distNextCK < 4444){
            this.brake(parseInt(distNextCK * .003), true);
        } else {
            this.accelerate(parseInt(distNextCK * .001), true);
        }

        if(ck.angle > 90 || ck.angle < -90)
            this.stop();
    }
}

class Game{
    constructor(){
        this.info = null;
        this.engine = new Engine();
    }

    setMyInfo(info){
        this.info = new Info(info);
    }

    setOpponentInfo(info){
        this.info.setOpponentInfo(info);
        Info.addIntoList(this.info);
    }

    getAction(){
        this.engine.pilot(this.info.ck);
        return `${this.info.ck.x} ${this.info.ck.y} ${this.engine.power}`;
    }
}

const game = new Game();

// game loop
while (true) {
    game.setMyInfo(readline().split(' '));
    game.setOpponentInfo(readline().split(' '));
    //console.error(game);
    console.log(game.getAction());
}
