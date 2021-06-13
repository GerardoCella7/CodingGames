/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const Jeu = class{
    constructor(){
        this.plateau = [];
        this.coup = [];
    }

    setPlateau(ligne, data){
        this.plateau[ligne] = [...data];
        this.coup[ligne] = [...data];
    }

    getCoup(){
        this.getProchainCoup();

        for (let i = 0; i < 3; i++) {
            this.coup[i] = this.coup[i].join('');
            this.plateau[i] = this.plateau[i].join('');
        }
        const sortie = this.coup.join('\n');

        return sortie != this.plateau.join('\n') ? sortie : 'false';
    }

    getProchainCoup(){
        for (let i = 0; i < this.coup.length; i++) {
            for (let j = 0; j < this.coup[i].length; j++) {
                const tmp = [[...this.coup[0]], [...this.coup[1]], [...this.coup[2]]];
                if(this.coup[i][j] == '.'){
                    tmp[i][j] = 'O';
                    if(this.coupGagnant(i, j, tmp)){
                        this.coup[i][j] = 'O';
                        return;
                    }
                }
            }
        }
    }

    coupGagnant(i, j, tmp = null){
        function horizontal(){
            const l = tmp[i];
            return l.join('') == 'OOO';
        }
        function vertical(){
            const l = [tmp[0][j], tmp[1][j], tmp[2][j]];
            return l.join('') == 'OOO';
        }
        function diagonal(){
            const l1 = [tmp[0][0], tmp[1][1], tmp[2][2]];
            const l2 = [tmp[0][2], tmp[1][1], tmp[2][0]];
            return l1.join('') == 'OOO' || l2.join('') == 'OOO';
        }

        return horizontal() || vertical() || diagonal();
    }
}
const jeu = new Jeu();


for (let i = 0; i < 3; i++) {
    jeu.setPlateau(i, readline().split(''));
}

// Write an answer using console.log()
// To debug: console.error('Debug messages...');

console.log(jeu.getCoup());
