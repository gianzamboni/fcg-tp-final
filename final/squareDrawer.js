class SquareDrawer {

    constructor(glManager) {
        let vShader = glManager.createShader(vertexShader,glManager.context.VERTEX_SHADER);
        let fShader = glManager.createShader(fragmentShader,glManager.context.FRAGMENT_SHADER);
        let shaderProg = glManager.createProgram(vShader, fShader, true);

        glManager.context.useProgram(shaderProg);

        this.positionLoc = glManager.context.getAttribLocation(shaderProg,"a_position");
        this.uPointSizeLoc	= glManager.context.getUniformLocation(shaderProg,"uPointSize");
        // gl.useProgram(null);

        this.vertexArray = new Float32Array([0,0,0, 0.5,0.5,0.5, -0.9,0.2,-0.9]);
        this.vertexBuffer = glManager.context.createBuffer();

        glManager.context.bindBuffer(glManager.context.ARRAY_BUFFER, this.vertexBuffer);
        glManager.context.bufferData(glManager.context.ARRAY_BUFFER, this.vertexArray, glManager.context.STATIC_DRAW);
        glManager.context.bindBuffer(glManager.context.ARRAY_BUFFER, null);

        // glManager.context.useProgram(shaderProg);				//Activate the Shader
        glManager.context.uniform1f(this.uPointSizeLoc,50.0);		//Store data to the shader's uniform variable uPointSize

        // //how its down without VAOs
        glManager.context.bindBuffer(glManager.context.ARRAY_BUFFER, this.vertexBuffer);					//Tell glManager.context which buffer we want to use at the moment
        glManager.context.enableVertexAttribArray(this.aPositionLoc);					//Enable the position attribute in the shader
        glManager.context.vertexAttribPointer(this.aPositionLoc,3,glManager.context.FLOAT,false,0,0);	//Set which buffer the attribute will pull its data from
        glManager.context.bindBuffer(glManager.context.ARRAY_BUFFER,null);						//Done setting up the buffer
        
        glManager.context.drawArrays(glManager.context.POINTS, 0, 3);			
        gl.useProgram(null);
    }

}