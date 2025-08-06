
function clip(mesh) {
  let cam = camera.position;
  let fwd = camera.forward;
  
  for (let i = 0; i < mesh.length; i++) {
    let tri = mesh[i];
    
    let v0 = tri[0];
    let v1 = tri[1];
    let v2 = tri[2];
    
    // Centro del triángulo
    let cx = (v0.x + v1.x + v2.x) / 3;
    let cy = (v0.y + v1.y + v2.y) / 3;
    let cz = (v0.z + v1.z + v2.z) / 3;
    
    let dx = cx - cam.x;
    let dy = cy - cam.y;
    let dz = cz - cam.z;
    
    let len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 0.0001) {
      tri.visible = true;
      continue;
    }
    
    // Normalizamos
    let toX = dx / len;
    let toY = dy / len;
    let toZ = dz / len;
    
    // Proyección sobre el forward
  //  let dot = toX * fwd.x + toY * fwd.y + toZ * fwd.z;
    
    let dot = toX * fwd.x + toY * fwd.y + toZ * fwd.z;

//dot-=0.01;

    // Condición de visibilidad
    let inFOV = dot > cosHalfFov;
    let inRange = len >= camera.near && len <= camera.far;
    
    tri.visible = inFOV && inRange;
  }
}

//-----------------------//

function isInFOV(x, y, z) {
  let cam = camera.position;
  let fwd = camera.forward;
  
  let dx = x - cam.x;
  let dy = y - cam.y;
  let dz = z - cam.z;
  
  let len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len < 0.0001) return true; // Muy cerca, lo consideramos visible
  
  let toX = dx / len;
  let toY = dy / len;
  let toZ = dz / len;
  
  let dot = toX * fwd.x + toY * fwd.y + toZ * fwd.z;
  
  let inFOV = dot > 0.5;
  let inRange = len >= camera.near && len <= camera.far;
  
  return inFOV && inRange;
}

function shouldRenderMesh(mesh) {
  let sum = { x: 0, y: 0, z: 0 };
  let count = 0;
  
  for (let tri of mesh) {
    for (let v of tri) {
      sum.x += v.x;
      sum.y += v.y;
      sum.z += v.z;
      count++;
    }
  }
  
  if (count === 0) return false;
  
  let cx = sum.x / count;
  let cy = sum.y / count;
  let cz = sum.z / count;
  
  return isInFOV(cx, cy, cz);
}
//-----------------------//
function filterVisibleTri(mesh){
  let filteredMesh = mesh.filter(triangle => triangle.visible !== false);


  return filteredMesh;
}

function filterVisibleTri(mesh) {
  for (let i = mesh.length - 1; i >= 0; i--) {
    if (mesh[i].visible === false) {
      mesh.splice(i, 1);
    }
  }
}

//-----------------------//

function multiplyMatrices(...matrices) {
  return matrices.reduce((acc, m) => matrixMultiply(acc, m));
}

//-----------------------//

function toWorldView(mesh) {
  let xMatrix = createRotationMatrix({ x: 1, y: 0, z: 0 }, mesh.rotation.x);
  let yMatrix = createRotationMatrix({ x: 0, y: 1, z: 0 }, mesh.rotation.y);
  let zMatrix = createRotationMatrix({ x: 0, y: 0, z: 1 }, mesh.rotation.z);
  
  let tMatrix = [
    [mesh.scale, 0, 0, mesh.position.x],
    [0, mesh.scale, 0, mesh.position.y],
    [0, 0, mesh.scale, mesh.position.z],
    [0, 0, 0, 1],
  ];
  
  return composedMatrix = multiplyMatrices(tMatrix, zMatrix, yMatrix, xMatrix);
  
  //return meshByMatrix(mesh, composedMatrix);
}

//-----------------------//

function getRotationMatrix(mesh) {
  let xMatrix = createRotationMatrix({ x: 1, y: 0, z: 0 }, mesh.rotation.x);
  let yMatrix = createRotationMatrix({ x: 0, y: 1, z: 0 }, mesh.rotation.y);
  let zMatrix = createRotationMatrix({ x: 0, y: 0, z: 1 }, mesh.rotation.z);
  return multiplyMatrices(zMatrix, yMatrix, xMatrix);
}
//-----------------------//

function updateViewMatrix() {

  let camPosMatrix = [
    [1, 0, 0, -camera.position.x],
    [0, 1, 0, -camera.position.y],
    [0, 0, 1, -camera.position.z],
    [0, 0, 0, 1]
  ];
  

  let  rx = createRotationMatrix({ x: 1, y: 0, z: 0 }, -camera.rotation.x);
  let  ry = createRotationMatrix({ x: 0, y: 1, z: 0 }, -camera.rotation.y);
  let  rz = createRotationMatrix({ x: 0, y: 0, z: 1 }, -camera.rotation.z);
  

  let  rotationMatrix = matrixMultiply(rz, ry, rx);
  

  let  viewMatrix = matrixMultiply(rotationMatrix, camPosMatrix);
  

  camera.forward = matrixTimesVector({ x: 0, y: 0, z: 1 }, rotationMatrix);
  camera.up = matrixTimesVector({ x: 0, y: 1, z: 0 }, rotationMatrix);
  camera.right = matrixTimesVector({ x: 1, y: 0, z: 0 }, rotationMatrix);
  
  return viewMatrix;
}

//-----------------------//

function toScreenSpace() {
  let  scaleX = canvas.width;
  let  scaleY = canvas.height;
  let  translateX = canvas.width / 3;
  let  translateY = canvas.height / 3;
  
  return stMatrix = [
[scaleX, 0, translateX, 0],
[0, scaleY, translateY, 0],
[0, 0, 1, 1],
[0, 0, 0, 0]
  ];
  
  //return meshByMatrix(mesh, stMatrix);
}

