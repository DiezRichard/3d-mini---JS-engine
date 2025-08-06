let viewMatrix=null;

let vpMatrix =null;
 
 let screenView = toScreenSpace();

//~~~~~~~~~~~~~~~~~~~~~~~~~

 for(let mesh of meshes){
  
precalcularNormal(mesh);
  
  if(!isDynamicLight){
   
  //bake shadows
  isStepShading?stepShading(mesh,lightDir):flatShading(mesh,lightDir);
 }//dynamic light
 }//meshes loop

//~~~~~~~~~~~~~~~~~~~~~~~~~

let tick=0;

//~~~~~~~~~~~~~~~~~~~~~~~~~

function main() {
 
alltris.length=0;

let skipNames = [
...animate(sword1Animation)
]



//rotateMesh(tree1, { x: 0, y: 1, z: 0 }, 0.015);


rotateAnimation(sword1Animation, { x: 0, y: 1, z: 0 }, 0.005);

//~~~~~~~~~~~~~~~~~~~~~~~~~
 
let now = performance.now();
frameCount++;

if (now - fpsTimer >= 500) {
fps = Math.round((frameCount * 1000) / (now - fpsTimer));
fpsTimer = now;
frameCount = 0;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

if (!meshes.lastSortTime){ meshes.lastSortTime = 0;
sortMeshesByDistance(meshes);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

if(viewMatrix===null)
{
 viewMatrix=updateViewMatrix();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

if (vpMatrix === null) {
 vpMatrix = matrixMultiply(pMatrix,viewMatrix);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

if(camera.dirty)
{
 viewMatrix=updateViewMatrix();
 
 vpMatrix = matrixMultiply(pMatrix,viewMatrix);
 
if (now - meshes.lastSortTime > 500) {
sortMeshesByDistance(meshes);
meshes.lastSortTime=now;
}

}

 // Clear screen 
ctx.clearRect(0, 0, canvas.width, canvas.height);
offctx.clearRect(0, 0, canvas.width, canvas.height);

//~~~~~~~~~~~~~~~~~~~~~~~~~


let triIn=0;
//~~~~~~~~~~~~~~~~~~~~~~~~~
//MESHES LOOP
for (let mesh of meshes) {

if (skipNames.includes(mesh)) continue;

//~~~~~~~~~~~

if(!shouldRenderMesh(mesh))continue;

triIn+=mesh.length;
//~~~~~~~~~~~

/*
if (!mesh.lastSortTime){ mesh.lastSortTime = 0;
sortTriByDist(mesh);
}


if (now - mesh.lastSortTime > 300 && camera.dirty) {
 sortTriByDist(mesh);
 
 mesh.lastSortTime = now;
}
*/
sortTriByDist(mesh);


//~~~~~~~~~~~

let meshT = cloneMesh(mesh);
//console.log(mesh[0])
//console.log(meshT[0])
//~~~~~~~~~~~


let modelMatrix = toWorldView(mesh);


//~~~~~~~~~~~



if(isDynamicLight){
if (isSpecularShading) {
 specularShading(meshT, lightDir);
} else if (isStepShading) {
 stepShading(meshT, lightDir);
} else if(isFlatShading){
 flatShading(meshT, lightDir);
}
}


//~~~~~~~~~~~

meshByMatrix(meshT,modelMatrix);



clip(meshT);
filterVisibleTri(meshT);

meshByMatrix(meshT,vpMatrix)


perspectiveDivide(meshT);

meshByMatrix(meshT,screenView);

drawMesh(meshT,offctx)

}//mesh loop


ctx.drawImage(offscreen,0,0,canvas.width,canvas.height)

ctx.fillStyle = "#000";
ctx.font = "16px monospace";
ctx.fillText("trisOut: " + trisDrawn, 10, 60);
trisDrawn=0;
//~~~~~~~~~~~~~~~~~~~~~~~~~

if(camera.dirty)
{
 camera.dirty=false;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~

ctx.fillStyle = "#000";
ctx.font = "16px monospace";
ctx.fillText("FPS: " + fps, 10, 20);

ctx.fillStyle = "#000";
ctx.font = "16px monospace";
ctx.fillText("triIn: " + triIn, 10, 40);

//~~~~~~~~~~~~~~~~~~~~~~~~~
tick++;
if(tick>=1000000)tick=0;

updateCamera();

requestAnimationFrame(main);
}//MAIN

//-----------------------//

window.onload=requestAnimationFrame(main);


//-----------------------//

//TEST

function rotateMesh(mesh, axis, angle) {
  // Crear matriz de rotación 4x4
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let t = 1 - cos;
  let x = axis.x, y = axis.y, z = axis.z;

  let rotMatrix = [
    [t*x*x + cos,     t*x*y - sin*z,  t*x*z + sin*y],
    [t*x*y + sin*z,   t*y*y + cos,    t*y*z - sin*x],
    [t*x*z - sin*y,   t*y*z + sin*x,  t*z*z + cos]
  ];

  // Para rotar alrededor del centro, primero calcular centro
  let center = { x: 0, y: 0, z: 0 };
  let count = 0;
  for (let tri of mesh) {
    for (let v of tri) {
      center.x += v.x;
      center.y += v.y;
      center.z += v.z;
      count++;
    }
  }
  center.x /= count;
  center.y /= count;
  center.z /= count;

  // Rotar cada vértice respecto al centro
  for (let tri of mesh) {
    for (let v of tri) {
      // Trasladar a origen
      let px = v.x - center.x;
      let py = v.y - center.y;
      let pz = v.z - center.z;

      // Multiplicar por matriz rotación
      let rx = rotMatrix[0][0] * px + rotMatrix[0][1] * py + rotMatrix[0][2] * pz;
      let ry = rotMatrix[1][0] * px + rotMatrix[1][1] * py + rotMatrix[1][2] * pz;
      let rz = rotMatrix[2][0] * px + rotMatrix[2][1] * py + rotMatrix[2][2] * pz;

      // Trasladar de nuevo
      v.x = rx + center.x;
      v.y = ry + center.y;
      v.z = rz + center.z;
    }
  }
}

function rotateAnimation(animation, axis, angle) {
  // Crear matriz de rotación 3x3
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let t = 1 - cos;
  let x = axis.x, y = axis.y, z = axis.z;

  let rotMatrix = [
    [t*x*x + cos,     t*x*y - sin*z,  t*x*z + sin*y],
    [t*x*y + sin*z,   t*y*y + cos,    t*y*z - sin*x],
    [t*x*z - sin*y,   t*y*z + sin*x,  t*z*z + cos]
  ];

  // Calcular el centro de todos los vértices en toda la animación
  let center = { x: 0, y: 0, z: 0 };
  let count = 0;

  for (let mesh of animation) {
    
    mesh.isRotating=true;
    for (let tri of mesh) {
      for (let v of tri) {
        center.x += v.x;
        center.y += v.y;
        center.z += v.z;
        count++;
      }
    }
  }

  center.x /= count;
  center.y /= count;
  center.z /= count;

  // Aplicar rotación a todos los vértices
  for (let mesh of animation) {
    for (let tri of mesh) {
      for (let v of tri) {
        // Trasladar a origen
        let px = v.x - center.x;
        let py = v.y - center.y;
        let pz = v.z - center.z;

        // Rotar
        let rx = rotMatrix[0][0] * px + rotMatrix[0][1] * py + rotMatrix[0][2] * pz;
        let ry = rotMatrix[1][0] * px + rotMatrix[1][1] * py + rotMatrix[1][2] * pz;
        let rz = rotMatrix[2][0] * px + rotMatrix[2][1] * py + rotMatrix[2][2] * pz;

        // Volver a trasladar
        v.x = rx + center.x;
        v.y = ry + center.y;
        v.z = rz + center.z;
      }
    }
  }
}