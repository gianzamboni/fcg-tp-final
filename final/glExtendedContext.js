
const ATTR_POSITION_NAME	= "a_position";
const ATTR_POSITION_LOC		= 0;
const ATTR_NORMAL_NAME		= "a_norm";
const ATTR_NORMAL_LOC		= 1;
const ATTR_UV_NAME			= "a_uv";
const ATTR_UV_LOC			= 2;


class glExtendedContext {
    constructor(canvasId) {
        let canvas = document.getElementById(canvasId);
        this.context = canvas.getContext("webgl2");

        if(!this.context) { throw Error("WebGL context is not available.") }
		this.meshCache = [];

        this.context.clearColor(1.0,1.0,1.0,1.0);
    }

    clear() {
       this.context.clear( this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT ); 
       return this;
    }

	createArrayBuffer(floatAry,isStatic) {
		if(isStatic === undefined) isStatic = true; //So we can call this function without setting isStatic

		var buf = this.context.createBuffer();
		this.context.bindBuffer(this.context.ARRAY_BUFFER, buf);
		this.context.bufferData(this.context.ARRAY_BUFFER, floatAry, (isStatic)? this.context.STATIC_DRAW : this.context.DYNAMIC_DRAW );
		this.context.bindBuffer(this.ARRAY_BUFFER,null);
		return buf;
	}

	createMeshVAO(name,aryInd,aryVert,aryNorm,aryUV) {
		var rtn = { drawMode:this.context.TRIANGLES };

		//Create and bind vao
		rtn.vao = this.context.createVertexArray();															
		this.context.bindVertexArray(rtn.vao);	//Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

		//.......................................................
		//Set up vertices
		if(aryVert !== undefined && aryVert != null){
			rtn.bufVertices = this.context.createBuffer();													//Create buffer...
			rtn.vertexComponentLen = 3;																//How many floats make up a vertex
			rtn.vertexCount = aryVert.length / rtn.vertexComponentLen;								//How many vertices in the array

			this.context.bindBuffer(this.context.ARRAY_BUFFER, rtn.bufVertices);
			this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(aryVert), this.context.STATIC_DRAW);		//then push array into it.
			this.context.enableVertexAttribArray(ATTR_POSITION_LOC);										//Enable Attribute location
			this.context.vertexAttribPointer(ATTR_POSITION_LOC,3,this.context.FLOAT,false,0,0);						//Put buffer at location of the vao
		}

		//.......................................................
		//Setup normals
		if(aryNorm !== undefined && aryNorm != null){
			rtn.bufNormals = this.context.createBuffer();
			this.context.bindBuffer(this.context.ARRAY_BUFFER, rtn.bufNormals);
			this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(aryNorm), this.context.STATIC_DRAW);
			this.context.enableVertexAttribArray(ATTR_NORMAL_LOC);
			this.context.vertexAttribPointer(ATTR_NORMAL_LOC,3,this.context.FLOAT,false, 0,0);
		}

		//.......................................................
		//Setup UV
		if(aryUV !== undefined && aryUV != null){
			rtn.bufUV = this.context.createBuffer();
			this.context.bindBuffer(this.context.ARRAY_BUFFER, rtn.bufUV);
			this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(aryUV), this.context.STATIC_DRAW);
			this.context.enableVertexAttribArray(ATTR_UV_LOC);
			this.context.vertexAttribPointer(ATTR_UV_LOC,2,this.context.FLOAT,false,0,0);	//UV only has two floats per component
		}

		//.......................................................
		//Setup Index.
		if(aryInd !== undefined && aryInd != null){
			rtn.bufIndex = this.context.createBuffer();
			rtn.indexCount = aryInd.length;
			this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
			this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), this.context.STATIC_DRAW);
			this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER,null);
		}

		//Clean up
		this.context.bindVertexArray(null);					//Unbind the VAO, very Important. always unbind when your done using one.
		this.context.bindBuffer(this.ARRAY_BUFFER,null);	//Unbind any buffers that might be set

		this.meshCache[name] = rtn;
		return rtn;
	}

    createProgram(vShader,fShader, doValidate){
		//Link shaders together
		var prog = this.context.createProgram();
		this.context.attachShader(prog,vShader);
		this.context.attachShader(prog,fShader);
		this.context.linkProgram(prog);

		//Check if successful
		if(!this.context.getProgramParameter(prog, this.context.LINK_STATUS)){
			this.context.deleteProgram(prog);
            throw Error("Error creating shader program.",this.context.getProgramInfoLog(prog));
		}

		//Only do this for additional debugging.
		if(doValidate){
			this.context.validateProgram(prog);
			if(!this.context.getProgramParameter(prog, this.context.VALIDATE_STATUS)){
				this.context.deleteProgram(prog);
                throw Error("Error validating program", this.context.getProgramInfoLog(prog));
			}
		}
		
		//Can delete the shaders since the program has been made.
		this.context.detachShader(prog,vShader); //TODO, detaching might cause issues on some browsers, Might only need to delete.
		this.context.detachShader(prog,fShader);
		this.context.deleteShader(fShader);
		this.context.deleteShader(vShader);

		return prog;
	}

    createShader(src, type) {
        let shader = this.context.createShader(type);
        this.context.shaderSource(shader, src);
        this.context.compileShader(shader);

        if(!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            throw Error("Error compiling shader : " + src, this.context.getShaderInfoLog(shader));
		}
		return shader;
    }

    setSize(width, height) {
        this.context.canvas.style.width = width + "px";
		this.context.canvas.style.height = height + "px";
		this.context.canvas.width = width;
		this.context.canvas.height = height;

		//when updating the canvas size, must reset the viewport of the canvas 
		//else the resolution webgl renders at will not change
		this.context.viewport(0, 0, width, height);
		return this;
    }
}