//LOADER 2
function loadObject2(file)
{
let request = new XMLHttpRequest();
let mesh= [];
request.open("GET", file, false);
 
request.onreadystatechange = function()
{

if (request.readyState === 4)
{
if (request.status === 200 || request.status == 0)
{

let obj=request.responseText;
let str=String(obj);

 let arr= str.split(/\n/);
 let vectors=[];
 
 //VECTORS
for(let i=0;i<arr.length;i++)
{

//vectors
if (arr[i].match(/^v\s/))
{
//erase
 let p= arr[i].replace("v ","");
 let s=p.replace("v ","");
 //change "," with "."
s= p.replace(/\,/gm,".");
//split into 3 coords
let v= s.split(/\s/);
//fill in vector coords in numbers
let c={x:(+v[0]),y:(+v[1]),z:(+v[2])};

c.wx=roundToDecimals(c.wx,1);
c.wy=roundToDecimals(c.wy,1);
c.wz=roundToDecimals(c.wz,1);
//add vectors
vectors.push(c);


}

}//VECTORS
 
 //TRIANGLES
 for(let i=0;i<arr.length;i++)
{
//triangles
if(arr[i].match(/^f/))
{
//clean
let clean= arr[i].replace("f ","");
//split
let split= clean.split(/\s/);

 // take the first value
let index1= +split[0].match(/\d+/m); 
let index2= +split[1].match(/\d+/m);
let index3= +split[2].match(/\d+/m);

let triangle=[];


triangle.push(vectors[index1-1],vectors[index2-1],vectors[index3-1]);

triangle.visible=true;

mesh.push(triangle);

}
}//TRIANGLES
}
}
}
request.send(null);

return mesh;
};// LOADER 2

//color x tri
function loadMiniMesh(file) {
 let request = new XMLHttpRequest();
 let mesh = [];
 
 request.open("GET", file, false);
 
 request.onreadystatechange = function() {
  if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
   let lines = request.responseText.split(/\r?\n/);
   
   for (let line of lines) {
    if (!line.trim().startsWith("t")) continue;
    
    let parts = line.trim().split(/\s+/);
    if (parts.length !== 13) continue;
    
    let [
     _t,
     x0, y0, z0,
     x1, y1, z1,
     x2, y2, z2,
     r, g, b
    ] = parts;
    
    let tri = [
     { x: parseFloat(x0), y: parseFloat(y0), z: parseFloat(z0) },
     { x: parseFloat(x1), y: parseFloat(y1), z: parseFloat(z1) },
     { x: parseFloat(x2), y: parseFloat(y2), z: parseFloat(z2) }
    ];
    
    //tri.color = `rgb(${parseInt(r)}, ${parseInt(g)}, ${parseInt(b)})`;
    
    tri.color = { r: r, g:g, b: b };
    
    tri.visible = true;
    
    mesh.push(tri);
   }
  }
 };
 
 request.send(null);
 return mesh;
}

//-------------------------------------//

//UTILITIES

function matrixTimesVector(v, matrix) {
let x1 = v.x * matrix[0][0] + v.y * matrix[1][0] + v.z * matrix[2][0];
let y1 = v.x * matrix[0][1] + v.y * matrix[1][1] + v.z * matrix[2][1];
let z1 = v.x * matrix[0][2] + v.y * matrix[1][2] + v.z * matrix[2][2];

let vec = { x: x1, y: y1, z: z1 };

return vec;
}

//-------------------------------------//

function cross(v1,v2)
{
let vx = v1.y*v2.z-v1.z*v2.y;
let vy = v1.x*v2.z-v1.z*v2.x;
let vz = v1.x*v2.y-v1.y*v2.x;

let newV={x:vx,y:vy,z:vz};

return newV;
};

//-------------------------------------//

function vectorSub(v1,v2)
{
let newV={x:(v1.x-v2.x),y:(v1.y-v2.y),z:(v1.z-v2.z)};

return newV;
}

//-------------------------------------//

function vectorAdd(v1, v2)
{
let newV = { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };

return newV;
}

//-------------------------------------//

function normV(v)
{
let len=(Math.sqrt((v.x*v.x+v.y*v.y+v.z*v.z)));
//len=Math.floor(len);
let newV={x:v.x/len,y:v.y/len,z:v.z/len};

return newV;
}

//-------------------------------------//

function dotP(v1,v2)
{
let result= v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;

return result;
}

/*
function dotProduct(v1,v2)
{
let result= v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;

return result;
}
*/
//-------------------------------------//

function vectorMultif(v, f)
{
let newV= {x:v.x*f,y:v.y*f,z:v.z*f};

return newV;
}

//-------------------------------------//


function roundToDecimals(number, decimals) {
let multiplier = Math.pow(10, decimals);
return Math.round(number * multiplier) / multiplier;
}

