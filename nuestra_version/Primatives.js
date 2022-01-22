var Primatives = {};

Primatives.Quad = class {
	static createModal(gl){ return new Modal(Primatives.Quad.createMesh(gl)); }
	static createMesh(gl){
		var aVert = [ -0.5,0.5,0, -0.5,-0.5,0, 0.5,-0.5,0, 0.5,0.5,0 ],
			aUV = [ 0,0, 0,1, 1,1, 1,0 ],
			aIndex = [ 0,1,2, 2,3,0 ];
		var mesh = gl.fCreateMeshVAO("Quad",aIndex,aVert,null,aUV);
		mesh.noCulling = true;
		mesh.doBlending = true;
		return mesh;
	}
}

Primatives.MultiQuad = class {
	static createModal(gl){ return new Modal(Primatives.MultiQuad.createMesh(gl)); }
	static createMesh(gl){
		var	aIndex = [ ], //0,1,2, 2,3,0
			aUV = [ ], //0,0, 0,1, 1,1, 1,0 
			aVert = [];		

		for(var i=0; i < 10; i++){
			//Calculate a random size, y rotation and position for the quad
			var size = 0.2 + (0.8* Math.random()),		//Random Quad Size in the range of 0.2 - 1.0
				half = size * 0.5,						//Half of size, this is the radius for rotation
				angle = Math.PI * 2 * Math.random(),	//Random angle between 0 - 360 degrees in radians
				dx = half * Math.cos(angle),			//Calc the x distance, used as an offset for the random position
				dy = half * Math.sin(angle),			//Calc the y distance, for same offset but used in z 
				x = -2.5 + (Math.random()*5),			//Random position between -2.5 - 2.5
				y = -2.5 + (Math.random()*5),			
				z = 2.5 - (Math.random()*5),
				p = i * 4;								//Index of the first vertex of a quad

			//Build the 4 points of the quad
			aVert.push(x-dx, y+half, z-dy);		//TOP LEFT
			aVert.push(x-dx, y-half, z-dy);		//BOTTOM LEFT
			aVert.push(x+dx, y-half, z+dy);		//BOTTOM RIGHT			
			aVert.push(x+dx, y+half, z+dy);		//TOP RIGHT

			aUV.push(0,0, 0,1, 1,1, 1,0);		//Quad's UV
			aIndex.push(p,p+1,p+2, p+2,p+3,p);	//Quad's Index
		}

		var mesh = gl.fCreateMeshVAO("MultiQuad",aIndex,aVert,null,aUV);
		mesh.noCulling = true;
		mesh.doBlending = true;
		return mesh;
	}
}

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