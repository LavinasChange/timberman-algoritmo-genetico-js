// TimberMan - Clone of http://www.digitalmelody.eu/games/Timberman

// Load Progress 
var loadProgress = 0, countSprites = 25;

// Level
var levelLoad = 0;
var levelMenu = 1;
var levelPlay = 2;
var levelGameOver = 3;
var level = levelLoad;

// Score
var levelscore = 1;
var score = 0, number = [];
var bestscore = 0;

// Trunk
var trunk = [], TrunkHeight = 243;

// Screen
openScreen("game", 0, 0, 1080, 1775);
initMouse();
initKeyboard();
resizeScreen(true);

// Load sprites
var background 		= loadSprite("assets/image/background.png", onReady);

// Intro
var clic 			= loadSprite("assets/image/clic.png", onReady);
var or				= loadSprite("assets/image/or.png", onReady);
var left 			= loadSprite("assets/image/left.png", onReady);
var right			= loadSprite("assets/image/right.png", onReady);

// Trunk
var stump      		= loadSprite("assets/image/stump.png", onReady);
var trunk1     		= loadSprite("assets/image/trunk1.png", onReady);
var branchleft 		= loadSprite("assets/image/branch1.png", onReady);
var branchright		= loadSprite("assets/image/branch2.png", onReady);

// Game Over
var rip				= loadSprite("assets/image/rip.png", onReady);
var gameover		= loadSprite("assets/image/gameover.png", onReady);
var play			= loadSprite("assets/image/play.png", onReady, restartGame);

// Timberman
var man 			= loadSprite("assets/image/man.png", onReady);

// Score
for(var n=0; n<10; n++) {
	number[n] 		= loadSprite("assets/image/numbers.png", onReady);
}

//cromossomos de controle do jogo
var jogador1 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var jogador2 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var jogador3 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};
var jogador4 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var jogador5 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

//cromossomos gerados por crossover dos objetos de controle
var crossover1 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var crossover2 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var crossover3 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var crossover4 = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

//cromossomo gerado por muta��o
var mutacao = {
	direita: 0,
	esquerda: 0,
	pontuacao: 0
};

var vetorJogadores = [jogador1,jogador2,jogador3,jogador4,jogador5,crossover1,crossover2,crossover3,crossover4, mutacao];

// Progress bar
var timecontainer	= loadSprite("assets/image/time-container.png", onReady);
var timebar			= loadSprite("assets/image/time-bar.png", onReady);	

// Load Sound
var theme			= loadSound("assets/sound/theme.mp3");
var cut 			= loadSound("assets/sound/cut.mp3");
var death 			= loadSound("assets/sound/death.mp3");
var menubar			= loadSound("assets/sound/menu.mp3");

function onReady() {
	loadProgress++
	
	if (loadProgress == countSprites) {
		
		// Changement du point d'ancrage du bucheron et ajout des animations
		anchorSprite(man, 0.5, 0.5);
		man.x = 263;
		
		addAnimation(man, "breath", [2,3], 527, 413, 350);
		addAnimation(man, "cut", [0,1,0], 527, 413, 15);
		
		// Creation de l'arbre
		trunk1.data = "trunk1";
		branchleft.data = "branchleft";
		branchright.data = "branchright";
		
		initTrunk();
		
		// Creation des image repr�sentant chaque chiffre 
		clipSprite(number[0], 5, 5, 66, 91); 		
		clipSprite(number[1], 81, 5, 50, 91); 		
		clipSprite(number[2], 141, 5, 66, 91); 		
		clipSprite(number[3], 217, 5, 66, 91); 		
		clipSprite(number[4], 293, 5, 66, 91); 		
		clipSprite(number[5], 369, 5, 66, 91); 		
		clipSprite(number[6], 445, 5, 66, 91); 		
		clipSprite(number[7], 521, 5, 66, 91); 		
		clipSprite(number[8], 597, 5, 66, 91); 		
		clipSprite(number[9], 673, 5, 66, 91); 		
		
		// Position niveau load
		level = levelLoad;
		
		// M�morisation du meilleurs scrore
		if (localStorage.bestscore) {
			bestscore = Number(localStorage.bestscore);
		}
		
		// Visualisation du jeu
		renderGame();
	}
}