//meshByMatrix
//multiply every vector of every triangle of a mesh by a matrix
function meshByMatrix(mesh, matrix) {
let meshT = [];

// Copiar propiedades del mesh original
meshT.name = mesh.name;
meshT.rotation = mesh.rotation;
meshT.baseColor = mesh.baseColor;

for (let t of mesh) {
let tri = [];


// Copiar propiedades del triángulo
tri.visible = t.visible;
tri.color = t.color;

for (let v of t) {
let x1 = v.x * matrix[0][0] + v.y * matrix[0][1] + v.z * matrix[0][2] + matrix[0][3];
let y1 = v.x * matrix[1][0] + v.y * matrix[1][1] + v.z * matrix[1][2] + matrix[1][3];
let z1 = v.x * matrix[2][0] + v.y * matrix[2][1] + v.z * matrix[2][2] + matrix[2][3];
let w1 = v.x * matrix[3][0] + v.y * matrix[3][1] + v.z * matrix[3][2] + matrix[3][3];

tri.push({ x: x1, y: y1, z: z1, w: w1 });
}

meshT.push(tri);
}

return meshT;
}

function meshByMatrix(mesh, matrix) {
  const meshT = new Array(mesh.length);
  
  // Copiar propiedades del mesh original
  meshT.name = mesh.name;
  meshT.rotation = mesh.rotation;
  meshT.baseColor = mesh.baseColor;
  
  for (let i = 0; i < mesh.length; i++) {
    const tri = mesh[i];
    const triT = new Array(3);
    
    // Copiar propiedades visibles/color del triángulo
    triT.visible = tri.visible;
    triT.color = tri.color;
    
    for (let j = 0; j < 3; j++) {
      const v = tri[j];
      
      const x1 = v.x * matrix[0][0] + v.y * matrix[0][1] + v.z * matrix[0][2] + matrix[0][3];
      const y1 = v.x * matrix[1][0] + v.y * matrix[1][1] + v.z * matrix[1][2] + matrix[1][3];
      const z1 = v.x * matrix[2][0] + v.y * matrix[2][1] + v.z * matrix[2][2] + matrix[2][3];
      const w1 = v.x * matrix[3][0] + v.y * matrix[3][1] + v.z * matrix[3][2] + matrix[3][3];
      
      triT[j] = { x: x1, y: y1, z: z1, w: w1 };
    }
    
    meshT[i] = triT;
  }
  
  return meshT;
}

//inplace
function meshByMatrix(mesh, matrix) {
  for (let i = 0; i < mesh.length; i++) {
    const tri = mesh[i];
    
    for (let j = 0; j < 3; j++) {
      const v = tri[j];
      
      const x = v.x;
      const y = v.y;
      const z = v.z;
      
      v.x = x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2] + matrix[0][3];
      v.y = x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2] + matrix[1][3];
      v.z = x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2] + matrix[2][3];
      v.w = x * matrix[3][0] + y * matrix[3][1] + z * matrix[3][2] + matrix[3][3];
    }
    // No es necesario tocar tri.color, tri.visible, etc., ya están en el objeto
  }
  
  // No retorna nada porque modifica in-place
}

//-----------------------//

// Function to calculate the angle difference between two normalized vectors in radians
function vectorsAngleDiff(v1, v2)
{
let dot = dotP(v1, v2);
let angle = Math.asin(Math.max(-1, Math.min(1, dot)));

// Ensure the angle is positive
if (dotP(cross(v1, v2), v2) < 0) {
angle = Math.PI - angle;
}

return angle;
}

//-------------------------------------//

function sortTriByAngle(mesh) {
// Calculate angle differences from camera to triangle centroids and add an 'angleDifference' property to each triangle
for (let i = 0; i < mesh.length; i++) {
let tri=mesh[i];

let centroid = calculateCentroid(tri);

let normal = createNormalToAPlane(tri[0], tri[1], tri[2]);

let directionToCamera = normV(vectorSub(camera.position, centroid));

let angleDifference = vectorsAngleDiff(normal, directionToCamera);

mesh[i].angleDifference = angleDifference;
}

// Sort triangles based on the 'angleDifference' property
mesh.sort(function(a, b) {
return b.angleDifference - a.angleDifference;
});
}

//-------------------------------------//

