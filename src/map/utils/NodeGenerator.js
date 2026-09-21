import Node from "../Node.js";

/**
 * implementation of Poisson-disc Sampling
 * https://www.youtube.com/watch?v=flQgnCUxHlw
 * https://editor.p5js.org/codingtrain/sketches/4N78DFCXN
 */
export default class NodeGenerator {
  constructor(totalNodes = 100, width = 400, height = 400, radius = 30) {

    this.width = width;
    this.height = height;
    this.radius = radius;
    this.sampleLimit = 30;
    this.totalNodes = totalNodes;

    this.cellSize = this.radius / Math.sqrt(2);

    this.activePoints = [];
    this.ordered = [];

    this.cols = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor(this.height / this.cellSize);

    // step 0, init grid
    this.grid = [];
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.grid[i] = undefined;
    }
  }

  generateNodes() {
    const nodesList = [];
    const nodePositions = this.generatePoints();
    for (let i = 0; i < nodePositions.length; i++) {
      const currentPosition = nodePositions[i];
      const currentNode = new Node(i, currentPosition.x, currentPosition.y);
      nodesList.push(currentNode);
    }

    return nodesList;
  }


  generatePoints() {
    // reset
    this.activePoints = [];
    this.ordered = [];
    this.grid = [];
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.grid[i] = undefined;
    }
    
    // step 1 push first point into active
    let x = this.width / 2;
    let y = this.height / 2;
    let position = {
      "x": x, 
      "y": y
    };

    let i = Math.floor(x / this.cellSize);
    let j = Math.floor(y / this.cellSize);

    this.grid[i + j * this.cols] = position;

    this.activePoints.push(position);
    this.ordered.push(position);
  
    // step 2 generate all the other points
    while (this.activePoints.length > 0 && this.ordered.length < this.totalNodes) {
      let randomIndex = Math.floor(Math.random() * this.activePoints.length);
      let position = this.activePoints[randomIndex];
      let isValidCandidate = false;

      // step 3 pick a random point in a random direction
      for (let sampleAttempt = 0; sampleAttempt < this.sampleLimit; sampleAttempt++) {
        let angle = Math.random() * Math.PI * 2;
        let distance = this.radius + Math.random() * this.radius;

        let direction = {
          x: Math.sin(angle), 
          y: Math.cos(angle)
        };

        let candidate = {
          x: position.x + direction.x * distance,
          y: position.y + direction.y * distance,
        }

        let col = Math.floor(candidate.x / this.cellSize);
        let row = Math.floor(candidate.y / this.cellSize);

        // step 4 see if it is a valid position
        if (this.#isValid(candidate, col, row)) {
          isValidCandidate = true;
          this.grid[col + row * this.cols] = candidate;
          
          // step 4.1 add to point if valid 
          this.activePoints.push(candidate);
          this.ordered.push(candidate);
          break;
        }
      }

      // step 4.2 if not valid remove it as a possible point
      if (!isValidCandidate) {
        this.activePoints.splice(randomIndex, 1);
      }
    }
    
    return this.ordered;
  }

  #isValid(candidate, col, row) {
    let isWithinBounds = (
      col > -1 &&
      row > -1 &&
      col < this.cols &&
      row < this.rows &&
      !this.grid[col + row * this.cols]
    );

    if (!isWithinBounds) {
      return false;
    }

    // check its grid neighbors
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let index = (col + i) + (row + j) * this.cols;
        let neighbor = this.grid[index];
        if (neighbor) {
          let distance = {
            x: candidate.x - neighbor.x,
            y: candidate.y - neighbor.y
          }

          let squareDistance = (distance.x * distance.x) + (distance.y * distance.y);
          if (squareDistance < this.radius * this.radius) {
            return false;
          }

        }
      }
    }
    return true;
  }
}