function initTrunk() {
	trunk = [0, 0, 0, 0, 0, 0, 0]
	// Construction des branches
	// Il ne faut pas qu�une branche apparaisse sur le personnage directement apr�s avoir lanc� le jeu.
	// ==> il faut placer 2 troncs sans branches d�s le d�but
	trunk[0] = copySprite(trunk1);
	trunk[1] = copySprite(trunk1);
	addTrunk();
	
	score = 0;
	timescore = 254;
	levelscore = 1;
}

function addTrunk() {	
	for(var i = 1; i < 7; i++) {
		// Si pas de tron�on
		if (trunk[i] === 0) {
			// Il ne peut pas y avoir 2 branches � la suite.
			// => le troncon pr�c�dent doit etre un tronc
			if (trunk[i-1].data == "trunk1") {
				// 1 chance sur 4 de placer un tronc sans branche
				if(Math.random() * 4 <= 1) {			
					trunk[i] = copySprite(trunk1);
	
					// 3 chances sur 4 de placer une branche	
				} else {
					if (Math.random() * 2 < 1) {
						trunk[i] = copySprite(branchleft);
					} else {
						trunk[i] = copySprite(branchright);
					}
				}
			// Le troncon pr�c�dent n'est pas un tronc 
			// ==> On place un tronc
			} else {
				trunk[i] = copySprite(trunk1);	
			}
		}
	}
}

function restartGame() {
	playSound(menubar);
	initTrunk();
	level = levelMenu;
}

function gameOver() {
	level = levelGameOver;
	resumeSound(theme);
	playSound(death);

	if (score > bestscore) {
		bestscore = score;
		localStorage.bestscore = bestscore;
	}						
}

function renderGame() {
	var p=0, m=0;
	clearScreen("black")
	
	// Display Background
	displaySprite(background, 0, 0);
	
	// Display Trunk
	displaySprite(stump, 352, 1394);	
	for(var i = 0; i < 6; i++) {
		displaySprite(trunk[i], 37, stump.y - TrunkHeight * (i+2) + TrunkHeight);
	}
		
	// Display Timberman	
	if (level == levelPlay) {
		displaySprite(man, man.x, 1270);
	}
	
	// Display Level Load 
	if (level == levelLoad) {
		displaySprite(man, man.x, 1270);
		displaySprite(left, 250, 1020);
		displaySprite(or, 450, 1300);
		displaySprite(right, 580, 1020);
		displaySprite(clic, 300, 1500);
	}
	
	// Display Level Game Over
	if (level == levelGameOver) {
		//displaySprite(rip, man.x, 1240);
		//displaySprite(gameover, 110, -250);
		//displaySprite(play, 350, 900);
		
		/*for (var i=0; i < bestscore.toString().length; i++) {
			p = bestscore.toString().substring(i, i+1)
			m = screenWidth()/2 - 35 * bestscore.toString().length
			displaySprite(number[p], m + 67 * i, 480)
		}*/
	}

	// Display Progress Bar
	if (level == levelPlay) {
		if (timescore > 0) {
			timescore -= levelscore/10;
		} else {
			gameOver();
			level = levelGameOver;
		}
		displaySprite(timecontainer, 255, 100);
		displaySprite(timebar, 285, 130, timescore);
	}
	
	// Display Score
	for (var i=0; i<score.toString().length; i++) {
		p = score.toString().substring(i, i+1)
		m = screenWidth()/2 - 35 * score.toString().length
		displaySprite(number[p], m + 67 * i, 700)
	}
	
	// Animation status
	if (animationActive(man, "cut") === false) {
		playAnimation(man, "breath"); 
	} else {
		playAnimation(man, "cut")	
	}
	
	// Evenements clavier et souris 
	/*if (keyboardReleased(KEY_LEFT) && level != levelGameOver) {
		man.data = "left";
		man.x = 263;
		flipSprite(man, 1, 1);
		man.action = true;		
	}*/

	/*if (keyboardReleased(KEY_RIGHT) && level != levelGameOver) {
		man.data = "right";
		man.x = 800;
		flipSprite(man, -1, 1);
		man.action = true;
		sleep(2000);
	}*/

	/*if (keyboardReleased(KEY_ENTER) && level == levelGameOver) {
		restartGame();
		level =levelLoad;
	}*/
	 
	//acao();

};

function direita(){
	man.data = "right";
	man.x = 800;
	flipSprite(man, -1, 1);
	man.action = true;
	//acao();
	
}


function esquerda(){
	man.data = "left";
	man.x = 263;
	flipSprite(man, 1, 1);
	man.action = true;
	//acao();	
}


