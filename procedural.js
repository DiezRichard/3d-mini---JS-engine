
// Definición global de triángulos por cara para referencia
faces = {
  top: [
    [6, 2, 7], [7, 2, 3]
  ]
};

const cubeVertices = [
  { x: 0, y: 0, z: 0 }, // 0
  { x: 0, y: 0, z: 1 }, // 1
  { x: 0, y: 1, z: 0 }, // 2
  { x: 0, y: 1, z: 1 }, // 3
  { x: 1, y: 0, z: 0 }, // 4
  { x: 1, y: 0, z: 1 }, // 5
  { x: 1, y: 1, z: 0 }, // 6
  { x: 1, y: 1, z: 1 }  // 7
];


// Ejemplo: función dummy, debes reemplazar por tu lógica o estructura de cubos
function isCubeAt(x, y, z, voxelsSet) {
  return voxelsSet.has(`${x},${y},${z}`);
}

// ...definiciones faces y cubeVertices iguales...

function createGrid(camPosX, camPosZ) {
  let cells = [];
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let cell = [];
      
      cell.scale = tileScale;
      cell.rotation = { x: 0, y: 0, z: 0 };
      cell.name = "cell";
      
      cell.position = {
        x: cellSize * (col + camPosX) * cell.scale - offset,
        y: 0,
        z: cellSize * (row + camPosZ) * cell.scale - offset
      };
      
      for (let i = 0; i < cellSize; i++) {
        for (let u = 0; u < cellSize; u++) {
          const baseX = u;
          const baseY = 0;
          const baseZ = i;
          
          for (let tri of faces.top) {
            cell.push(tri.map(idx => ({
              x: cubeVertices[idx].x + baseX,
              y: cubeVertices[idx].y + baseY,
              z: cubeVertices[idx].z + baseZ
            })));
          }
        }
      }
      
      cells.push(cell);
    }
  }
  
  return cells;
}