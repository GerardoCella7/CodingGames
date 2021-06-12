class CheckPoints{
    constructor(){
        this.checkPoints = [];
        this.complete = false;
        this.turn = 1;
        this.indexMaxDistance = null;
        this.lastCheckPoint = null;
    }

    setCheckPoint(x, y){
        const indexCP = this.checkPoints.findIndex(e => e.x === x && e.y === y);
        if(indexCP < 0)
            this.checkPoints.push({x: x, y: y});
        else
            this.lastCheckPoint = indexCP;

        this.complete = this.checkPoints.length > 1 && indexCP === 0;

        if(this.complete){
            this.turn++;
            this.findCheckPointMaxLongDistance();
        }
    }

    setNextTurn(x, y){
        const indexCP = this.checkPoints.findIndex(e => e.x === x && e.y === y);
        if(indexCP === 0 && this.lastCheckPoint != 0)
            this.turn++;
        
        this.lastCheckPoint = indexCP;
    }

    findCheckPointMaxLongDistance(){
        const lst = [];
        for(let i=0; i<this.checkPoints.length; i++){
            const ckA = this.checkPoints[i];
            const ckB = this.checkPoints[i+1 >= this.checkPoints.length ? 0 : i+1];
            lst[i] = Math.abs(Math.sqrt(Math.pow(ckB.x - ckA.x) + Math.pow(ckB.y - ckA.y)));
        }

        this.indexMaxDistance = lst.findIndex(e => e == Math.max(...lst));
    }

    isNextMaxDistance(x, y){
        const indexCP = this.checkPoints.findIndex(e => e.x === x && e.y === y);
        return indexCP === this.indexMaxDistance;
    }
}

class Game{
    constructor(){
        this.checkPoints = new CheckPoints();
        this.boost = {alreadyUse: false, inProgress: false};
        this.lastTurn = 3;
        this.proximity = false;
        this.previousCheckpointDist = Infinity;
        this.previousSpeed = 100;
    }

    setMyInfo(info){
        this.x = parseInt(info[0]);
        this.y = parseInt(info[1]);
        this.nextCheckpointX = parseInt(info[2]); // x position of the next check point
        this.nextCheckpointY = parseInt(info[3]); // y position of the next check point
        this.nextCheckpointDist = parseInt(info[4]); // distance to the next checkpoint
        this.nextCheckpointAngle = parseInt(info[5]); // angle between your pod orientation and the direction of the next checkpoint

        if(!this.checkPoints.complete)
            this.checkPoints.setCheckPoint(this.nextCheckpointX, this.nextCheckpointY);
        else
            this.checkPoints.setNextTurn(this.nextCheckpointX, this.nextCheckpointY);
    }

    setOpponentInfo(info){
        this.opponentX = parseInt(info[0]);
        this.opponentY = parseInt(info[1]);
    }

    getAction(){
        let x = this.nextCheckpointX;
        let y = this.nextCheckpointY;
        let thrust = this.getThrust();

        // You have to output the target position
        // followed by the power (0 <= thrust <= 100)
        // i.e.: "x y thrust"
        console.error(thrust);
        return `${x} ${y} ${thrust}`;
    }

    getThrust(){
        let t = (this.nextCheckpointAngle > 90 || this.nextCheckpointAngle < -90) ? 0 : 100;

        if(!this.boost.alreadyUse && this.lastTurn === this.checkPoints.turn && this.checkPoints.isNextMaxDistance(this.nextCheckpointX, this.nextCheckpointY)){
            if(this.boost.inProgress && t===100)
                t = 'BOOST';
            else if(this.boost.inProgress && t===0){
                this.boost.inProgress = false;
                this.boost.alreadyUse = true;
            } else {
                this.boost.inProgress = true;
                t = 'BOOST';
            }
        } else if(this.boost.inProgress){
            this.boost.inProgress = false;
            this.boost.alreadyUse = true;
        }

        if(this.nextCheckpointDist < 3250 ){
            t = this.proximate();
        }

        
        return t;
    }

    proximate(){
        let t = this.previousCheckpointDist > this.nextCheckpointDist ? 50 : 100;
        this.previousCheckpointDist = this.nextCheckpointDist;

        if(this.proximity){
            t =60;
            return t;
        } else {
            this.proximity = true;
            return t;
        }
    }
}

const game = new Game();

// game loop
while (true) {
    game.setMyInfo(readline().split(' '));
    game.setOpponentInfo(readline().split(' '));
    // console.error(game);
    console.log(game.getAction());
}