//-----------------------//

function flatShading(mesh, lightDir) {
  // Normalizar dirección de luz
  let len = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
  let lx = lightDir.x / len;
  let ly = lightDir.y / len;
  let lz = lightDir.z / len;
  
  for (let tri of mesh) {
    let normal = tri.normal;
    if (!normal) {
      
      normal = normV(calculateTriangleNormal(tri));
    }
    
    // Producto punto entre la normal y la luz
    let intensity = normal.x * lx + normal.y * ly + normal.z * lz;
    intensity = Math.max(0.4, intensity); // Sombra mínima
    
    let baseColor = tri.color; // {r, g, b}
    
    let r = Math.min(255, Math.floor(baseColor.r * intensity));
    let g = Math.min(255, Math.floor(baseColor.g * intensity));
    let b = Math.min(255, Math.floor(baseColor.b * intensity));
    
    tri.color = `rgb(${r}, ${g}, ${b})`;
  }
}

//specular 
function specularShading(mesh, lightDir, specularStrength = 0.9, shininess = 15) {
  //lightDir={x:0,y:0,z:-1}
  let cameraPos={x:camera.position.x-20,y:camera.position.y+20,z:camera.position.z};
  
  // Normalizar dirección de luz
  let len = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
  let lx = lightDir.x / len;
  let ly = lightDir.y / len;
  let lz = lightDir.z / len;
  
  for (let tri of mesh) {
    let normal;// tri.normal;
    
    
    if (!normal){
     normal=normV(calculateTriangleNormal(tri));
    }
    // Vector de luz normalizado
    let Lx = lx, Ly = ly, Lz = lz;

    // Vector de vista (desde centro del triángulo hacia la cámara)
    let cx = (tri[0].x + tri[1].x + tri[2].x) / 3;
    let cy = (tri[0].y + tri[1].y + tri[2].y) / 3;
    let cz = (tri[0].z + tri[1].z + tri[2].z) / 3;

    let Vx = cameraPos.x - cx;
    let Vy = cameraPos.y - cy;
    let Vz = cameraPos.z - cz;
    let vLen = Math.hypot(Vx, Vy, Vz);
    Vx /= vLen;
    Vy /= vLen;
    Vz /= vLen;

    // Producto punto entre normal y luz (difusa)
    let dot = normal.x * Lx + normal.y * Ly + normal.z * Lz;
    let diffuse = Math.max(0.4, dot); // luz difusa mínima

    // Calcular vector reflejado R = 2 * (N · L) * N - L
    let dotNL = dot;
    let Rx = 2 * dotNL * normal.x - Lx;
    let Ry = 2 * dotNL * normal.y - Ly;
    let Rz = 2 * dotNL * normal.z - Lz;
    let rLen = Math.hypot(Rx, Ry, Rz);
    Rx /= rLen;
    Ry /= rLen;
    Rz /= rLen;

    // Producto punto entre R y V
    let specAngle = Math.max(0, Rx * Vx + Ry * Vy + Rz * Vz);
    let specular = Math.pow(specAngle, shininess) * specularStrength;

    let totalLight = diffuse + specular;

    let baseColor = tri.color; // {r, g, b}

    let r = Math.min(255, Math.floor(baseColor.r * totalLight));
    let g = Math.min(255, Math.floor(baseColor.g * totalLight));
    let b = Math.min(255, Math.floor(baseColor.b * totalLight));

    tri.color = `rgb(${r}, ${g}, ${b})`;
  }
}

function stepShading(mesh, lightDir, steps = 2) {
  // Normalizar la dirección de luz
  let len = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
  let lx = lightDir.x / len;
  let ly = lightDir.y / len;
  let lz = lightDir.z / len;
  
  for (let tri of mesh) {
    let normal = tri.normal;
    if (!normal) continue;
    
    // Producto punto entre normal y dirección de luz
    let dot = normal.x * lx + normal.y * ly + normal.z * lz;
    
    // Clamp
    let intensity = Math.max(0, dot);
    
    // Convertimos intensidad continua a escalones discretos
    let stepped = Math.floor(intensity * steps) / (steps - 1);
    stepped = Math.max(0.4, stepped); // Sombra mínima opcional
    
    let baseColor = tri.color; // {r, g, b}
    
    let r = Math.min(255, Math.floor(baseColor.r * stepped));
    let g = Math.min(255, Math.floor(baseColor.g * stepped));
    let b = Math.min(255, Math.floor(baseColor.b * stepped));
    
    tri.color = `rgb(${r}, ${g}, ${b})`;
  }
}

//-----------------------//

function isBackface(tri) {
  let ax = tri[1].x - tri[0].x;
  let ay = tri[1].y - tri[0].y;
  let bx = tri[2].x - tri[0].x;
  let by = tri[2].y - tri[0].y;
  return (ax * by - ay * bx) > 0; 
}

//-----------------------//

let trisDrawn=0;

//batch & BF culling
function drawMesh(m, ctx, batchSize = 100) {
  for (let start = 0; start < m.length; start += batchSize) {
    let end = Math.min(start + batchSize, m.length);
    
    for (let i = start; i < end; i++) {
      let tri = m[i];
      
      if (!tri.visible || isBackface(tri)) continue;
      trisDrawn++;
      
      ctx.beginPath();
      ctx.moveTo(tri[0].x, tri[0].y);
      ctx.lineTo(tri[1].x, tri[1].y);
      ctx.lineTo(tri[2].x, tri[2].y);
      ctx.closePath();
      
      ctx.fillStyle = tri.color;
      ctx.fill();
    }
  }
  
  
}


