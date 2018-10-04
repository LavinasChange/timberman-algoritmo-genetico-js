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

var vetorJogadores = [];

var vetorTroncos   = [];
var contadorTroncos=2;

var numeroJogadoresIniciais 	= 50;
var numeroJogadoresCrossover 	= numeroJogadoresIniciais -1;
var porcentagemMutacao			= 15;
var tamanhoCromossomos			= 100;
var maiorResultado				= 0;

// Progress bar
var timecontainer	= loadSprite("assets/image/time-container.png", onReady);
var timebar			= loadSprite("assets/image/time-bar.png", onReady);	

// Load Sound
//var theme			= loadSound("assets/sound/theme.mp3");
var cut 			= loadSound("assets/sound/cut.mp3");
var death 			= loadSound("assets/sound/death.mp3");
var menubar			= loadSound("assets/sound/menu.mp3");

var swapped;
var morreu = false;
var temp;

function onReady() {
	loadProgress++
	if (loadProgress == countSprites) {
		
		preencheTroncos();
		console.log(vetorTroncos);
		
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

/* function addTrunk() {	
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
 */
function addTrunk() {	
	
	for(var i = 1; i < 7; i++) {
		if(trunk[i] === 0){
			//3 chances em 5 de vir tronco sem galho
			if (vetorTroncos[contadorTroncos] < 3) {
				trunk[i] = copySprite(trunk1);
			}else{
				//Se for 3 coloca o tronco da esquerda
				if (vetorTroncos[contadorTroncos]  == 3) {
					trunk[i] = copySprite(branchleft);
				//Se impar, coloca o tronco da direita
				}else{
					trunk[i] = copySprite(branchright);			
				}
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
	//resumeSound(theme);
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
	if (keyboardReleased(KEY_LEFT) && level != levelGameOver) {
		man.data = "left";
		man.x = 263;
		flipSprite(man, 1, 1);
		man.action = true;		
	}

	if (keyboardReleased(KEY_RIGHT) && level != levelGameOver) {
		man.data = "right";
		man.x = 800;
		flipSprite(man, -1, 1);
		man.action = true;
		//sleep(2000);
	}

	if (keyboardReleased(KEY_ENTER) && level == levelGameOver) {
		restartGame();
		level =levelLoad;
	}
	 
	//acao();

};

//Funcao que simula movimento para a direita
function direita(){
	//console.log('executou direita');
	man.data = "right";
	man.x = 800;
	flipSprite(man, -1, 1);
	man.action = true;
	//acao();
	
}

//Funcao que simula movimento para a esquerda
function esquerda(){
	//console.log('executou esquerda');
	man.data = "left";
	man.x = 263;
	flipSprite(man, 1, 1);
	man.action = true;
	//acao();	
}


//Funcao para simular cada jogada
async function jogar(jogador){
	//return new Promise(resolve => function(){
		console.log('jogador '+ jogador.identificador);
		var boolean_controle = Math.random() >= 0.5;
		var i = 0;

		//intervalo = setInterval(function(){
		level=levelPlay;
			
		while(level != levelLoad && i < tamanhoCromossomos){
			if(jogador['movimentos'][i]){
				esquerda();
			}	
			else{
				direita();
			}
			i++;
			acao(jogador);
			await sleep(250);
			contadorTroncos++;
		}
		
		//},500);
	//});
	//}, 500);
}


//Funcao executada a cada jogada para fazer validacoes
function acao(jogador){
	if (man.action == true) {
		if (level == levelLoad) {
			//playSound(theme, true);
			level = levelPlay;
		}

		// Joue le son "cut"
		playAnimation(man, "cut")		
		playSound(cut);
				
		// Est ce une branche qui pourrait heurter le bucheron
		if (man.data == "left" && trunk[0].data == "branchleft" || man.data == "right" && trunk[0].data == "branchright") {
			//gameOver();
			jogador.pontuacao = score;
			console.log('Pontuacao: ' + jogador.pontuacao);
			console.log('-----//-------');
			contadorTroncos = 2;
			if(score > maiorResultado) maiorResultado = score;
			restartGame();
			level =levelLoad;
			morreu=true;
			//continue;
			//clearInterval(intervalo);
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
			console.log('Pontuacao: ' + jogador.pontuacao);
			console.log('-----//-------');
			contadorTroncos = 2;
			if(score > maiorResultado) maiorResultado = score;
			restartGame();
			level =levelLoad;
			morreu=true;
			//continue;
			//clearInterval(intervalo);
			//level=levelGameOver;
		} 	
		man.action = false;
	}
	requestAnimationFrame(renderGame);
}


//Fun��o a ser chamada para iniciar o algoritmo
async function iniciar(){
	preencheJogadores();
	//console.log(vetorTroncos);
	crossover();
	if(Math.random <= porcentagemMutacao/100){
		fazerMutacao();
	}
	
	var i = 0;
	
	//faz o algoritmo rodar por tempo indeterminado
	while(true){
		console.log('GERACAO NUMERO ' + ++i);
		level=levelPlay;
		for(const item of vetorJogadores){
			await jogar(item);
			//console.log('pontuacao: ' + item.pontuacao);
		}
		await(ordenarPorPontuacao());
		await(crossover());
		if(Math.random <= (porcentagemMutacao/100)){
			await(fazerMutacao());
		}
		console.log('------------------------');
		console.log('************************');
		console.log('Maior pontuacao: ' + maiorResultado);
		console.log('************************');
		console.log('------------------------');
		await(renomearJogadores());
	}					
}

//Funcao que preenche o vetor que dita quais troncos ser�o colocados no cen�rio
function preencheTroncos(){
	vetorTroncos[0] = 0;
	vetorTroncos[1] = 0;
	var i;
	for(i=2;i<tamanhoCromossomos;i=i+2){
		vetorTroncos[i] = Math.round(Math.random() * 4);
		while(vetorTroncos[i] == vetorTroncos[i-1] && vetorTroncos[i] >= 3){
			vetorTroncos[i] = Math.round(Math.random() * 4);
		}
		vetorTroncos[i+1] = 2;
	}
}

//preenche os cromossomos iniciais
function preencheJogadores(){
	//var vetorJogadores = {jogador1,jogador2,jogador3,jogador4,jogador5,crossover1,crossover2,crossover3,crossover4, mutacao}
	var jogador;
	var vetorMovimentos = [];
	var i,j;
	for(i=0; i< numeroJogadoresIniciais; i++){
		for(j=0; j < tamanhoCromossomos; j++){
			vetorMovimentos.push(Math.random() <= 0.5);
		}
		jogador = new Object();
		jogador.identificador	= 	i+1;
		jogador.movimentos      = 	vetorMovimentos;
		jogador.pontuacao 		= 	0;
		
		vetorJogadores.push(jogador);
		vetorMovimentos  = [];
	}
	for(i = numeroJogadoresIniciais; i < numeroJogadoresIniciais + numeroJogadoresCrossover; i++){
		jogador = new Object();
		jogador.identificador 	= 	i+1;
		jogador.movimentos		=  [];
		jogador.pontuacao 		= 	0;
		
		vetorJogadores.push(jogador); 
		vetorMovimentos = [];
	}
}



//fun��o de crossover dos cromossomos de controle do jogo
async function crossover(){
	var i = numeroJogadoresIniciais;
	for(i; i < numeroJogadoresIniciais + numeroJogadoresCrossover; i++){
		if(Math.random() >= 0.5){
			vetorJogadores[i]['movimentos'] = vetorJogadores[i-numeroJogadoresCrossover]['movimentos'].slice(0,tamanhoCromossomos/2); 
			vetorJogadores[i]['movimentos'] = vetorJogadores[i]['movimentos'].concat(vetorJogadores[i-(numeroJogadoresCrossover-1)] ['movimentos'].slice((tamanhoCromossomos/2) -1, tamanhoCromossomos));
		}else{
			vetorJogadores[i]['movimentos'] = vetorJogadores[i-(numeroJogadoresCrossover-1)]['movimentos'].slice(0,tamanhoCromossomos/2); 
			vetorJogadores[i]['movimentos'] = vetorJogadores[i]['movimentos'].concat(vetorJogadores[i-numeroJogadoresCrossover] ['movimentos'].slice((tamanhoCromossomos/2) -1, tamanhoCromossomos));
		}
	}
}

//fun��o que usa muta��o para alterar um cromossomo
async function fazerMutacao(){
	var cromossomoBase = gerarAleatorio(numeroJogadoresCrossover+numeroJogadoresIniciais-1,0);//Math.floor(Math.random() * (9 - 0 + 1)) + 0;
	vetorJogadores[Math.floor(Math.random() * tamanhoCromossomos)]['movimentos'] = inverteValor(vetorJogadores[Math.floor(Math.random() * tamanhoCromossomos)]['movimentos']);
}

//Funcao para gerar n�mero aleatorio
function gerarAleatorio(max, min){
	return Math.floor(Math.random() * (max -min + 1)) + min;
}

//Ordena os cromossomos por pontua��o para ver o Fitness
async function ordenarPorPontuacao(){
	var i=0;
	console.log('Antes da ordenacao:');
	for(i;i < vetorJogadores.length;	i++){
		console.log('Pontuacao do jogador ' + vetorJogadores[i].identificador + ': ' + vetorJogadores[i].pontuacao);
	}
    vetorJogadores.sort(function(a, b){
			return b.pontuacao - a.pontuacao;
		}
	);
	console.log('-------------------------------------------')
	i=0;
	console.log('Depois da ordenacao');
	for(i;i < vetorJogadores.length;	i++){
		console.log('Pontuacao do jogador ' + vetorJogadores[i].identificador + ': ' + vetorJogadores[i].pontuacao);
	}
}

//Funcao que determina a velocidade que o personagem ir� se mover
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Muda o numero de identificacao de cada jogador para que fique em sequencia 
async function renomearJogadores(){
	var i =0;
	for(i =0; i < vetorJogadores.length; i++){
		vetorJogadores[i].identificador =(i+1);
	}
}

//Inverte um valor(Mutacao)
function inverteValor(valorBinario){
	return !valorBinario;
}

