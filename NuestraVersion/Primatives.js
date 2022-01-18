var Primatives = {};
Primatives.GridAxis = class {
	static createModal(gl,laberinto){ return new Modal(Primatives.GridAxis.createMesh(gl,laberinto)); }
	static createMesh(gl, laberinto){
		//Dynamiclly create a grid
		var x = laberinto.x;
		var y = laberinto.y;
		var matriz = laberinto.matriz;
		var verts = [];
		var	size = 1.8;	// tamaño arbitrario a usar del canvas

		var stepX = size/ x;
		var stepY = size/ y;
		const tx = (px) => (px * stepX )-0.9; // transformaciones
		const ty = (py) => (-py * stepY )+0.9;
		// test dibujar de a celdas 
		var celda;

		let addVertex = (x,y,z,c) => {
			verts.push(x);
			verts.push(y);
			verts.push(z);
			verts.push(c);
		}

		let drawSquare = (celda) => {
			var i = celda.x;
			var j = celda.y;
			if(celda.estado === "cerrada"){
				// linea arriba
				if(j===0 || matriz[i][j-1].estado !== "cerrada"){
					addVertex(tx(i),  0, ty(j),0);
					addVertex(tx(i+1),  0, ty(j),0); 
				}
				
				// linea derecha
				if(i===x-1 || matriz[i+1][j].estado !== "cerrada"){
					addVertex(tx(i+1),  0, ty(j),0); 
					addVertex(tx(i+1),  0, ty(j+1),0);
				}

				// linea abajo
				if(j===y-1 || matriz[i][j+1].estado !== "cerrada"){
					addVertex(tx(i+1),  0, ty(j+1),0);
					addVertex(tx(i),  0, ty(j+1),0);
				}
				
				// linea izq
				if(i===0 || matriz[i-1][j].estado !== "cerrada"){
					addVertex(tx(i),  0, ty(j+1),0);
					addVertex(tx(i),  0, ty(j),0);
				}
				
			}
		}

		for(let i = 0; i < x; i++) {
			for(let j=0; j < y; j++) {
				celda = matriz[i][j];
				drawSquare(celda);
			}
		}

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