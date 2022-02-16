function duom(){
    var a = parseInt(document.getElementById("maze-height").value);
    var b = parseInt(document.getElementById("maze-width").value);
    [laberintoCreado, coord_x_entrada, coord_y_entrada] = mazePrim(a,b);
    updateCanvas(laberintoCreado);
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

    let coord_x_entrada, coord_y_entrada; 

    // un lado del laberinto aleatorio para la entrada 
    let ladoEntrada = getRandomArbitrary(0,4); // 0 = izq, 1= arriba, 2=derecha, 3=abajo
    let ladoSalida = getRandomArbitrary(0,4);
    // entrada y salida de lados distintos
    while(ladoEntrada===ladoSalida){
        ladoSalida = getRandomArbitrary(0,4);
    }

    // izquierda laberinto
    if (ladoEntrada === 0 || ladoSalida === 0){
        // busco entrada posible en pared izquierda
            while(true){
                let i = getRandomArbitrary(1,y-1);
                if(laberinto.matriz[1][i].estado==="abierta"){
                    laberinto.matriz[0][i].estado="abierta";
                    if(ladoEntrada === 0){
                        // console.log()
                        coord_x_entrada = 0;
                        coord_y_entrada = i;
                    }
                    break;
                }
            }  
        }

    // derecha laberinto
    if (ladoEntrada === 2 || ladoSalida === 2){
        // busco entrada posible en pared derecha
            while(true){
                let i = getRandomArbitrary(1,x-1);
                if(laberinto.matriz[y-2][i].estado==="abierta"){
                    laberinto.matriz[y-1][i].estado="abierta";
                    if(ladoEntrada === 2){
                        coord_x_entrada = y-1;
                        coord_y_entrada = i;
                    }
                    break;
                }
            }  
        }

    // arriba laberinto
    if (ladoEntrada === 1 || ladoSalida === 1){
    // busco entrada posible en primer fila
        while(true){
            let i = getRandomArbitrary(1,x-1);
            if(laberinto.matriz[i][1].estado==="abierta"){
                laberinto.matriz[i][0].estado="abierta";
                if(ladoEntrada === 1){
                    coord_x_entrada = i;
                    coord_y_entrada = 0;
                }
                break;
            }
        }  
    }

    // abajo laberinto
    if (ladoEntrada === 3 || ladoSalida === 3){
        // busco entrada posible en ultima fila
            while(true){
                let i = getRandomArbitrary(1,x-1);
                if(laberinto.matriz[i][y-2].estado==="abierta"){
                    laberinto.matriz[i][y-1].estado="abierta";
                    if(ladoEntrada === 3){
                        coord_x_entrada = i;
                        coord_y_entrada = y-1;
                    }
                    break;
                }
            }  
    }

    return [coord_x_entrada, coord_y_entrada];
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

    let [entrada_x, entrada_y] = agregarEntradaYSalida(laberinto);
    
    return [laberinto, entrada_x, entrada_y];
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
