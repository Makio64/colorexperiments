define(['entities/Vector'], function(Vector) {
   var Letters = {
        a: [
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(1, 2),
            new Vector(1, 1),
            new Vector(0, 1)
        ],
        b: [
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(1, 2),
            new Vector(1, 1),
            new Vector(0, 1),
            new Vector(1, 1),
            new Vector(1, 2),
            new Vector(0, 2)

        ],
        c: [
            new Vector(1, 0),
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(1, 2)
        ],
        d: [
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(1, 1),
            new Vector(0, 0)
        ],
        e: [
            new Vector(1, 0),
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(1, 2),
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(1, 1)
        ],
        f: [
            new Vector(1, 0),
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(1, 1)
        ],
        i: [
            new Vector(0.5, 0),
            new Vector(0.5, 1),
            new Vector(0.5, 2)
        ],
        l: [
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(1, 2)
        ],
        m: [
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(0.5, 1),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(1, 2)
        ],
        n: [
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(0.5, 1),
            new Vector(1, 2),
            new Vector(1, 1),
            new Vector(1, 0)
        ],
        o: [
            new Vector(1, 0),
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(1, 2),
            new Vector(1, 1),
            new Vector(1, 0)
        ],
        p: [
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1)
        ],
        r: [
            new Vector(0, 2),
            new Vector(0, 1),
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(1, 1),
            new Vector(0, 1),
            new Vector(1, 2)
        ],
        s: [
            new Vector(1, 0),
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(1, 1),
            new Vector(1, 2),
            new Vector(0, 2)
        ],
        t: [
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(0.5, 0),
            new Vector(0.5, 1),
            new Vector(0.5, 2)

        ],
        u: [
            new Vector(0, 0),
            new Vector(0, 1),
            new Vector(0, 2),
            new Vector(1, 2),
            new Vector(1, 1),
            new Vector(1, 0)
        ]
    };

   return Letters;
});