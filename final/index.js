var glManager;
window.addEventListener("load",function(){
    //............................................				
    //Get our extended GL Context Object
    glManager = new glExtendedContext("glcanvas").setSize(500,500).clear();
    squareDrawer = new SquareDrawer(glManager);

    // // 4. Get Location of Uniforms and Attributes.
    // gl.useProgram(shaderProg);
    // var aPositionLoc	= gl.getAttribLocation(shaderProg,"a_position"),
    //     uPointSizeLoc	= gl.getUniformLocation(shaderProg,"uPointSize");
    // gl.useProgram(null);

    // //............................................
    // //Set Up Data Buffers
    // var aryVerts = new Float32Array([0,0,0, 0.5,0.5,0 ]),
    //     bufVerts = gl.createBuffer();

    // gl.bindBuffer(gl.ARRAY_BUFFER,bufVerts);
    // gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ARRAY_BUFFER,null);

    // //............................................
    // //Set Up For Drawing
    // gl.useProgram(shaderProg);				//Activate the Shader
    // gl.uniform1f(uPointSizeLoc,50.0);		//Store data to the shader's uniform variable uPointSize

    // //how its down without VAOs
    // gl.bindBuffer(gl.ARRAY_BUFFER,bufVerts);					//Tell gl which buffer we want to use at the moment
    // gl.enableVertexAttribArray(aPositionLoc);					//Enable the position attribute in the shader
    // gl.vertexAttribPointer(aPositionLoc,3,gl.FLOAT,false,0,0);	//Set which buffer the attribute will pull its data from
    // gl.bindBuffer(gl.ARRAY_BUFFER,null);						//Done setting up the buffer
    
    // this.gl.drawArrays(gl.POINTS, 0, 2);						//Draw the points
});
