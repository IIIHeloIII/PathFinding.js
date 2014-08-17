var WallNode = require('./WallNode');

/**
 * The WallGrid class, which serves as the encapsulation of the layout of the nodes.
 * @constructor
 * @param {number} width Number of columns of the grid.
 * @param {number} height Number of rows of the grid.
 * @param {Array.<Array.<(string)>>} [matrix] - A matrix with strings
 *     representing the directions i which there are walls ("ne" for north and east).
 *     If the matrix is not supplied, all the nodes will be clear of walls.  */
function WallGrid(width, height, matrix) {
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
    this.nodes = this._buildWallNodes(width, height, matrix);
}

/**
 * Build and return the nodes.
 * @private
 * @param {number} width
 * @param {number} height
 * @param {Array.<Array.<string>>} [matrix] - A string matrix representing
 *     the wall placements ("sw" for walls at south and west).
 * @see WallGrid
 */
WallGrid.prototype._buildWallNodes = function(width, height, matrix) {
    var y, x,
        nodes = new Array(height),
        row;

    for (y = 0; y < height; ++y) {
        nodes[y] = new Array(width);
        for (x = 0; x < width; ++x) {
            nodes[y][x] = new WallNode(x, y);
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

    return nodes;
};


WallGrid.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};

WallGrid.prototype.nodeHasNoWallInDir = function(node, dir) {
    var x = node.x;
    var y = node.y;
    if(dir == "north" && this.isInside(node.x, node.y - 1)){
        return node.north && this.nodes[y-1][x].south;
    }
    if(dir == "east" && this.isInside(node.x + 1, node.y)){
        return node.east && this.nodes[y][x+1].west;
    }
    if(dir == "south" && this.isInside(node.x, node.y + 1)){
        return node.south && this.nodes[y+1][x].north;
    }
    if(dir == "west" && this.isInside(node.x - 1, node.y)){
        return node.west && this.nodes[y][x-1].east;
    }

    return false; //neighbor is not walkable
};

WallGrid.prototype.isPathClearDiagonal = function(startnode, endnode) {
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
WallGrid.prototype.isInside = function(x, y) {
    return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
};


/**
 * Get the neighbors of the given node.
 *
 * @param {Node} node
 * @param {boolean} allowDiagonal
 * @param {boolean} dontCrossCorners
 */
WallGrid.prototype.getNeighbors = function(node, allowDiagonal, dontCrossCorners) {
    var x = node.x,
        y = node.y,
        neighbors = [],
        nodes = this.nodes;

    // ↑
    if (this.isInside(x, y - 1) && this.nodeHasNoWallInDir(node, "north")) {
        neighbors.push(nodes[y - 1][x]);
    }
    // →
    if (this.isInside(x + 1, y) && this.nodeHasNoWallInDir(node, "east")) {
        neighbors.push(nodes[y][x + 1]);
    }
    // ↓
    if (this.isInside(x, y + 1) && this.nodeHasNoWallInDir(node, "south")) {
        neighbors.push(nodes[y + 1][x]);
    }
    // ←
    if (this.isInside(x - 1, y) && this.nodeHasNoWallInDir(node, "west")) {
        neighbors.push(nodes[y][x - 1]);
    }

    if (!allowDiagonal) {
        return neighbors;
    }

    // ↖
    if (allowDiagonal && this.isInside(x - 1, y - 1) &&
        this.isPathClearDiagonal(node, nodes[y - 1][x - 1])) {
        neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (allowDiagonal && this.isInside(x + 1, y - 1) &&
        this.isPathClearDiagonal(node, nodes[y - 1][x + 1])) {
        neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (allowDiagonal && this.isInside(x + 1, y + 1) &&
        this.isPathClearDiagonal(node, nodes[y + 1][x + 1])) {
        neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (allowDiagonal && this.isInside(x - 1, y + 1) &&
        this.isPathClearDiagonal(node, nodes[y + 1][x - 1])) {
        neighbors.push(nodes[y + 1][x - 1]);
    }

    return neighbors;
};


/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */
WallGrid.prototype.clone = function() {
    var x, y,

        width = this.width,
        height = this.height,
        thisNodes = this.nodes,

        newGrid = new WallGrid(width, height),
        newNodes = new Array(height),
        row;

    for (y = 0; y < height; ++y) {
        newNodes[y] = new Array(width);
        for (x = 0; x < width; ++x) {
            newNodes[y][x] = new WallNode(x, y, thisNodes[y][x].north,
                                                thisNodes[y][x].east,
                                                thisNodes[y][x].south,
                                                thisNodes[y][x].west);
        }
    }

    newGrid.nodes = newNodes;

    return newGrid;
};

module.exports = WallGrid;