function jogar(jogador){
		var boolean_controle = Math.random() >= 0.5;
    	setInterval(function(){
		//var random_boolean = Math.random() >= 0.5;
		if(boolean_controle == true && verificaProximoTronco(jogador.direita)=="branchright"){
			boolean_controle = false
			//direita();
			//console.log(verificaProximoTronco());
		}else{
			if(boolean_controle == false && verificaProximoTronco(jogador.esquerda)=="branchleft"){
				boolean_controle = true;
			}
		}
		if(boolean_controle == true)
			direita();
		else
			esquerda();
		
		acao(jogador);
	}, 500)
	
	//setTimeout(function(){esquerda()}, 2000)
}

function acao(jogador){
	if (man.action == true) {
		if (level == levelLoad) {
			playSound(theme, true);
			level = levelPlay;
		}

		// Joue le son "cut"
		playAnimation(man, "cut")		
		playSound(cut);
				
		// Est ce une branche qui pourrait heurter le bucheron
		if (man.data == "left" && trunk[0].data == "branchleft" || man.data == "right" && trunk[0].data == "branchright") {
			//gameOver();
			restartGame();
			level =levelLoad;
		} 
				
		// Mise � jour du scrore 
		score++;
		if (score % 20 == 0 ) {
			levelscore ++;
		}
				
		if (timescore < 508) {
			timescore += 10;
		}
			
		// Chaque tron�on de l'arbre descend d'un niveau
		for(var i = 0; i < 6; i++) {
			trunk[i] = trunk[i+1];	
		}	
				
		// Suppression du tron�on le plus haut
		trunk[6] = 0;
				
		// Ajout d'un nouveau tron�on
		addTrunk();										
				
		// Une fois le tronc coup�, on v�rifie si le tronc qui retombe n'est pas une branche qui pourrait heurter le bucheron
		if (man.data == "left" && trunk[0].data == "branchleft" || man.data == "right" && trunk[0].data == "branchright") {
			//gameOver();
			jogador.pontuacao = score;
			restartGame();
			level =levelLoad;
		} 	
		man.action = false;
	}
	requestAnimationFrame(renderGame);
}

function verificaProximoTronco(){
	return trunk[1].data;
}

//preenche os cromossomos iniciais
function preencheJogadores(){
	//var vetorJogadores = {jogador1,jogador2,jogador3,jogador4,jogador5,crossover1,crossover2,crossover3,crossover4, mutacao}
	var jogador;
	var i;
	for(i=0; i<5; i++){
		jogador=vetorJogadores[i];
		jogador['direita'] = gerarAleatorio(4,1);//Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		jogador['esquerda'] = gerarAleatorio(4,1);//Math.floor(Math.random() * (4 - 1 + 1)) + 1;
	}
}

function iniciar(){
	preencheJogadores();
	crossover();
	mutacao();
	/*var i = 0;
	for(i; i < 9; i++){
		jogar(vetor[i]);
	}
	ordenarPorPontuacao();*/
}

//fun��o de crossover dos cromossomos de controle do jogo
function crossover(){
	var i = 5;
	for(i; i < 9; i++){
		if(Math.random() >= 0.5){
			vetorJogadores[i]['direita'] = vetorJogadores[i-5]['direita'];
			vetorJogadores[i]['esquerda'] = vetorJogadores[i-4]['esquerda'];
		}else{
			vetorJogadores[i]['direita'] = modelo2[i-4]['direita'];
			vetorJogadores[i]['esquerda'] = modelo1[i-5]['esquerda'];
		}
	}
}

//fun��o que usa muta��o para criar cromossomo novo
function mutacao(){
	var cromossomoBase = gerarAleatorio(9,0);//Math.floor(Math.random() * (9 - 0 + 1)) + 0;
	if(Math.random() >= 0.5){
		mutacao.direita = vetorJogadores[cromossomoBase].direita;
		mutacao.esquerda = gerarAleatorio(4,1);
	}else{
		mutacao.direita = gerarAleatorio(4,1);
		mutacao.esquerda = vetorJogadores[cromossomoBase].direita;
	}
}

function gerarAleatorio(max, min){
	return Math.floor(Math.random() * (max -min + 1)) + min;
}

//Ordena os cromossomos por pontua��o para ver o Fitness
function ordenarPorPontuacao(){
	vetorJogadores.sort(function(a,b){
		return a.pontuacao - b.pontuacao;
	});
}