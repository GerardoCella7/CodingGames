const Game = class{
    constructor(){
        this.grid = [];
        this.pion = {
            player: 'O',
            bot: 'X',
            empty: '.'
        };
    }

    setGrid(data){
        this.grid.push(...data);
    }

    getMove(){
        let playMove = null;
        ['123','456','789','147','258','369','159','357'].forEach(e => {
            let nbPlayerPion = 0;
            let positionEmpty = null;
            e.split('').forEach(i => {
                nbPlayerPion += this.grid[i-1] === this.pion.player ? 1 : 0;
                positionEmpty = this.grid[i-1] === this.pion.empty ? i-1 : positionEmpty;
            });
            if(nbPlayerPion === 2 && positionEmpty != null){
                // win
                const move = [...this.grid];
                move[positionEmpty] = this.pion.player;
                const nextMoveStr = [];
                for(let i = 0; i < 3; i++){
                    const str = move[i*3] + move[i*3+1] + move[i*3+2];
                    nextMoveStr.push(str);
                }
                playMove = nextMoveStr.join('\n');
            }
        });
        return playMove === null ? 'false' : playMove;
    }
}

const game = new Game();

for (let i = 0; i < 3; i++) {
    game.setGrid(readline().split(''));
}

console.log(game.getMove());
