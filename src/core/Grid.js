var Node = require('./Node');

/**
 * The Grid class, which serves as the encapsulation of the layout of the nodes.
 * @constructor
 * @param {number} width Number of columns of the grid.
 * @param {number} height Number of rows of the grid.
 * @param {Array.<Array.<(number|boolean)>>} [matrix] - A 0-1 matrix
 *     representing the walkable status of the nodes(0 or false for walkable).
 *     If the matrix is not supplied, all the nodes will be walkable.  */
function Grid(width, height, matrix) {
    /**
     * The number of columns of the grid.
     * @type number
     */
    this.width = width;
    /**
     * The number of rows of the grid.
     * @type number
     */
    this.height = height;

    /**
     * A 2D array of nodes.
     */
    this.nodes = this._buildNodes(width, height, matrix);
}

/**
 * Build and return the nodes.
 * @private
 * @param {number} width
 * @param {number} height
 * @param {Array.<Array.<number|boolean>>} [matrix] - A 0-1 matrix representing
 *     the walkable status of the nodes.
 * @see Grid
 */
Grid.prototype._buildNodes = function(width, height, matrix) {
    var y, x,
        nodes = new Array(height),
        row;

    for (y = 0; y < height; ++y) {
        nodes[y] = new Array(width);
        for (x = 0; x < width; ++x) {
            nodes[y][x] = new Node(x, y);
        }
    }


    if (matrix === undefined) {
        return nodes;
    }

    if (matrix.length !== height || matrix[0].length !== width) {
        throw new Error('Matrix size does not fit');
    }

    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            var encoding = matrix[y][x];
            if (encoding) {
                // 0, false, null will be walkable
                // while others will be un-walkable
                nodes[y][x].walkable = false;
            }
            if (typeof encoding == 'string' || encoding instanceof String){
                nodes[y][x].walkable = true;
                if(encoding.indexOf("n") > -1){
                  nodes[y][x].north = false;
                }
                if(encoding.indexOf("e") > -1){
                  nodes[y][x].east = false;
                }
                if(encoding.indexOf("s") > -1){
                  nodes[y][x].south = false;
                }
                if(encoding.indexOf("w") > -1){
                  nodes[y][x].west = false;
                }
            }
        }
    }

    return nodes;
};


Grid.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};


/**
 * Determine whether the node at the given position is walkable.
 * (Also returns false if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {boolean} - The walkability of the node.
 */
Grid.prototype.isWalkableAt = function(x, y) {
    return this.isInside(x, y) && this.nodes[y][x].walkable;
};

Grid.prototype.nodeHasNoWallInDir = function(node, dir) {
    var x = node.x;
    var y = node.y;
    if(dir == "north" && this.isWalkableAt(node.x, node.y - 1)){
        return node.north && this.nodes[y-1][x].south;
    }
    if(dir == "east" && this.isWalkableAt(node.x + 1, node.y)){
        return node.east && this.nodes[y][x+1].west;
    }
    if(dir == "south" && this.isWalkableAt(node.x, node.y + 1)){
        return node.south && this.nodes[y+1][x].north;
    }
    if(dir == "west" && this.isWalkableAt(node.x - 1, node.y)){
        return node.west && this.nodes[y][x-1].east;
    }

    return false; //neighbor is not walkable
};

Grid.prototype.pathClearDiagonal = function(startnode, endnode) {
    var dirUD = endnode.y-startnode.y == 1 ? "south" : "north";
    var dirLR = endnode.x-startnode.x == 1 ? "east" : "west";
    var oppositeDirUD = endnode.y-startnode.y == -1 ? "south" : "north";
    var oppositeDirLR = endnode.x-startnode.x == -1 ? "east" : "west";

    debugger;
    return  (startnode[dirUD] || endnode[oppositeDirUD])&&
            (startnode[dirLR] || endnode[oppositeDirLR])&&
            (startnode[dirUD] || startnode[dirLR]) &&
            (endnode[oppositeDirUD] || endnode[oppositeDirLR]);
};


/**
 * Determine whether the position is inside the grid.
 * XXX: `grid.isInside(x, y)` is wierd to read.
 * It should be `(x, y) is inside grid`, but I failed to find a better
 * name for this method.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
Grid.prototype.isInside = function(x, y) {
    return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
};


/**
 * Set whether the node on the given position is walkable.
 * NOTE: throws exception if the coordinate is not inside the grid.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {boolean} walkable - Whether the position is walkable.
 */
Grid.prototype.setWalkableAt = function(x, y, walkable) {
    this.nodes[y][x].walkable = walkable;
};


/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {boolean} allowDiagonal
 * @param {boolean} dontCrossCorners
 */
Grid.prototype.getNeighbors = function(node, allowDiagonal, dontCrossCorners) {
    var x = node.x,
        y = node.y,
        neighbors = [],
        s0 = false, d0 = false,
        s1 = false, d1 = false,
        s2 = false, d2 = false,
        s3 = false, d3 = false,
        nodes = this.nodes;

    // ↑
    if (this.isWalkableAt(x, y - 1) && this.nodeHasNoWallInDir(node, "north")) {
        neighbors.push(nodes[y - 1][x]);
        s0 = true;
    }
    // →
    if (this.isWalkableAt(x + 1, y) && this.nodeHasNoWallInDir(node, "east")) {
        neighbors.push(nodes[y][x + 1]);
        s1 = true;
    }
    // ↓
    if (this.isWalkableAt(x, y + 1) && this.nodeHasNoWallInDir(node, "south")) {
        neighbors.push(nodes[y + 1][x]);
        s2 = true;
    }
    // ←
    if (this.isWalkableAt(x - 1, y) && this.nodeHasNoWallInDir(node, "west")) {
        neighbors.push(nodes[y][x - 1]);
        s3 = true;
    }

    if (!allowDiagonal) {
        return neighbors;
    }

    if (dontCrossCorners) {
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s2 && s3;
    } else {
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s2 || s3;
    }

    // ↖
    if (d0 && this.isWalkableAt(x - 1, y - 1) && this.pathClearDiagonal(node, nodes[y - 1][x - 1])) {
        neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (d1 && this.isWalkableAt(x + 1, y - 1) && this.pathClearDiagonal(node, nodes[y - 1][x + 1])) {
        neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (d2 && this.isWalkableAt(x + 1, y + 1) && this.pathClearDiagonal(node, nodes[y + 1][x + 1])) {
        neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (d3 && this.isWalkableAt(x - 1, y + 1) && this.pathClearDiagonal(node, nodes[y + 1][x - 1])) {
        neighbors.push(nodes[y + 1][x - 1]);
    }

    return neighbors;
};


/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */
Grid.prototype.clone = function() {
    var i, j,

        width = this.width,
        height = this.height,
        thisNodes = this.nodes,

        newGrid = new Grid(width, height),
        newNodes = new Array(height),
        row;

    for (i = 0; i < height; ++i) {
        newNodes[i] = new Array(width);
        for (j = 0; j < width; ++j) {
            newNodes[i][j] = new Node(j, i,   thisNodes[i][j].walkable,
                                                thisNodes[i][j].n,
                                                thisNodes[i][j].e,
                                                thisNodes[i][j].s,
                                                thisNodes[i][j].w);
        }
    }

    newGrid.nodes = newNodes;

    return newGrid;
};

module.exports = Grid;
