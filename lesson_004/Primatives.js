var Primatives = {};
Primatives.GridAxis = class {
	static createMesh(gl, laberinto){
		//Dynamiclly create a grid
		var x = laberinto.x;
		var y = laberinto.y;
		var matriz = laberinto.matriz;
		var verts = [],
			size = 1.8;			// W/H of the outer box of the grid, from origin we can only go 1 unit in each direction, so from left to right is 2 units max
			// div = 10.0,			// How to divide up the grid
			// step = size / div,	// Steps between each line, just a number we increment by for each line in the grid.
			// half = size / 2;	// From origin the starting position is half the size.

		var px1;	//Temp variable for position value.
		var px2;
		var px;
		var py;
		var py1;
		var py2;
		var stepX = size/ x;
		var half = size / 2
		var stepY = size/ y;

		// var tx = size / x;
		// const tx = (px) => ((px/x) * stepX )-0.9;  
		const tx = (px) => (px * stepX )-0.9;
		const ty = (py) => (py * stepY )-0.9;
		// var ty = size / y;
		// test dibujar de a celdas 
		var celda, celdaArriba, celdaAbajo, celdaIzq, celdaDer;
		// console.log(laberinto);
		for(var i=1; i<x-1; i++){
			
			for(var j=1; j<y-1; j++){
				celda = matriz[i][j];
				celdaArriba = matriz[i][j-1];
				celdaAbajo = matriz[i][j+1];
				celdaIzq = matriz[i-1][j];
				celdaDer = matriz[i+1][j];

				// caso tenemos que dibujar "paredes"
				if(celda.estado==="abierta"){
					// dibujamos las de arriba

					
					if(celdaArriba.estado==="cerrada"){
						console.log(celda);
						console.log(celdaArriba);
						// px1 = half - (tx * celdaArriba.x);
						px1 = tx(celdaArriba.x);
						px2 = tx(celdaArriba.x + 1);
						// px2 = half - (tx * (celdaArriba.x +1));
						// px = half - (i * stepX);
						// py = half - (j * stepY);
						// py = half - (ty * celdaArriba.y);
						py = ty(celdaArriba.y);
						// py2 = ty * (celda.y+1);
						verts.push(px1);	//x1
						verts.push(py);		//y1
						verts.push(0);		//z1
						verts.push(0);		//c1
 
						verts.push(px2);	//x2
						verts.push(py);		//y2
						verts.push(0);		//z2
						verts.push(0);		//c2
					}
					// // las de abajo
					// if(celdaAbajo.estado==="cerrada"){
					// 	px1 = half - (tx * celdaAbajo.x);
					// 	px2 = half - (tx * (celdaAbajo.x +1));
					// 	// px = half - (i * stepX);
					// 	// py = half - (j * stepY);
					// 	py = half - (ty * celdaAbajo.y);
					// 	// py2 = ty * (celda.y+1);
					// 	verts.push(px1);	//x1
					// 	verts.push(py);		//y1
					// 	verts.push(0);		//z1
					// 	verts.push(0);		//c1
 
					// 	verts.push(px2);	//x2
					// 	verts.push(py);		//y2
					// 	verts.push(0);		//z2
					// 	verts.push(0);		//c2
					// }
					// // las de izq
					// if(celdaIzq.estado==="cerrada"){
					// 	px = half - (tx * celdaIzq.x);
					// 	// px2 = half - (tx * (celdaAbajo.x +1));
					// 	// px = half - (i * stepX);
					// 	// py = half - (j * stepY);
					// 	py1 = half - (ty * celdaIzq.y);
					// 	py2 = half - (ty * celdaIzq.y +1);
					// 	// py2 = ty * (celda.y+1);
					// 	verts.push(px);	//x1
					// 	verts.push(py1);		//y1
					// 	verts.push(0);		//z1
					// 	verts.push(0);		//c1
 
					// 	verts.push(px);	//x2
					// 	verts.push(py2);		//y2
					// 	verts.push(0);		//z2
					// 	verts.push(0);		//c2
					// }
				}
			}
			
		}
		// verts.push(0);
		// verts.push(0);
		// verts.push(0);
		// verts.push(0);

		// verts.push(size/x);
		// verts.push(0);
		// verts.push(0);
		// verts.push(0);


		// lineas horizontales
		// funcando
		// var div = x;
		// var step = size/ x;
		// var half = size / 2;
		// for(var i=0; i <= div; i++){



		// 	//Horizontal line
		// 	p = half - (i * step);
		// 	verts.push(-half);	//x1
		// 	verts.push(p);		//y1
		// 	verts.push(0);		//z1
		// 	verts.push(0);		//c1

		// 	verts.push(half);	//x2
		// 	verts.push(p);		//y2
		// 	verts.push(0);		//z2
		// 	verts.push(1);		//c2
		// }

		// lineas verticales
		// div = y;
		// step = size/ y;
		// half = size / 2;
		// for(var i=0; i <= div; i++){
		// 	//Vertical line
		// 	p = -half + (i * step);
		// 	verts.push(p);		//x1
		// 	verts.push(half);	//y1
		// 	verts.push(0);		//z1
		// 	verts.push(0);		//c2

		// 	verts.push(p);		//x2
		// 	verts.push(-half);	//y2
		// 	verts.push(0);		//z2
		// 	verts.push(1);		//c2
		// }

		//TODO : Remove the following, its only to demo extra lines can be thrown in.
		// verts.push(-half);	//x1
		// verts.push(-half);	//y1
		// verts.push(0);		//z1
		// verts.push(2);		//c2

		// verts.push(half);	//x2
		// verts.push(half);	//y2
		// verts.push(0);		//z2
		// verts.push(2);		//c2

		// verts.push(-half);	//x1
		// verts.push(half);	//y1
		// verts.push(0);		//z1
		// verts.push(3);		//c2

		// verts.push(half);	//x2
		// verts.push(-half);	//y2
		// verts.push(0);		//z2
		// verts.push(3);		//c2


		//Setup
		var attrColorLoc = 4,
			strideLen,
			mesh = { drawMode:gl.LINES, vao:gl.createVertexArray() };

		//Do some math
		mesh.vertexComponentLen = 4;
		mesh.vertexCount = verts.length / mesh.vertexComponentLen;
		strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen; //Stride Length is the Vertex Size for the buffer in Bytes

		//Setup our Buffer
		mesh.bufVertices = gl.createBuffer();
		gl.bindVertexArray(mesh.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(ATTR_POSITION_LOC);
		gl.enableVertexAttribArray(attrColorLoc);
		
		gl.vertexAttribPointer(
			ATTR_POSITION_LOC						//Attribute Location
			,3										//How big is the vector by number count
			,gl.FLOAT 								//What type of number we passing in
			,false									//Does it need to be normalized?
			,strideLen								//How big is a vertex chunk of data.
			,0										//Offset by how much
		);

		gl.vertexAttribPointer(
			attrColorLoc							//new shader has "in float a_color" as the second attrib
			,1										//This atttrib is just a single float
			,gl.FLOAT
			,false
			,strideLen								//Each vertex chunk is 4 floats long
			,Float32Array.BYTES_PER_ELEMENT * 3		//skip first 3 floats in our vertex chunk, its like str.substr(3,1) in theory.
		);

		//Cleanup and Finalize
		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
		gl.mMeshCache["grid"] = mesh;
		return mesh;
	}
}