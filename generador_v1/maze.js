function duom(){

    var a = parseInt(document.getElementById("height").value);
    var b = parseInt(document.getElementById("width").value);

    // document.getElementById('out').innerHTML = display(maze(a,b));
    document.getElementById('out').innerHTML = display(mazePrim(a,b));
}

// function maze(x,y) {
//     var n=x*y-1;
//     if (n<0) {alert("illegal maze dimensions");return;}
//     var horiz=[]; for (var j= 0; j<x+1; j++) horiz[j]= [];
//     var verti=[]; for (var j= 0; j<y+1; j++) verti[j]= [];
//     var here= [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
//     var path= [here];
//     var unvisited= [];
//     for (var j= 0; j<x+2; j++) {
//         unvisited[j]= [];
//         for (var k= 0; k<y+1; k++)
//             unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
//     }
//     while (0<n) {
//         var potential= [[here[0]+1, here[1]], [here[0],here[1]+1],
//             [here[0]-1, here[1]], [here[0],here[1]-1]];
//         var neighbors= [];
//         for (var j= 0; j < 4; j++)
//             if (unvisited[potential[j][0]+1][potential[j][1]+1])
//                 neighbors.push(potential[j]);
//         if (neighbors.length) {
//             n= n-1;
//             next= neighbors[Math.floor(Math.random()*neighbors.length)];
//             unvisited[next[0]+1][next[1]+1]= false;
//             if (next[0] == here[0])
//                 horiz[next[0]][(next[1]+here[1]-1)/2]= true;
//             else 
//                 verti[(next[0]+here[0]-1)/2][next[1]]= true;
//             path.push(here= next);
//         } else 
//             here= path.pop();
//     }
//     var result = ({x: x, y: y, horiz: horiz, verti: verti});
//     console.log(result);
//     return result;
// }


// las celdas están cerradas o abiertas
class Celda {
    constructor(estado, x, y){
        this.x = x;
        this.y = y;
        this.estado = estado;
    }
}

// el laberinto tiene celdas cerradas y abiertas
class Laberinto {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.matriz = 
        [...Array(x)].map(() => [...Array(y)]);

        // this.horiz=[];
        // for (var j= 0; j<x+1; j++) this.horiz[j]= new Celda("cerrada");
        
        // this.verti=[];
        // for (var j= 0; j<y+1; j++) this.verti[j]= new Celda("cerrada");

        // this.horiz =
        // this.matriz = [[]];

        for (var ancho=0; ancho < x; ancho++) {
            for (var alto=0; alto < y; alto++) {
                this.matriz[ancho][alto] = new Celda("cerrada", ancho, alto);
            }
        }
    }
}

function noTieneEsquinasAbiertas(celda, laberinto){
    var x = laberinto.x;
    var y = laberinto.y;
    // esquina izq arriba
    if(celda.x-1>=0 && celda.y-1>=0 && laberinto.matriz[celda.x-1][celda.y-1].estado === "abierta") return false;
    // esquina izq abajo
    if(celda.x-1>=0 && celda.y+1<y && laberinto.matriz[celda.x-1][celda.y+1].estado === "abierta") return false;
    // esquina der arriba
    if(celda.x+1<x && celda.y-1>=0 && laberinto.matriz[celda.x+1][celda.y-1].estado === "abierta") return false;
    // esquina der abajo
    if(celda.x+1<x && celda.y+1<y && laberinto.matriz[celda.x+1][celda.y+1].estado === "abierta") return false;
    return true;
}

function conseguirFronteras(celda,laberinto){
    var x = laberinto.x;
    var y = laberinto.y;
    var fronteras = [];
    
    // chequeo frontera izquierda
    // var fronteraIzq = ;
    if(celda.x-2 >= 0 && laberinto.matriz[celda.x-2][celda.y].estado === "cerrada" && noTieneEsquinasAbiertas(laberinto.matriz[celda.x-2][celda.y], laberinto)){
        fronteras.push(laberinto.matriz[celda.x-2][celda.y]);
    }
    // chequeo frontera derecha
    // var fronteraDerecha = laberinto.matriz[celda.x+2][celda.y];
    if(celda.x+2 < x && laberinto.matriz[celda.x+2][celda.y].estado === "cerrada" && noTieneEsquinasAbiertas(laberinto.matriz[celda.x+2][celda.y], laberinto)){
        fronteras.push(laberinto.matriz[celda.x+2][celda.y]);
    }
    // chequeo frontera arriba
    // var fronteraArriba = laberinto.matriz[celda.x][celda.y-2];
    if(celda.y-2 >= 0 && laberinto.matriz[celda.x][celda.y-2].estado === "cerrada" && noTieneEsquinasAbiertas(laberinto.matriz[celda.x][celda.y-2], laberinto) ){
        fronteras.push(laberinto.matriz[celda.x][celda.y-2]);
    }
    // chequeo frontera abajo
    // var fronteraAbajo = laberinto.matriz[celda.x][celda.y+2];
    if(celda.y+2 < y && laberinto.matriz[celda.x][celda.y+2].estado === "cerrada" && noTieneEsquinasAbiertas(laberinto.matriz[celda.x][celda.y+2], laberinto)){
        fronteras.push(laberinto.matriz[celda.x][celda.y+2]);
    }

    return fronteras;
}

