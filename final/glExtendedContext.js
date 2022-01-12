class glExtendedContext {
    constructor(canvasId) {
        let canvas = document.getElementById(canvasId);
        this.context = canvas.getContext("webgl2");

        if(!this.context) { throw Error("WebGL context is not available.") }
        this.context.clearColor(1.0,1.0,1.0,1.0);
    }

    clear() {
       this.context.clear( this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT ); 
       return this;
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