function normalizeVector(vector) 
{
let length = vectorLength(vector);
return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

//-------------------------------------//

function vectorLength(vector) 
{
return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

//-------------------------------------//



function calculateTriangleNormal(triangle) 
{
// Calculate the cross product of two vectors formed by the triangle's vertices
let v1 = vectorFromVertices(triangle[0], triangle[1]);
let v2 = vectorFromVertices(triangle[0], triangle[2]);

let normal = {
x: v1.y * v2.z - v1.z * v2.y,
y: v1.z * v2.x - v1.x * v2.z,
z: v1.x * v2.y - v1.y * v2.x
};

return normal;
}

//-------------------------------------//


function vectorFromVertices(v1, v2) {
return { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
}
//-------------------------------------//

function matrixMultiply(matrix1, matrix2)
{
let result = [];
for (let i = 0; i < matrix1.length; i++) {
result[i] = [];
for (let j = 0; j < matrix2[0].length; j++) {
let sum = 0;
for (let k = 0; k < matrix1[0].length; k++) {
sum += matrix1[i][k] * matrix2[k][j];
}
result[i][j] = sum;
}
}
return result;
}

//-------------------------------------//


function sortMeshesByDistance(meshes){
return meshes.sort((mesh1, mesh2) => {
let distance1 = vectorDistance(camera.position, mesh1.position);
let distance2 = vectorDistance(camera.position, mesh2.position);

// Ascending order (from far to close)
return distance2 - distance1;
});
}

function mapRange(value, inMin, inMax, outMin, outMax) {
return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}


//-------------------------------------//

// Function to calculate the centroid of a triangle
function calculateCentroid(triangle) {
let sum = { x: 0, y: 0, z: 0 };

for (let i = 0; i < triangle.length; i++) 
{
sum.x += triangle[i].x;
sum.y += triangle[i].y;
sum.z += triangle[i].z;
}

let numVertices = triangle.length;

let centroid=
{ 
x: sum.x / numVertices, 
y: sum.y / numVertices, 
z: sum.z / numVertices 
}

return centroid;
}

//-----------------------//

function sortTriByDist(mesh) {
 let indexed = [];
 
 for (let i = 0; i < mesh.length; i++) {
  let tri = mesh[i];
  
  let v0 = tri[0];
  let v1 = tri[1];
  let v2 = tri[2];
  
  let cx = (v0.x + v1.x + v2.x) / 3;
  let cy = (v0.y + v1.y + v2.y) / 3;
  let cz = (v0.z + v1.z + v2.z) / 3;
  
  let dist = vectorDistance({ x: cx, y: cy, z: cz }, camera.position);
  
  indexed.push({ tri, dist });
 }
 
 indexed.sort((a, b) => b.dist - a.dist);
 
 for (let i = 0; i < mesh.length; i++) {
  mesh[i] = indexed[i].tri;
 }
}


//-----------------------//

function segmentInterPlane(planePoint, planeNormal, a, b) {
let ab = vectorSub(b, a);
let tNumerator = dotP(vectorSub(planePoint, a), planeNormal);
let tDenominator = dotP(ab, planeNormal);

let t = tNumerator / tDenominator;

return {
x: a.x + ab.x * t,
y: a.y + ab.y * t,
z: a.z + ab.z * t
};
}

//-----------------------//

function createRotationMatrix(axis, angle) {
let cos = Math.cos(angle);
let sin = Math.sin(angle);
let t = 1 - cos;

let matrix = [
[t * axis.x * axis.x + cos, t * axis.x * axis.y - sin * axis.z, t * axis.x * axis.z + sin * axis.y, 0],
[t * axis.x * axis.y + sin * axis.z, t * axis.y * axis.y + cos, t * axis.y * axis.z - sin * axis.x, 0],
[t * axis.x * axis.z - sin * axis.y, t * axis.y * axis.z + sin * axis.x, t * axis.z * axis.z + cos, 0],
[0, 0, 0, 1]
];

return matrix;
}

//-----------------------//

function perspectiveDivide(mesh) {
// Iterate through each triangle in the mesh
for (let i = 0; i < mesh.length; i++) 
{
let triangle = mesh[i];

// Iterate through each vertex in the triangle
for (let j = 0; j < 3; j++) 
{
let vertex = triangle[j];

if(vertex.w!=0)
{

vertex.x /= vertex.w;
vertex.y /= vertex.w;
vertex.z /= vertex.w;


};

// Normalize the vertex's w coordinate to 1
//vertex.w = 1;

}
}

}

//-----------------------//

function vectorDistance(vector1, vector2) {
let dx =(vector2.x) - (vector1.x);
let dy = (vector2.y) - (vector1.y);
let dz = (vector2.z) - (vector1.z);

return ((Math.sqrt(dx * dx + dy * dy + dz * dz)));
}

//-----------------------//

function sortMeshesByY(meshes) 
{
return meshes.sort((mesh1, mesh2) => {
// Ascending order (from lower to higher y-axis value)
return mesh1.position.y - mesh2.position.y;
});
}

//-----------------------//

function create3DPlane(size) {
let plane = [];

for (let i = 0; i < size; i++) {
for (let j = 0; j < size; j++) {
// Define vertices for the first triangle
let v1 = { x: i, y: 0, z: j };
let v2 = { x: i + 1, y: 0, z: j };
let v3 = { x: i, y: 0, z: j + 1 };

// Create the first triangle and add it to the plane
let triangle1 = [v3, v2, v1];

plane.push(triangle1);

// Define vertices for the second triangle
let v4 = { x: i + 1, y: 0, z: j };
let v5 = { x: i + 1, y: 0, z: j + 1 };
let v6 = { x: i, y: 0, z: j + 1 };

// Create the second triangle and add it to the plane
let triangle2 = [v6, v5, v4];

plane.push(triangle2);
}
}

return plane;
}

//-----------------------//

function normalizeMesh(mesh) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let tri of mesh) {
    for (let v of tri) {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
      if (v.z < minZ) minZ = v.z;
      if (v.z > maxZ) maxZ = v.z;
    }
  }

  let sizeX = maxX - minX;
  let sizeY = maxY - minY;
  let sizeZ = maxZ - minZ;
  let maxSize = Math.max(sizeX, sizeY, sizeZ);

  if (maxSize === 0) return; // Evitar división por cero

  for (let tri of mesh) {
    for (let v of tri) {
      v.x = (v.x - minX) / maxSize;
      v.y = (v.y - minY) / maxSize;
      v.z = (v.z - minZ) / maxSize;
    }
  }
}

//-----------------------//

function centerMeshOnGround(mesh) {
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let minY = Infinity;

  for (let tri of mesh) {
    for (let v of tri) {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.z < minZ) minZ = v.z;
      if (v.z > maxZ) maxZ = v.z;
      if (v.y < minY) minY = v.y;
    }
  }

  let offsetX = (minX + maxX) / 2;
  let offsetZ = (minZ + maxZ) / 2;

  for (let tri of mesh) {
    for (let v of tri) {
      v.x -= offsetX;
      v.z -= offsetZ;
      v.y -= minY; // base toca suelo
    }
  }
}

