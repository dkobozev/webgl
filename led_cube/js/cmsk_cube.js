/**
 * Adapted from C code by Christian Moen (christian@lynet.no) and Ståle
 * Kristoffersen (staalekb@ifi.uio.no) 2011.
 *
 * Original license:  http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 * Happy hacking!! :D
 *
 * Adaptation by Denis Kobozev (d.v.kobozev@gmail.com)
 */

var CMSK = function () {
    var CUBE_SIZE = 8;
    var CUBE_BYTES = 64;

    var AXIS_X = 'x';
    var AXIS_Y = 'y';
    var AXIS_Z = 'z';

    var offColor = 0x0;

    var color = 0x0000ff;

    var color_r = 0;
    var color_g = 0;
    var color_b = 255;

    var color_dest_r = 0;
    var color_dest_g = 0;
    var color_dest_b = 255;

    var color_dr, color_dg, color_db;

    function RGB2Hex(r, g, b) {
        var hex = b;
        hex |= (g << 8);
        hex |= (r << 16);
        return hex;
    }

    function color_reset_transition() {
        color_dest_r = Math.round(color_r);
        color_dest_g = Math.round(color_g);
        color_dest_b = Math.round(color_b);
    }

    function color_change(steps) {
        if (Math.round(color_r) == color_dest_r &&
            Math.round(color_g) == color_dest_g &&
            Math.round(color_b) == color_dest_b
            ) {
            color_dest_r = rand()%255;
            color_dest_g = rand()%255;
            color_dest_b = rand()%255;

            color_dr = (color_dest_r - color_r) / steps;
            color_dg = (color_dest_g - color_g) / steps;
            color_db = (color_dest_b - color_b) / steps;
        }

        color_r += color_dr;
        color_g += color_dg;
        color_b += color_db;

        color = RGB2Hex(Math.round(color_r), Math.round(color_g), Math.round(color_b));
    }

    function fill(pattern) {
        if (!pattern) {
            cube_clear();
        } else {
            cube_clear(color);
        }
    }

    function setvoxel(x, y, z, c) {
        if (typeof c === 'undefined') {
            c = color;
        }
        cube_set_color(x, y, z, c);
    }

    function clrvoxel(x, y, z) {
        cube_set_color(x, y, z, offColor);
    }

    function getvoxel(x, y, z) {
        return (cube_get_color(x, y, z) != offColor);
    }

    function altervoxel(x, y, z, state) {
        if (state == 1) {
            setvoxel(x, y, z);
        } else {
            clrvoxel(x, y, z);
        }
    }

    function flpvoxel(x, y, z) {
        if (getvoxel(x, y, z)) {
            clrvoxel(x, y, z);
        } else {
            setvoxel(x, y, z);
        }
    }

    function setplane_x(x) {
        var y, z;

        if (x>=0 && x<CUBE_SIZE) {
            for (z=0;z<CUBE_SIZE;z++) {
                for (y=0;y<CUBE_SIZE;y++) {
                    setvoxel(x, y, z);
                }
            }
        }
    }

    function setplane_y(y) {
        var x, z;

        if (y>=0 && y<CUBE_SIZE) {
            for (z=0;z<CUBE_SIZE;z++) {
                for(x=0;x<CUBE_SIZE;x++) {
                    setvoxel(x, y, z);
                }
            }
        }
    }

    function setplane_z(z) {
        var x, y;

        if (z>=0 && z<CUBE_SIZE) {
            for (y=0;y<CUBE_SIZE;y++) {
                for (x=0;x<CUBE_SIZE;x++) {
                    setvoxel(x, y, z);
                }
            }
        }
    }

    function setplane(axis, i) {
        switch (axis) {
            case AXIS_X:
                setplane_x(i);
                break;
            case AXIS_Y:
                setplane_y(i);
                break;
            case AXIS_Z:
                setplane_z(i);
                break;
        }
    }

    // Shift the entire contents of the cube along an axis
    // This is great for effects where you want to draw something
    // on one side of the cube and have it flow towards the other
    // side. Like rain flowing down the Z axiz.
    function shift (axis, direction) {
        var i, x ,y;
        var ii, iii;
        var state;

        for (i = 0; i < CUBE_SIZE; i++) {
            if (direction == -1) {
                ii = i;
            } else {
                ii = (7-i);
            }

            for (x = 0; x < CUBE_SIZE; x++) {
                for (y = 0; y < CUBE_SIZE; y++) {
                    if (direction == -1) {
                        iii = ii+1;
                    } else {
                        iii = ii-1;
                    }

                    if (axis == AXIS_Z) {
                        state = getvoxel(x,y,iii);
                        altervoxel(x,y,ii,state);
                    }

                    if (axis == AXIS_Y) {
                        state = getvoxel(x,iii,y);
                        altervoxel(x,ii,y,state);
                    }

                    if (axis == AXIS_X) {
                        state = getvoxel(iii,y,x);
                        altervoxel(ii,y,x,state);
                    }
                }
            }
        }

        if (direction == -1) {
            i = 7;
        } else {
            i = 0;
        }

        for (x = 0; x < CUBE_SIZE; x++) {
            for (y = 0; y < CUBE_SIZE; y++) {
                if (axis == AXIS_Z)
                    clrvoxel(x,y,i);

                if (axis == AXIS_Y)
                    clrvoxel(x,i,y);

                if (axis == AXIS_X)
                    clrvoxel(i,y,x);
            }
        }
    }

    function AnimationPlaneBoing() {
        var i = 0, j = CUBE_SIZE-1;
        var delay = 30;
        var plane = [AXIS_X, AXIS_Y, AXIS_Z][rand()%3];

        color_reset_transition();

        return function () {
            if (i<8) {
                fill();
                setplane(plane, i);
                i++;
                return delay;
            }

            if (j>=0) {
                fill(0x00);
                setplane(plane,j);
                j--;
                return delay;
            }

            i = 0;
            j = CUBE_SIZE-1;
            plane = [AXIS_X, AXIS_Y, AXIS_Z][rand()%3];
            color_change(1);

            return 0;
        }
    }

    function AnimationBlinky() {
        var i=750;

        color_reset_transition();
        color_change(1);

        var ip = 0;
        var instructions = [
            function () {
                fill(0x00);
                ip++;
                return i;
            },
            function () {
                fill(0xff);
                ip++;
                return 100;
            },
            function () {
                i = i - (15+(1000/(i/10)));
                if (i > 0) {
                    ip -= 2;
                    return 0;
                } else {
                    ip++;
                    i = 750;

                    return 1000;
                }
            },
            function () {
                fill(0x00);
                ip++;
                return 751-i;
            },
            function () {
                fill(0xff);
                ip++;
                return 100;
            },
            function () {
                i = i - (15+(1000/(i/10)));
                if (i > 0) {
                    ip -= 2;
                    return 0;
                } else {
                    ip++;
                    return 0;
                }
            }
        ];

        return function () {
            if (ip < instructions.length) {
                return instructions[ip]();
            } else {
                ip = 0;
                return 0;
            }
        }
    }

    function box_wireframe(x1, y1, z1, x2, y2, z2) {
        var ix, iy, iz, tmp;

        if (x1 > x2) {
            tmp = x2;
            x2 = x1;
            x1 = tmp;
        }

        if (y1 > y2) {
            tmp = y2;
            y2 = y1;
            y1 = tmp;
        }

        if (z1 > z2) {
            tmp = z2;
            z2 = z1;
            z1 = tmp;
        }

        // Lines along X axis
        for (ix=x1;ix<=x2;ix++) {
            setvoxel(ix, y1, z1);
            setvoxel(ix, y1, z2);
            setvoxel(ix, y2, z1);
            setvoxel(ix, y2, z2);
        }

        // Lines along Y axis
        for (iy=y1;iy<=y2;iy++) {
            setvoxel(x1,iy,z1);
            setvoxel(x1,iy,z2);
            setvoxel(x2,iy,z1);
            setvoxel(x2,iy,z2);
        }

        // Lines along Z axis
        for (iz=z1;iz<=z2;iz++) {
            setvoxel(x1,y1,iz);
            setvoxel(x1,y2,iz);
            setvoxel(x2,y1,iz);
            setvoxel(x2,y2,iz);
        }
    }

    function mirror_y() {
        var buffer = [];
        var x,y,z;

        // copy the current cube into a buffer.
        for (z=0; z<CUBE_SIZE; z++) {
            for (y=0; y<CUBE_SIZE; y++) {
                for (x=0; x<CUBE_SIZE; x++) {
                    buffer.push(getvoxel(x, y, z));
                }
            }
        }

        fill(0x00);
        for (z=0; z<CUBE_SIZE; z++) {
            for (y=0; y<CUBE_SIZE; y++) {
                for (x=0; x<CUBE_SIZE; x++) {
                    if (buffer[x + y*CUBE_SIZE + z*CUBE_SIZE*CUBE_SIZE]) {
                        setvoxel(x, CUBE_SIZE-1-y, z);
                    }
                }
            }
        }
    }

    function mirror_x() {
        var buffer = [];
        var x,y,z;

        // copy the current cube into a buffer.
        for (z=0; z<CUBE_SIZE; z++) {
            for (y=0; y<CUBE_SIZE; y++) {
                for (x=0; x<CUBE_SIZE; x++) {
                    buffer.push(getvoxel(x, y, z));
                }
            }
        }

        fill(0x00);
        for (z=0; z<CUBE_SIZE; z++) {
            for (y=0; y<CUBE_SIZE; y++) {
                for (x=0; x<CUBE_SIZE; x++) {
                    altervoxel(CUBE_SIZE-1-x, y, z, buffer[x + y*CUBE_SIZE + z*CUBE_SIZE*CUBE_SIZE]);
                }
            }
        }
    }

    function mirror_z() {
        var buffer = [];
        var x,y,z;

        // copy the current cube into a buffer.
        for (z=0; z<CUBE_SIZE; z++) {
            for (y=0; y<CUBE_SIZE; y++) {
                for (x=0; x<CUBE_SIZE; x++) {
                    buffer.push(getvoxel(x, y, z));
                }
            }
        }

        fill(0x00);
        for (z=0; z<CUBE_SIZE; z++) {
            for (y=0; y<CUBE_SIZE; y++) {
                for (x=0; x<CUBE_SIZE; x++) {
                    altervoxel(x, y, CUBE_SIZE-1-z, buffer[x + y*CUBE_SIZE + z*CUBE_SIZE*CUBE_SIZE]);
                }
            }
        }
    }

    var tan = Math.tan;

    function AnimationBoxShrinkGrow(rot, flip) {
        var i=0, xyz;

        return function () {
            if (i<16) {
                xyz = 7-i; // This reverses counter i between 0 and 7.
                if (i > 7)
                    xyz = i-8; // at i > 7, i 8-15 becomes xyz 0-7.

                fill(0x00);
                box_wireframe(0,0,0,xyz,xyz,xyz);

                if (flip > 0) // upside-down
                    mirror_z();

                if (rot == 1 || rot == 3)
                    mirror_y();

                if (rot == 2 || rot == 3)
                    mirror_x();

                i++;

                return 100;
            }

            return -1;
        }
    }

    function AnimationBoxShrinkGrow2() {
        var i = 0;
        var f = AnimationBoxShrinkGrow(i%4, i & 0x04);

        color_reset_transition();

        return function () {
            var ret = f();

            if (ret < 0) {
                i++;
                if (i < 8) {
                    f = AnimationBoxShrinkGrow(i%4, i & 0x04);
                    color_change(4);
                } else {
                    i = 0;
                }

                return 0;
            } else {
                return ret;
            }
        }
    }

    function AnimationBoxWoopWoop() {
        var i = 0, ii;
        var grow = 0;

        color_reset_transition();

        return function () {
            if (i < 4) {
                fill(0x00);

                ii = i;
                if (grow > 0)
                    ii = 3-i;

                box_wireframe(4+ii,4+ii,4+ii,3-ii,3-ii,3-ii);
                i++;

                return 100;
            } else {
                i = 0;
                grow = grow ? 0 : 1;
                color_change(20);
                return 0;
            }
        }
    }

    function rand() {
        return Math.floor(Math.random() * 999999);
    }

    function AnimationBoingBoing() {
        var x, y, z;		// Current coordinates for the point
        var dx, dy, dz;	// Direction of movement
        var lol, i;
        var crash_x, crash_y, crash_z;
        var snake = [];

        var delay = 100;
        var mode = 0x01;
        var drawmode = 0x03;

        y = rand()%8;
        x = rand()%8;
        z = rand()%8;

        // Coordinate array for the snake.
        for (i=0;i<8;i++) {
            snake.push([x, y, z]);
        }

        dx = 1;
        dy = 1;
        dz = 1;

        color_reset_transition();

        var ip = 0;
        var instructions = [
            function () {
                fill(0x00);		// Blank the cube
                ip++;
                return 0;
            },
            function () {
                crash_x = 0;
                crash_y = 0;
                crash_z = 0;

                // Let's mix things up a little:
                if (rand()%3 == 0) {
                    // Pick a random axis, and set the speed to a random number.
                    lol = rand()%3;
                    if (lol == 0)
                        dx = rand()%3 - 1;

                    if (lol == 1)
                        dy = rand()%3 - 1;

                    if (lol == 2)
                        dz = rand()%3 - 1;
                }

                // The point has reached 0 on the x-axis and is trying to go to -1
                // aka a crash
                if (dx == -1 && x == 0) {
                    crash_x = 0x01;
                    if (rand()%3 == 1) {
                        dx = 1;
                    } else {
                        dx = 0;
                    }
                }

                // y axis 0 crash
                if (dy == -1 && y == 0) {
                    crash_y = 0x01;
                    if (rand()%3 == 1) {
                        dy = 1;
                    } else {
                        dy = 0;
                    }
                }

                // z axis 0 crash
                if (dz == -1 && z == 0) {
                    crash_z = 0x01;
                    if (rand()%3 == 1) {
                        dz = 1;
                    } else {
                        dz = 0;
                    }
                }

                // x axis 7 crash
                if (dx == 1 && x == 7) {
                    crash_x = 0x01;
                    if (rand()%3 == 1) {
                        dx = -1;
                    } else {
                        dx = 0;
                    }
                }

                // y axis 7 crash
                if (dy == 1 && y == 7) {
                    crash_y = 0x01;
                    if (rand()%3 == 1) {
                        dy = -1;
                    } else {
                        dy = 0;
                    }
                }

                // z azis 7 crash
                if (dz == 1 && z == 7) {
                    crash_z = 0x01;
                    if (rand()%3 == 1) {
                        dz = -1;
                    } else {
                        dz = 0;
                    }
                }

                // mode bit 0 sets crash action enable
                if (mode | 0x01) {
                    if (crash_x) {
                        if (dy == 0) {
                            if (y == 7) {
                                dy = -1;
                            } else if (y == 0) {
                                dy = +1;
                            } else {
                                if (rand()%2 == 0) {
                                    dy = -1;
                                } else {
                                    dy = 1;
                                }
                            }
                        }
                        if (dz == 0) {
                            if (z == 7) {
                                dz = -1;
                            } else if (z == 0) {
                                dz = 1;
                            } else {
                                if (rand()%2 == 0) {
                                    dz = -1;
                                } else {
                                    dz = 1;
                                }
                            }	
                        }
                    }

                    if (crash_y) {
                        if (dx == 0) {
                            if (x == 7) {
                                dx = -1;
                            } else if (x == 0) {
                                dx = 1;
                            } else {
                                if (rand()%2 == 0) {
                                    dx = -1;
                                } else {
                                    dx = 1;
                                }
                            }
                        }

                        if (dz == 0) {
                            if (z == 3) {
                                dz = -1;
                            } else if (z == 0) {
                                dz = 1;
                            } else {
                                if (rand()%2 == 0) {
                                    dz = -1;
                                } else {
                                    dz = 1;
                                }
                            }	
                        }
                    }

                    if (crash_z) {
                        if (dy == 0) {
                            if (y == 7) {
                                dy = -1;
                            } else if (y == 0) {
                                dy = 1;
                            } else {
                                if (rand()%2 == 0) {
                                    dy = -1;
                                } else {
                                    dy = 1;
                                }
                            }	
                        }

                        if (dx == 0) {
                            if (x == 7) {
                                dx = -1;
                            } else if (x == 0) {
                                dx = 1;
                            } else {
                                if (rand()%2 == 0) {
                                    dx = -1;
                                } else {
                                    dx = 1;
                                }
                            }	
                        }
                    }
                }

                // mode bit 1 sets corner avoid enable
                if (mode | 0x02) {
                    if (	// We are in one of 8 corner positions
                            (x == 0 && y == 0 && z == 0) ||
                            (x == 0 && y == 0 && z == 7) ||
                            (x == 0 && y == 7 && z == 0) ||
                            (x == 0 && y == 7 && z == 7) ||
                            (x == 7 && y == 0 && z == 0) ||
                            (x == 7 && y == 0 && z == 7) ||
                            (x == 7 && y == 7 && z == 0) ||
                            (x == 7 && y == 7 && z == 7)
                       )
                    {
                        // At this point, the voxel would bounce
                        // back and forth between this corner,
                        // and the exact opposite corner
                        // We don't want that!

                        // So we alter the trajectory a bit,
                        // to avoid corner stickyness
                        lol = rand()%3;
                        if (lol == 0)
                            dx = 0;

                        if (lol == 1)
                            dy = 0;

                        if (lol == 2)
                            dz = 0;
                    }
                }

                // one last sanity check
                if (x == 0 && dx == -1)
                    dx = 1;

                if (y == 0 && dy == -1)
                    dy = 1;

                if (z == 0 && dz == -1)
                    dz = 1;

                if (x == 7 && dx == 1)
                    dx = -1;

                if (y == 7 && dy == 1)
                    dy = -1;

                if (z == 7 && dz == 1)
                    dz = -1;


                // Finally, move the voxel.
                x = x + dx;
                y = y + dy;
                z = z + dz;

                if (drawmode == 0x01) {
                    ip++;
                } else if (drawmode == 0x02) {
                    ip += 3;
                } else if (drawmode == 0x03) {
                    ip += 4;
                }

                return 0;
            },
            function () { // show one voxel at time
                setvoxel(x,y,z);
                ip++;
                return delay;
            },
            function () {
                clrvoxel(x,y,z);
                ip = 0;
                return 0;
            },
            function () { // flip the voxel in question
                flpvoxel(x,y,z);
                ip = 0;
                return delay;
            },
            function () { // draw a snake
                for (var i=7;i>0;i--) {
                    snake[i][0] = snake[i-1][0];
                    snake[i][1] = snake[i-1][1];
                    snake[i][2] = snake[i-1][2];
                }

                snake[0][0] = x;
                snake[0][1] = y;
                snake[0][2] = z;

                for (i=0;i<8;i++) {
                    setvoxel(snake[i][0],snake[i][1],snake[i][2]);
                }

                ip++;
                return delay;
            },
            function () {
                for (i=0;i<8;i++) {
                    clrvoxel(snake[i][0],snake[i][1],snake[i][2]);
                }

                ip = 0;
                color_change(200);
                return 0;
            }
        ];

        return function () {
            if (ip < instructions.length) {
                return instructions[ip]();
            } else {
                ip = 0;
                return 0;
            }
        }
    }

    // Set or clear exactly 512 voxels in a random order.
    function AnimationRandomFiller() {
        var x,y,z;
        var loop = 0;
        var delay = 5;
        var state = 1;

        color_reset_transition();

        var ip = 0;
        var instructions = [
            function () {
                if (state == 1) {
                    fill(0x00);

                    color_change(1);
                } else {
                    fill(0xff);
                }

                ip++;
                return 0;
            },
            function () {
                if (loop<512) {
                    x = rand()%8;
                    y = rand()%8;
                    z = rand()%8;

                    if ((state == 0 && getvoxel(x,y,z) == 0x01) ||
                            (state == 1 && getvoxel(x,y,z) == 0x00)) {
                        altervoxel(x,y,z,state);
                        loop++;
                        return delay;
                    } else {
                        return 0;
                    }
                } else {
                    loop = 0;
                    state = state ? 0 : 1;
                    ip = 0;
                }

                return 1000;
            }
        ];

        return function () {
            if (ip >= instructions.length)
                ip = 0;

            return instructions[ip]();
        }
    }

    function AnimationRain() {
        var i;
        var rnd_x, rnd_y, rnd_num;
        var do_shift = 0;

        return function () {
            if (do_shift)
                shift(AXIS_Y,-1);
            else
                do_shift = 1;

            rnd_num = rand()%4;

            for (i=0; i < rnd_num;i++) {
                rnd_x = rand()%8;
                rnd_y = rand()%8;
                setvoxel(rnd_x,7,rnd_y);
            }

            color_change(50);

            return 100;
        }
    }

    function AnimationFireworks() {
        var n = 50, delay = 100;

        var f = 0, e = 0;

        var origin_x = 3;
        var origin_y = 3;
        var origin_z = 3;

        var rand_y, rand_x, rand_z;

        var slowrate, gravity;

        // Particles and their position, x,y,z and their movement, dx, dy, dz
        var particles;

        color_reset_transition();

        var ip = 0;
        var instructions = [
            function () {
                fill(0x00);

                particles = [];

                for (var i = 0; i < n; i++) {
                    particles.push([]);
                }

                origin_x = rand()%4;
                origin_y = rand()%2;
                origin_z = rand()%4;
                origin_z +=2;
                origin_x +=2;
                origin_y +=5;

                ip++;
                return 0;
            },
            function () {
                // shoot a particle up in the air
                if (e<origin_y) {
                    if (e > 0) {
                        fill(0x00);
                    }

                    setvoxel(origin_x, e, origin_z);

                    return (10+30*e++);
                } else {
                    fill(0x00);
                    e = 0;
                    ip++;
                    return 0;
                }
            },
            function () {
                // Fill particle array
                for (f=0; f<n; f++) {
                    // Position
                    particles[f].push(origin_x);
                    particles[f].push(origin_y);
                    particles[f].push(origin_z);

                    rand_x = rand()%200;
                    rand_y = rand()%200;
                    rand_z = rand()%200;

                    // Movement
                    particles[f].push(1-rand_x/100); // dx
                    particles[f].push(1-rand_y/100); // dy
                    particles[f].push(1-rand_z/100); // dz
                }

                ip++;
                return 0;
            },
            function () {
                // explode
                if (e<25) {
                    if (e > 0) {
                        fill(0x00);
                    }

                    slowrate = 1+tan((e+0.1)/20)*10;
                    gravity = tan((e+0.1)/20)/2;

                    for (f=0; f<n; f++) {
                        particles[f][0] += particles[f][3]/slowrate;
                        particles[f][1] += particles[f][4]/slowrate;
                        particles[f][2] += particles[f][5]/slowrate;
                        particles[f][1] -= gravity;

                        setvoxel(Math.round(particles[f][0]),
                                 Math.round(particles[f][1]),
                                 Math.round(particles[f][2]));
                    }

                    e++;
                    return delay;
                } else {
                    fill(0x00);
                    e = 0;
                    ip = 0;
                    color_change(1);
                    return 1000;
                }
            }
        ];

        return function() {
            if (ip >= instructions.length) {
                ip = 0;
            }

            return instructions[ip]();
        };
    }

    function distance(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) + (z1-z2)*(z1-z2));
    }

    function AnimationRipples() {
        var ripple_interval = 1.3;
        var i = 0;
        var delay = 5;

        return function () {
            fill(0x00);

            for (var z=0; z<8; z++) {
                for (var x=0; x<8; x++) {
                    var d = distance(3.5, 3.5, 0, x, z, 0)/9.899495*8;
                    var height = Math.floor(4+Math.sin(d/ripple_interval + i/50)*4);

                    setvoxel(x, height, z, color-10*height);
                }
            }

            color_change(1000);
            i++;
            return delay;
        };
    }

    function AnimationSidewaves() {
        var origin_x, origin_y, d, height, ripple_interval = 2;
        var i = 0;
        var delay = 5;

        return function () {
            fill(0x00);

            origin_x = 3.5+Math.sin(i/500)*4;
            origin_y = 3.5+Math.cos(i/500)*4;

            for (x=0;x<8;x++) {
                for (y=0;y<8;y++) {
                    d = distance(origin_x, origin_y, 0, x, y, 0)/9.899495*8;
                    height = Math.floor(4+Math.sin(d/ripple_interval + i/50)*3.6);

                    setvoxel(x, height, y);
                }
            }

            i++;
            return delay;
        };
    }

    function AnimationSphereMove() {
        var origin_x, origin_y, origin_z, d, diameter;
        var x, y, z, i = 0;
        var delay = 5;

        color_reset_transition();

        return function () {
            fill(0x00);

            origin_x = 3.5+Math.sin(i/50)*2.5;
            origin_y = 3.5+Math.cos(i/50)*2.5;
            origin_z = 3.5+Math.cos(i/30)*2;

            diameter = 2+Math.sin(i/150);

            for (x=0; x<8; x++) {
                for (y=0; y<8; y++) {
                    for (z=0; z<8; z++) {
                        d = distance(x, y, z, origin_x, origin_y, origin_z);

                        if (d>diameter && d<diameter+1) {
                            setvoxel(x,y,z);
                        }
                    }
                }
            }

            i++;
            color_change(1000);
            return delay;
        }
    }

    function line_3d(x1, y1, z1, x2, y2, z2) {
        var i;
        var err_1, err_2;

        var pixel = [x1, y1, z1];

        var dx = x2 - x1;
        var dy = y2 - y1;
        var dz = z2 - z1;

        var x_inc = (dx < 0) ? -1 : 1;
        var l = Math.abs(dx);

        var y_inc = (dy < 0) ? -1 : 1;
        var m = Math.abs(dy);

        var z_inc = (dz < 0) ? -1 : 1;
        var n = Math.abs(dz);

        var dx2 = l << 1;
        var dy2 = m << 1;
        var dz2 = n << 1;

        if ((l >= m) && (l >= n)) {
            err_1 = dy2 - l;
            err_2 = dz2 - l;

            for (i = 0; i < l; i++) {
                setvoxel(pixel[0],pixel[1],pixel[2]);

                if (err_1 > 0) {
                    pixel[1] += y_inc;
                    err_1 -= dx2;
                }

                if (err_2 > 0) {
                    pixel[2] += z_inc;
                    err_2 -= dx2;
                }

                err_1 += dy2;
                err_2 += dz2;
                pixel[0] += x_inc;
            }
        } else if ((m >= l) && (m >= n)) {
            err_1 = dx2 - m;
            err_2 = dz2 - m;

            for (i = 0; i < m; i++) {
                setvoxel(pixel[0],pixel[1],pixel[2]);

                if (err_1 > 0) {
                    pixel[0] += x_inc;
                    err_1 -= dy2;
                }

                if (err_2 > 0) {
                    pixel[2] += z_inc;
                    err_2 -= dy2;
                }

                err_1 += dx2;
                err_2 += dz2;
                pixel[1] += y_inc;
            }
        } else {
            err_1 = dy2 - n;
            err_2 = dx2 - n;

            for (i = 0; i < n; i++) {
                setvoxel(pixel[0],pixel[1],pixel[2]);

                if (err_1 > 0) {
                    pixel[1] += y_inc;
                    err_1 -= dz2;
                }

                if (err_2 > 0) {
                    pixel[0] += x_inc;
                    err_2 -= dz2;
                }

                err_1 += dy2;
                err_2 += dx2;
                pixel[2] += z_inc;
            }
        }

        setvoxel(pixel[0],pixel[1],pixel[2]);
    }

    function AnimationLineSpin() {
        var top_x, top_y, top_z, bot_x, bot_y, bot_z, sin_base;
        var center_x = 4, center_y = 4;
        var i = 0, z;

        color_reset_transition();

        return function () {
            fill(0x00);

            for (z = 0; z < 8; z++) {
                sin_base = i/50 + z/(10+(7*Math.sin(i/200)));

                top_x = Math.floor(center_x + Math.sin(sin_base)*5);
                top_y = Math.floor(center_x + Math.cos(sin_base)*5);

                bot_x = Math.floor(center_x + Math.sin(sin_base+3.14)*10);
                bot_y = Math.floor(center_x + Math.cos(sin_base+3.14)*10);

                bot_z = z;
                top_z = z;

                line_3d(top_z, top_x, top_y, bot_z, bot_x, bot_y);
            }

            i++;
            color_change(1000);
            return 5;
        };
    }

    function AnimationSineLines() {
        var i = 0, x;
        var left, right, sine_base, x_dividor,ripple_height;
        var delay = 5;

        color_reset_transition();

        return function () {
            fill(0x00);

            for (x=0; x<8 ;x++) {
                x_dividor = 2 + Math.sin(i/100)+1;
                ripple_height = 3 + (Math.sin(i/200)+1)*6;

                sine_base = i/40 + x/x_dividor;

                left = Math.floor(4 + Math.sin(sine_base)*ripple_height);
                right = 4 + Math.cos(sine_base)*ripple_height;
                right = Math.floor(7-left);

                line_3d(0-3, x, left, 7+3, x, right);
            }

            i++;
            color_change(1000);
            return delay;
        };
    }

    return {
          'PlaneBoing':    AnimationPlaneBoing
        , 'Blinky':        AnimationBlinky
        , 'BoxShrinkGrow': AnimationBoxShrinkGrow2
        , 'BoxWoopWoop':   AnimationBoxWoopWoop
        , 'BoingBoing':    AnimationBoingBoing
        , 'RandomFiller':  AnimationRandomFiller
        , 'Rain':          AnimationRain
        , 'Fireworks':     AnimationFireworks
        , 'Ripples':       AnimationRipples
        , 'Sidewaves':     AnimationSidewaves
        , 'SphereMove':    AnimationSphereMove
        , 'LineSpin':      AnimationLineSpin
        , 'SineLines':     AnimationSineLines
    }
}();
