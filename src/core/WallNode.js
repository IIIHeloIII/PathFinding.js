/**
 * A node in grid.
 * This class holds some basic information about a Wallnode and custom
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [n] - Whether this node is clear to the north.
 * @param {boolean} [e] - Whether this node is clear to the east.
 * @param {boolean} [s] - Whether this node is clear to the south.
 * @param {boolean} [w] - Whether this node is clear to the west.
 */
function WallNode(x, y, n, e, s, w) {
    /**
     * The x coordinate of the node on the grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    this.y = y;
    /**
     * Which directions are clear.
     * @type boolean
     */
    this.north = (n === undefined ? true : n);
    this.east = (e === undefined ? true : e);
    this.south = (s === undefined ? true : s);
    this.west = (w === undefined ? true : w);
};

module.exports = WallNode;
