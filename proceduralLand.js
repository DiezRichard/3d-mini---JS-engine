
//-----------------------//


/*
let vertexBuffer = [];//new Float32Array(MAX_TRIANGLES * 9); // 3 vértices * 3 coords

let baseVertexBuffer = new Uint32Array(MAX_TRIANGLES);

let colorBuffer =[];// new Uint32Array(MAX_TRIANGLES);
let visibleBuffer =[]; //new Uint8Array(MAX_TRIANGLES);
let triangleCount = 0; // contador global o local para saber cuántos vamos
let vertexOffset = 0; // en unidades de float (no bytes)
*/
/*
function generateCell(col, row, camPosX, camPosZ, subdivisions = 1) {
 let cell = [];
 cell.scale = tileScale;
 cell.baseColor = { r: 50, g: 250, b: 50 };
 cell.rotation = { x: 0, y: 0, z: 0 };
 cell.name = "cell";
 
 cell.position = {
  x: cellSize * (col + camPosX) * cell.scale - offset,
  y: 0,
  z: cellSize * (row + camPosZ) * cell.scale - offset
 };
 
 let step = (cellSize / subdivisions) | 0;
 if (step < 1) step = 1;
 
 for (let i = 0; i < cellSize; i += step) {
  for (let u = 0; u < cellSize; u += step) {
   let y00 = getY(u, i, col, row, camPosX, camPosZ);
   let y10 = getY(u + step, i, col, row, camPosX, camPosZ);
   let y01 = getY(u, i + step, col, row, camPosX, camPosZ);
   let y11 = getY(u + step, i + step, col, row, camPosX, camPosZ);
   
   // Primer triángulo
   let base1 = vertexOffset;
   vertexBuffer[vertexOffset++] = u;
   vertexBuffer[vertexOffset++] = y00;
   vertexBuffer[vertexOffset++] = i;
   
   vertexBuffer[vertexOffset++] = u + step;
   vertexBuffer[vertexOffset++] = y10;
   vertexBuffer[vertexOffset++] = i;
   
   vertexBuffer[vertexOffset++] = u + step;
   vertexBuffer[vertexOffset++] = y11;
   vertexBuffer[vertexOffset++] = i + step;
   
   cell.push({ baseVertex: base1, visible: true, color: "green" });
   
   // Segundo triángulo
   let base2 = vertexOffset;
   vertexBuffer[vertexOffset++] = u;
   vertexBuffer[vertexOffset++] = y00;
   vertexBuffer[vertexOffset++] = i;
   
   vertexBuffer[vertexOffset++] = u + step;
   vertexBuffer[vertexOffset++] = y11;
   vertexBuffer[vertexOffset++] = i + step;
   
   vertexBuffer[vertexOffset++] = u;
   vertexBuffer[vertexOffset++] = y01;
   vertexBuffer[vertexOffset++] = i + step;
   
   cell.push({ baseVertex: base2, visible: true, color: "green" });
  }
 }
 
 return cell;
}
*/
function generateCell(col, row, camPosX, camPosZ, subdivisions = 1) {
 let cell = [];
 cell.scale = tileScale;
 cell.baseColor = { r: 50, g: 250, b: 50 };
 cell.rotation = { x: 0, y: 0, z: 0 };
 cell.name = "cell";
 
 cell.position = {
  x: cellSize * (col + camPosX) * cell.scale - offset,
  y: 0,
  z: cellSize * (row + camPosZ) * cell.scale - offset
 };
 
 let color = 0x00ff00; // Verde puro
 
 let step = (cellSize / subdivisions) | 0;
 if (step < 1) step = 1;
 
 // Guardamos el triángulo inicial global para meshOffset
 cell.meshOffset = triangleCount;
 
 // Contador local de triángulos para esta celda
 let localTriangleCount = 0;
 
 for (let i = 0; i < cellSize; i += step) {
  for (let u = 0; u < cellSize; u += step) {
   let y00 = getY(u, i, col, row, camPosX, camPosZ);
   let y10 = getY(u + step, i, col, row, camPosX, camPosZ);
   let y01 = getY(u, i + step, col, row, camPosX, camPosZ);
   let y11 = getY(u + step, i + step, col, row, camPosX, camPosZ);
   
   // Primer triángulo
   let base1 = vertexOffset;
   vertexBuffer[vertexOffset++] = u;
   vertexBuffer[vertexOffset++] = y00;
   vertexBuffer[vertexOffset++] = i;
   
   vertexBuffer[vertexOffset++] = u + step;
   vertexBuffer[vertexOffset++] = y10;
   vertexBuffer[vertexOffset++] = i;
   
   vertexBuffer[vertexOffset++] = u + step;
   vertexBuffer[vertexOffset++] = y11;
   vertexBuffer[vertexOffset++] = i + step;
   
   cell.push({ baseVertex: base1, visible: true, color: "green" });
   
   baseVertexBuffer[triangleCount] = base1;
   colorBuffer[triangleCount] = color;
   visibleBuffer[triangleCount] = 1;
   triangleCount++;
   localTriangleCount++;
   
   // Segundo triángulo
   let base2 = vertexOffset;
   vertexBuffer[vertexOffset++] = u;
   vertexBuffer[vertexOffset++] = y00;
   vertexBuffer[vertexOffset++] = i;
   
   vertexBuffer[vertexOffset++] = u + step;
   vertexBuffer[vertexOffset++] = y11;
   vertexBuffer[vertexOffset++] = i + step;
   
   vertexBuffer[vertexOffset++] = u;
   vertexBuffer[vertexOffset++] = y01;
   vertexBuffer[vertexOffset++] = i + step;
   
   cell.push({ baseVertex: base2, visible: true, color: "green" });
   
   baseVertexBuffer[triangleCount] = base2;
   colorBuffer[triangleCount] = color;
   visibleBuffer[triangleCount] = 1;
   triangleCount++;
   localTriangleCount++;
  }
 }
 
 // Guardamos la cantidad de triángulos de esta celda
 cell.meshTriangleCount = localTriangleCount;
 
 return cell;
}
function generateCell(col, row, camPosX, camPosZ, subdivisions = 1) {
 let cell = [];
 cell.scale = tileScale;
 cell.baseColor = { r: 50, g: 250, b: 50 };
 cell.rotation = { x: 0, y: 0, z: 0 };
 cell.name = "cell";
 
 cell.position = {
  x: cellSize * (col + camPosX) * cell.scale - offset,
  y: 0,
  z: cellSize * (row + camPosZ) * cell.scale - offset
 };
 
 let color = "green";
 
 let step = (cellSize / subdivisions) | 0;
 if (step < 1) step = 1;
 
 for (let i = 0; i < cellSize; i += step) {
  for (let u = 0; u < cellSize; u += step) {
   let y00 = getY(u, i, col, row, camPosX, camPosZ);
   let y10 = getY(u + step, i, col, row, camPosX, camPosZ);
   let y01 = getY(u, i + step, col, row, camPosX, camPosZ);
   let y11 = getY(u + step, i + step, col, row, camPosX, camPosZ);
   
   // Primer triángulo
   cell.push([
    { x: u, y: y00, z: i },
    { x: u + step, y: y10, z: i },
    { x: u + step, y: y11, z: i + step },
    color,
    true
   ]);
   
   // Segundo triángulo
   cell.push([
    { x: u, y: y00, z: i },
    { x: u + step, y: y11, z: i + step },
    { x: u, y: y01, z: i + step },
    color,
    true
   ]);
  }
 }
 
 return cell;
}
//-----------------------//
let cells=[];