function vecinosAlcanzables(celda, laberinto){
    var x = laberinto.x;
    var y = laberinto.y;
    var vecinos = []; 
    // chequeo frontera izquierda
    if(celda.x-2 >= 0 && laberinto.matriz[celda.x-2][celda.y].estado === "abierta" ){
        vecinos.push(laberinto.matriz[celda.x-2][celda.y]);
    }
    // chequeo frontera derecha
    if(celda.x+2 < x && laberinto.matriz[celda.x+2][celda.y].estado === "abierta" ){
        vecinos.push(laberinto.matriz[celda.x+2][celda.y]);
    }
    // chequeo frontera arriba
    if(celda.y-2 >= 0 && laberinto.matriz[celda.x][celda.y-2].estado === "abierta" ){
        vecinos.push(laberinto.matriz[celda.x][celda.y-2]);
    }
    // chequeo frontera abajo
    if(celda.y+2 < y && laberinto.matriz[celda.x][celda.y+2].estado === "abierta" ){
        vecinos.push(laberinto.matriz[celda.x][celda.y+2]);
    }
    return vecinos;
}

function dameIntermedia(celda1, celda2, laberinto){
    // c1 es vecina horizontal
    if(celda1.y === celda2.y){
        // c1 es vecina a izquierda
        if(celda1.x < celda2.x) return laberinto.matriz[celda1.x+1][celda1.y];
        // c1 es vecina a derecha
        if(celda1.x > celda2.x) return laberinto.matriz[celda1.x-1][celda1.y];
    }
    // c2 es vecina vertical
    if(celda1.x === celda2.x){
        // c1 es vecina hacia arriba
        if(celda1.y < celda2.y) return laberinto.matriz[celda1.x][celda1.y+1];
        // c2 es vecina hacia abajo
        if(celda1.y > celda2.y) return laberinto.matriz[celda1.x][celda1.y-1];
    }
    throw "pasó algo raro"
}

// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }  

function mazePrim(x,y) {
    // creamos el laberinto de x ancho, y altura
    var laberinto = new Laberinto(x,y);
    var xInicial = getRandomArbitrary(1,x-1);
    var yInicial = getRandomArbitrary(1,y-1);

    var celdaInicial = laberinto.matriz[xInicial][yInicial];
    console.log(celdaInicial);

    // console.log(celdaInicial);
    celdaInicial.estado = "abierta";
    var listaFronteras = conseguirFronteras(celdaInicial,laberinto);

    // var i = 10;
    while(listaFronteras.length!==0){
        let randomIndex = getRandomArbitrary(0,listaFronteras.length)
        let celdaFrontera = listaFronteras[randomIndex];
        // celdaFrontera.estado = "abierta";
        //lo saca
        listaFronteras.splice(randomIndex,1);
        var alcanzables = vecinosAlcanzables(celdaFrontera, laberinto);
        // console.log(alcanzables);
        // let celdaNueva = alcanzables.pop();
        let randomIndexAlcanzables = getRandomArbitrary(0,alcanzables.length);
        let celdaNueva = alcanzables[randomIndexAlcanzables];

        let celdaIntermedia = dameIntermedia(celdaFrontera, celdaNueva, laberinto);
        celdaIntermedia.estado = "abierta";
        console.log(celdaIntermedia);
        let nuevasFronteras = conseguirFronteras(celdaIntermedia, laberinto);
        listaFronteras = [...listaFronteras, ...nuevasFronteras];
        // i--;
        // listaFronteras = [...nuevasFronteras];
    }

    // console.log(xInicial, yInicial);
    // console.log(listaFronteras);
    // console.log()

    // var listaParedes= [];
    // seleccionamos un nodo aleatorio del borde
    // var inicial = laberinto.matriz[Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
    // console.log(inicial);
    // listaParedes.push(inicial.paredes);
    
    return laberinto;
}

function display(m) {

    // console.log(m);

    var texto = "";
    
    for (var alto=0; alto < m.y; alto++) {
        for (var ancho=0; ancho < m.x; ancho++){
            if ((m.matriz[ancho][alto]).estado === "cerrada"){
                texto = texto.concat(" X");
                // console.log(alto, ancho, m.matriz[ancho][alto].estado);
            } else {
                texto = texto.concat(" O");
            }
        }
        texto = texto.concat('\r\n');
    }



    // for (var j= 0; j<m.x; j++) {
    //     var line= [];
    //     if (0 == j%2)
    //         for (var k=0; k<m.y*4+1; k++)
    //             if (0 == k%4) 
    //                 line[k]= 'x';
    //             else
    //                 if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
    //                     line[k]= ' ';
    //                 else
    //                     line[k]= 'x';
    //     else
    //         for (var k=0; k<m.y*4+1; k++)
    //             if (0 == k%4)
    //                 if (k>0 && m.horiz[(j-1)/2][k/4-1])
    //                     line[k]= ' ';
    //                 else
    //                     line[k]= 'x';
    //             else
    //                 line[k]= ' ';
    //     if (0 == j) line[1]=line[3]=' ',line[2]= '1';
    //     if (m.x*2-1 == j) line[4*m.y]= '2';
    //     text.push(line.join('')+'\r\n');
    // }
    // console.log(texto);
    return texto;
}
