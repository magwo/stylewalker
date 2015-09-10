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

    var humanHeight = 180;

    var height = 20;        //  Height for the physics body - your image height is 8px
    var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.

    var spine = game.add.sprite(200, 200, 'chain', 0);
    var pelvis = game.add.sprite(200, 210, 'chain', 0);

    // {
    //     pelvis
    //         spine
    //             neck
    //                 head
    //             shoulders
    //                 upperarms
    //                     lowerarms
    //                         hands
    //         upperlegs
    //             lowerlegs
    //                 feet
    // }

    // // Human body defined in centimeters
    // var humanBody = {
    //     name: 'spine',
    //     length: 100,


    //     subBodies: {
    //         []
    //     }
    // }


    //  Enable physicsbody
    _.each([spine, pelvis], function(part) {
        game.physics.p2.enable(part, false);

        //  Set custom rectangle
        part.body.setRectangle(width, height);

        part.body.mass = 10;
    });


    game.physics.p2.createRevoluteConstraint(spine, [0, -10], pelvis, [0, 10], 1000);
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
