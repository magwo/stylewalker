var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.spritesheet('chain', 'assets/chain.png', 16, 26);

}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1200;

    //  Length, xAnchor, yAnchor
    createRope(40, 400, 64);
    createHuman();

}

function createHuman() {

    var bodyDef = {
        name: "pelvis",
        position: [200, 0],
        size: [20, 20],
        mass: 200,
        subBodies: {
            spine: {
                position: [0, 55],
                size: [20, 90],
                mass: 400,
                subBodies: {
                    neck: {
                        position: [0, 50],
                        size: [10, 10],
                        mass: 100,
                        subBodies: {
                            head: {
                                position: [0, 17.5],
                                size: [20, 25],
                                mass: 200
                            }
                        }
                    }
                }
            },
            upLegLeft: {
                position: [0, -70],
                size: [15, 50],
                mass: 200,
                subBodies: {
                    lowLegLeft: {
                        position: [0, -25],
                        size: [12, 50],
                        mass: 200,
                        subBodies: {
                            footLeft: {
                                position: [0, -30],
                                size: [30, 10],
                                mass: 100
                            }
                        }
                    }
                }
            }
        }
    };
    

    function createBodyTree(game, body, currentPos) {

        var newCurrentPos = [currentPos[0] + body.position[0], currentPos[1] - body.position[1]];

        console.log("Body tree", body);
        var part = game.add.sprite(newCurrentPos[0], newCurrentPos[1], null, 0);
        game.physics.p2.enable(part, true);

        part.body.setRectangle(body.size[0], body.size[1]);
        part.body.mass = body.mass;


        if(body.subBodies) {
            _.forOwn(body.subBodies, function(subBody) {
                // TODO: Add constraints
                //game.physics.p2.createRevoluteConstraint(body, [body.size[0]/2, body.size[1]/2], subBody, [body.position[0]/2, -body.position[1]/2], 1000);
                createBodyTree(game, subBody, newCurrentPos);
            });
        }
    }

    createBodyTree(game, bodyDef, [0,300]);

    // game.physics.p2.createRevoluteConstraint(spine, [0, -height/2], pelvis, [0, height/2], 1000);
}

function createRope(length, xAnchor, yAnchor) {

    var lastRect;
    var height = 20;        //  Height for the physics body - your image height is 8px
    var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
    var maxForce = 20000;   //  The force that holds the rectangles together.

    for (var i = 0; i <= length; i++)
    {
        var x = xAnchor;                    //  All rects are on the same x position
        var y = yAnchor + (i * height);     //  Every new rect is positioned below the last

        if (i % 2 === 0)
        {
            //  Add sprite (and switch frame every 2nd time)
            newRect = game.add.sprite(x, y, 'chain', 1);
        }
        else
        {
            newRect = game.add.sprite(x, y, 'chain', 0);
            lastRect.bringToTop();
        }

        //  Enable physicsbody
        game.physics.p2.enable(newRect, true);

        //  Set custom rectangle
        newRect.body.setRectangle(width, height);

        if (i === 0)
        {
            newRect.body.static = true;
        }
        else
        {
            //  Anchor the first one created
            newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
            newRect.body.mass = length / i;     //  Reduce mass for evey rope element
        }

        //  After the first rectangle is created we can add the constraint
        if (lastRect)
        {
            game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce);
        }

        lastRect = newRect;

    }

}