//-----------------------//

function precalcularNormal(mesh) {
  for (let tri of mesh) {
    let [v0, v1, v2] = tri;
    
    let ux = v1.x - v0.x;
    let uy = v1.y - v0.y;
    let uz = v1.z - v0.z;
    
    let vx = v2.x - v0.x;
    let vy = v2.y - v0.y;
    let vz = v2.z - v0.z;
    
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    
    let len = Math.hypot(nx, ny, nz);
    if (len < 0.0001) {
      tri.normal = { x: 0, y: 0, z: 0 }; // normal inválida (triángulo degenerado)
      continue;
    }
    
    tri.normal = {
      x: nx / len,
      y: ny / len,
      z: nz / len
    };
  }
}

function precalcularNormal(mesh) {
  for (let tri of mesh) {
    let [v0, v1, v2] = tri;
    
    let ux = v1.x - v0.x;
    let uy = v1.y - v0.y;
    let uz = v1.z - v0.z;
    
    let vx = v2.x - v0.x;
    let vy = v2.y - v0.y;
    let vz = v2.z - v0.z;
    
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    
    let len = Math.hypot(nx, ny, nz);
    if (len < 0.0001) {
      tri.normal = { x: 0, y: 0, z: 0 }; // normal inválida (triángulo degenerado)
      tri.face = null; // opcional, para indicar no asignado
      continue;
    }
    
    // Normalizada
    let normal = {
      x: nx / len,
      y: ny / len,
      z: nz / len
    };
    
    tri.normal = normal;
    
    // Asignar face según la normal
    let absX = Math.abs(normal.x);
    let absZ = Math.abs(normal.z);
    
    if (absX > absZ) {
      tri.face = (normal.x > 0) ? 'left' : 'right';
    } else {
      tri.face = (normal.z > 0) ? 'back' : 'front';
    }
  }
}

//-----------------------//

function cloneMesh(mesh) {
  return mesh.map(tri => {
    let clonedTri = tri.map(v => ({
      x: v.x,
      y: v.y,
      z: v.z,
      w: v.w ?? 1
    }));
    
    // Copiar propiedades directamente (shallow copy)
    clonedTri.color = tri.color;
    clonedTri.normal = tri.normal;
    clonedTri.visible = tri.visible;
    clonedTri.face=tri.face;
    
    return clonedTri;
  });
}

//-----------------------//

function calculateLight(mesh, meshT) {
  if (!isDynamicLight) return;
  
  let finalLightDir = lightDir;
  
  if (mesh.isRotating) {
    let lightRotMatrix = getRotationMatrix(mesh);
    finalLightDir = normV(matrixTimesVector(lightDir, lightRotMatrix));
  }
  
  if (isSpecular) {
    specularShading(meshT, finalLightDir);
  } else if (isStepShading) {
    stepShading(meshT, finalLightDir);
  } else {
    flatShading(meshT, finalLightDir);
  }
}



//-----------------------//