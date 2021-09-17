function duom(){

    var a = parseInt(document.getElementById("height").value);
    var b = parseInt(document.getElementById("width").value);

    document.getElementById('out').innerHTML = display(mazePrim(a,b));
}

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

        for (var ancho=0; ancho < x; ancho++) {
            for (var alto=0; alto < y; alto++) {
                this.matriz[ancho][alto] = new Celda("cerrada", ancho, alto);
            }
        }
    }
}

function conseguirFronteras(celda,laberinto, condicion){
    var x = laberinto.x;
    var y = laberinto.y;
    var fronteras = [];
    
    // chequeo frontera izquierda
    if(celda.x-1 > 0 && laberinto.matriz[celda.x-1][celda.y].estado === condicion ){
        fronteras.push(laberinto.matriz[celda.x-1][celda.y]);
    }
    // chequeo frontera derecha
    if(celda.x+1 < x-1 && laberinto.matriz[celda.x+1][celda.y].estado === condicion ){
        fronteras.push(laberinto.matriz[celda.x+1][celda.y]);
    }
    // chequeo frontera arriba
    if(celda.y-1 > 0 && laberinto.matriz[celda.x][celda.y-1].estado === condicion ){
        fronteras.push(laberinto.matriz[celda.x][celda.y-1]);
    }
    // chequeo frontera abajo
    if(celda.y+1 < y-1 && laberinto.matriz[celda.x][celda.y+1].estado === condicion ){
        fronteras.push(laberinto.matriz[celda.x][celda.y+1]);
    }

    return fronteras;
}

// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function agregarEntradaYSalida(laberinto){
    let x = laberinto.x;
    let y = laberinto.y;
    
    // busco entrada posible desde izquierda a derecha en primer fila
    for(var i=1; i<x-2;i++){
        if(laberinto.matriz[i][1].estado=="abierta"){
            laberinto.matriz[i][0].estado="abierta";
            break;
        }
    }

    // busco salida posible desde abajo hacia arriba en ultima columna
    for(var i=y-2; i>0;i--){
        if(laberinto.matriz[x-2][i].estado=="abierta"){
            laberinto.matriz[x-1][i].estado="abierta";
            break;
        }
    }
}

function mazePrim(x,y) {
    // creamos el laberinto de x ancho, y altura
    var laberinto = new Laberinto(x,y);
    var xInicial = getRandomArbitrary(1,x-1);
    var yInicial = getRandomArbitrary(1,y-1);

    // arrancamos en una celda random y la abrimos
    var celdaInicial = laberinto.matriz[xInicial][yInicial];
    celdaInicial.estado = "abierta";
    // celdas limitrofes cerradas
    let listaFronteras = conseguirFronteras(celdaInicial,laberinto, "cerrada");
    while(listaFronteras.length!==0){
        let randomIndex = getRandomArbitrary(0,listaFronteras.length);
        let celdaFrontera = listaFronteras[randomIndex];
        // elegimos una frontera random y la sacamos
        listaFronteras.splice(randomIndex,1);
        var alcanzables = conseguirFronteras(celdaFrontera, laberinto, "abierta");
        // solo conectamos si no forma un loop
        if(alcanzables.length === 1){
            celdaFrontera.estado = "abierta";
            let nuevasFronteras = conseguirFronteras(celdaFrontera, laberinto, "cerrada");
            listaFronteras = [...listaFronteras, ...nuevasFronteras];
        }
    }

    agregarEntradaYSalida(laberinto);
    
    return laberinto;
}

function display(m) {

    var texto = "";
    
    for (var alto=0; alto < m.y; alto++) {
        for (var ancho=0; ancho < m.x; ancho++){
            if ((m.matriz[ancho][alto]).estado === "cerrada"){
                texto = texto.concat(" X");
            } else {
                texto = texto.concat(" O");
            }
        }
        texto = texto.concat('\r\n');
    }
    return texto;
}
