module.exports = [
    {
        name: "maze 1",
        startX: 0,
        startY: 0,
        endX: 1,
        endY: 1,
        matrix: [[0, 0],
                 [1, 0]],
        expectedLength: 3,
    },
    {
        name: "maze 2",
        startX: 1,
        startY: 1,
        endX: 4,
        endY: 4,
        matrix: [[0, 0, 0, 0, 0],
                 [1, 0, 1, 1, 0],
                 [1, 0, 1, 0, 0],
                 [0, 1, 0, 0, 0],
                 [1, 0, 1, 1, 0],
                 [0, 0, 1, 0, 0]],
        expectedLength: 9,
    },
    {
        name: "maze 3",
        startX: 0,
        startY: 3,
        endX: 3,
        endY: 3,
        matrix: [[0, 0, 0, 0, 0],
                 [0, 0, 1, 1, 0],
                 [0, 0, 1, 0, 0],
                 [0, 0, 1, 0, 0],
                 [1, 0, 1, 1, 0],
                 [0, 0, 0, 0, 0]],
        expectedLength: 10,
    },
    {
        name: "maze 4",
        startX: 4,
        startY: 4,
        endX: 19,
        endY: 19,
        matrix: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
        expectedLength: 31,
    },
    {
        //This maze is identical to maze 1 but descibed using walls instead of blocked tiles
        name: "wall maze 1",
        startX: 1,
        startY: 1,
        endX: 4,
        endY: 4,
        matrix: [[""    , ""    , ""    , ""    , ""],
                 ["nesw", ""    , "nesw", "nesw", ""],
                 ["nesw", ""    , "nesw", ""    , ""],
                 [""    , "nesw", ""    , ""    , ""],
                 ["nesw", ""    , "nesw", "nesw", ""],
                 [""    , ""    , "nesw", ""    , ""]],
        expectedLength: 9,
    }
    ,
    {
        name: "wall maze 2",
        startX: 0,
        startY: 0,
        endX: 2,
        endY: 2,
        matrix: [["", ""  , "" , ""  , ""],
                 ["", "nw", "n", "ne", ""],
                 ["", "w" , "" , "e" , ""],
                 ["", "w" , "" , "e" , ""],
                 ["", "w" , "" , "e" , ""],
                 ["", ""  , "" , ""  , ""]],
        expectedLength: 11,
    }
    ,
    {
        name: "wall maze 3",
        startX: 0,
        startY: 0,
        endX: 1,
        endY: 0,
        matrix: [["", "w"],
                 ["", ""]],
        expectedLength: 4,
    }
];