function createGrid(camPosX, camPosZ) {
 cells.length=0;
 
 for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
   let posX = cellSize * (col + camPosX) * tileScale - offset;
   let posZ = cellSize * (row + camPosZ) * tileScale - offset;
   
   let dx = posX - camera.position.x;
   let dz = posZ - camera.position.z;
   let distance = Math.sqrt(dx * dx + dz * dz);
   
   
   if (gridLimit !== 0 &&
    (posX < -gridLimit || posX > gridLimit ||
     posZ < -gridLimit || posZ > gridLimit)) continue;
   
   
   // Subdivisiones dinámicas (LOD realista)
   let subdivisions = 1.1;
   if (distance > 600) subdivisions = 6;
   if (distance > 1200) subdivisions = 4;
   if (distance > 1800) subdivisions = 2;
   if (distance > 2500) subdivisions = 1;
   
   let key = `${col + camPosX}:${row + camPosZ}`;

 cell = generateCell(col, row, camPosX, camPosZ, subdivisions);

cells.push(cell);
  }
 }
 
 return cells;
}


//-----------------------//

//local perlin
function getY(u, i, col, row, camPosX, camPosZ) {
 // Coordenadas absolutas en mundo
 let worldX = (u + (col + camPosX) * cellSize) / tileScale;
 let worldZ = (i + (row + camPosZ) * cellSize) / tileScale;
 
 // Escala del ruido
 let scale = frequency || 0.1; // si tenés frecuencia global, usala
 let noiseVal = perlin(worldX * scale + random, worldZ * scale + random);
 
 // Escalar a altura
 let y = noiseVal * beef; // beef = amplitud
 return Math.floor(y);
//return y;

}

//-----------------------//

function updateGrid(camPosX, camPosZ) {
 let index = 0;
 for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
   if (index >= grid.length) return; // protección si grid está incompleto
   
   let posX = cellSize * (col + camPosX) * tileScale - offset;
   let posZ = cellSize * (row + camPosZ) * tileScale - offset;
   
   let dx = posX - camera.position.x;
   let dz = posZ - camera.position.z;
   let distance = Math.sqrt(dx * dx + dz * dz);
   
   let subdivisions = 1.1;
   if (distance > 600) subdivisions = 6;
   if (distance > 1200) subdivisions = 4;
   if (distance > 1800) subdivisions = 2;
   if (distance > 2500) subdivisions = 1;
   
   let updatedCell = generateCell(col, row, camPosX, camPosZ, subdivisions);
   
   // Mantener la referencia del cell en grid pero reemplazar sus triángulos
   grid[index].length = 0;
   for (let tri of updatedCell) {
    grid[index].push(tri);
   }
   // Actualizar posición y otras propiedades si las usas:
   grid[index].position.x = posX;
   grid[index].position.z = posZ;
   grid[index].scale = tileScale;
   
   index++;
  }
 }
}

