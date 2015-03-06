/**
 * Adapted from Arduino code by Kevin Darrah (www.kevindarrah.com).
 *
 * Adaptation by Denis Kobozev (d.v.kobozev@gmail.com).
 */

var Darrah = function () {
    function LED(z, x, y, r, g, b) {
        if (x < 0)
            x = 0;
        if (x > 7)
            x = 7;
        if (y < 0)
            y = 0;
        if (y > 7)
            y = 7;
        if (z < 0)
            z = 0;
        if (z > 7)
            z = 7;

        if (r == 0 && g == 0 && b == 0) {
            var color = new THREE.Color(0x212121);
        } else {
            var color = new THREE.Color(r/15, g/15, b/15);
        }

        var color = b/15*255;
        color |= (g/15*255 << 8);
        color |= (r/15*255 << 16);

        cube_set_color(x, z, y, color);
    }

    function random(min, max) {
        if (typeof max === 'undefined') {
            max = min;
            min = 0;
        }

        if (min < 0) {
            var temp = max;
            max = min;
            min = temp;
        }

        return Math.floor(min + Math.random() * max);
    }

    function AnimationSineWave() {
        var rr=0, gg=0, bb=15;
        var sinewavearray = [0, 1, 2, 3, 4, 5, 6, 7];
        var sinemult      = [1, 1, 1, 1, 1, 1, 1, 1];
        var sinewavearrayOLD = [];

        return function () {

            var addr, colselect, addrt;
            var select, subZ=-7, subT=7, multi=0;//random(-1, 2);

            for(addr=0; addr<8; addr++){
                if(sinewavearray[addr]==7){
                    sinemult[addr]=-1;
                }
                if(sinewavearray[addr]==0){
                    sinemult[addr]=1;     
                }
                sinewavearray[addr] = sinewavearray[addr] + sinemult[addr];
            }//addr

            if(sinewavearray[0]==7){
                select=random(0, 3);
                if(select==0){
                    rr=random(1, 16);
                    gg=random(1, 16);
                    bb=0;} 
                if(select==1){
                    rr=random(1, 16);
                    gg=0;
                    bb=random(1, 16);}    
                if(select==2){
                    rr=0;
                    gg=random(1, 16);
                    bb=random(1, 16);}
            }

            for(addr=0; addr<8; addr++){
                LED(sinewavearrayOLD[addr], addr, 0, 0, 0, 0);
                LED(sinewavearrayOLD[addr], 0, addr, 0, 0, 0);
                LED(sinewavearrayOLD[addr], subT-addr, 7, 0, 0, 0);
                LED(sinewavearrayOLD[addr], 7, subT-addr, 0, 0, 0);     
                LED(sinewavearray[addr], addr, 0, rr, gg, bb);
                LED(sinewavearray[addr], 0, addr, rr, gg, bb);
                LED(sinewavearray[addr], subT-addr,7, rr, gg, bb);
                LED(sinewavearray[addr], 7, subT-addr, rr, gg, bb);
            }

            for(addr=1; addr<7; addr++){   
                LED(sinewavearrayOLD[addr+multi*1], addr, 1, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*1], 1, addr, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*1], subT-addr, 6, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*1], 6, subT-addr, 0, 0, 0);  
                LED(sinewavearray[addr+multi*1], addr, 1, rr, gg, bb);
                LED(sinewavearray[addr+multi*1], 1, addr, rr, gg, bb);
                LED(sinewavearray[addr+multi*1], subT-addr,6, rr, gg, bb);
                LED(sinewavearray[addr+multi*1], 6, subT-addr, rr, gg, bb);
            }

            for(addr=2; addr<6; addr++){   
                LED(sinewavearrayOLD[addr+multi*2], addr, 2, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*2], 2, addr, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*2], subT-addr, 5, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*2], 5, subT-addr, 0, 0, 0);  
                LED(sinewavearray[addr+multi*2], addr, 2, rr, gg, bb);
                LED(sinewavearray[addr+multi*2], 2, addr, rr, gg, bb);
                LED(sinewavearray[addr+multi*2], subT-addr,5, rr, gg, bb);
                LED(sinewavearray[addr+multi*2], 5, subT-addr, rr, gg, bb);
            }  

            for(addr=3; addr<5; addr++){   
                LED(sinewavearrayOLD[addr+multi*3], addr, 3, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*3], 3, addr, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*3], subT-addr, 4, 0, 0, 0);
                LED(sinewavearrayOLD[addr+multi*3], 4, subT-addr, 0, 0, 0);  
                LED(sinewavearray[addr+multi*3], addr, 3, rr, gg, bb);
                LED(sinewavearray[addr+multi*3], 3, addr, rr, gg, bb);
                LED(sinewavearray[addr+multi*3], subT-addr,4, rr, gg, bb);
                LED(sinewavearray[addr+multi*3], 4, subT-addr, rr, gg, bb);
            }      

            for(addr=0; addr<8; addr++)
                sinewavearrayOLD[addr]=sinewavearray[addr];

            return 100;
        }
    }

    function AnimationRain(){
        var x = [], y=[], z=[], addr, leds=64, bright=1, ledcolor=0;
        var xx=[], yy=[], zz=[], xold=[], yold=[], zold=[];

        for(addr=0; addr<64; addr++){
            x[addr]=random(8);
            y[addr]=random(8);
            z[addr]=random(8);
            xx[addr]=random(16);
            yy[addr]=random(16);
            zz[addr]=random(16);     
        }

        return function () {

            if(ledcolor<200){
                for(addr=0; addr<leds; addr++){
                    LED(zold[addr], xold[addr], yold[addr], 0, 0, 0);
                    if(z[addr]>=7)
                        LED(z[addr], x[addr], y[addr], 0, 5, 15);
                    if(z[addr]==6)
                        LED(z[addr], x[addr], y[addr], 0, 1, 9);
                    if(z[addr]==5)
                        LED(z[addr], x[addr], y[addr], 0, 0, 10);
                    if(z[addr]==4)
                        LED(z[addr], x[addr], y[addr], 1, 0, 11); 
                    if(z[addr]==3)
                        LED(z[addr], x[addr], y[addr], 3, 0, 12);
                    if(z[addr]==2)
                        LED(z[addr], x[addr], y[addr], 10, 0, 15);
                    if(z[addr]==1)
                        LED(z[addr], x[addr], y[addr], 10, 0, 10);
                    if(z[addr]<=0)
                        LED(z[addr], x[addr], y[addr], 10, 0, 1);
                }}//200

            if(ledcolor>=200&&ledcolor<300){
                for(addr=0; addr<leds; addr++){
                    LED(zold[addr], xold[addr], yold[addr], 0, 0, 0);
                    if(z[addr]>=7)
                        LED(z[addr], x[addr], y[addr], 15, 15, 0);
                    if(z[addr]==6)
                        LED(z[addr], x[addr], y[addr], 10, 10, 0);
                    if(z[addr]==5)
                        LED(z[addr], x[addr], y[addr], 15, 5, 0);
                    if(z[addr]==4)
                        LED(z[addr], x[addr], y[addr], 15, 2, 0); 
                    if(z[addr]==3)
                        LED(z[addr], x[addr], y[addr], 15, 1, 0);
                    if(z[addr]==2)
                        LED(z[addr], x[addr], y[addr], 15, 0, 0);
                    if(z[addr]==1)
                        LED(z[addr], x[addr], y[addr], 12, 0, 0);
                    if(z[addr]<=0)
                        LED(z[addr], x[addr], y[addr], 10, 0, 0);
                }}//300

            ledcolor++;
            if(ledcolor>=300)
                ledcolor=0;

            for(addr=0; addr<leds; addr++){
                xold[addr]=x[addr];
                yold[addr]=y[addr];
                zold[addr]=z[addr];
            }

            for(addr=0; addr<leds; addr++){
                z[addr] = z[addr]-1;
                if(z[addr]<random(-100,0)){
                    x[addr]=random(8);
                    y[addr]=random(8);

                    var select=random(3);
                    if(select==0){
                        xx[addr]=0;
                        zz[addr]=random(16);
                        yy[addr]=random(16);
                    }
                    if(select==1){
                        xx[addr]=random(16);
                        zz[addr]=0;
                        yy[addr]=random(16);
                    }
                    if(select==2){
                        xx[addr]=random(16);
                        zz[addr]=random(16);
                        yy[addr]=0;
                    }    
                    z[addr]=7; 
                }//-check
            }//add

            return 100;
        }
    }

    function AnimationFolder() {
        var xx, yy, zz, pullback=[], state=0, backorfront=7;//backorfront 7 for back 0 for front
        var folderaddr=[], LED_Old=[], oldpullback=[], ranx=random(16), rany=random(16), ranz=random(16), ranselect;
        var bot=0, top=1, right=0, left=0, back=0, front=0, side=0, side_select;

        folderaddr[0]=-7;
        folderaddr[1]=-6;
        folderaddr[2]=-5;
        folderaddr[3]=-4;
        folderaddr[4]=-3;
        folderaddr[5]=-2;
        folderaddr[6]=-1;
        folderaddr[7]=0;

        for(xx=0; xx<8; xx++){
            oldpullback[xx]=0;
            pullback[xx]=0;
        }

        return function () {
            if(top==1){
                if(side==0){
                    //top to left-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(7-LED_Old[yy], yy-oldpullback[yy],xx , 0, 0, 0);
                            LED(7-folderaddr[yy], yy-pullback[yy],xx , ranx, rany, ranz);
                        }}}
                if(side==2){
                    //top to back-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(7-LED_Old[yy], xx, yy-oldpullback[yy], 0, 0, 0);
                            LED(7-folderaddr[yy], xx, yy-pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==3){
                    //top-side to front-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(7-LED_Old[7-yy], xx, yy+oldpullback[yy], 0, 0, 0);
                            LED(7-folderaddr[7-yy], xx, yy+pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==1){
                    //top-side to right
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(7-LED_Old[7-yy], yy+oldpullback[yy],xx , 0, 0, 0);
                            LED(7-folderaddr[7-yy], yy+pullback[yy],xx , ranx, rany, ranz);
                        }}}
            }//top

            if(right==1){
                if(side==4){
                    //right-side to top
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy+oldpullback[7-yy],7-LED_Old[7-yy],xx , 0, 0, 0);
                            LED( yy+pullback[7-yy],7-folderaddr[7-yy],xx , ranx, rany, ranz);
                        }}}
                if(side==3){
                    //right-side to front-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, 7-LED_Old[7-yy],yy+oldpullback[yy], 0, 0, 0);
                            LED(xx,7-folderaddr[7-yy], yy+pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==2){
                    //right-side to back-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, 7-LED_Old[yy],yy-oldpullback[yy], 0, 0, 0);
                            LED(xx,7-folderaddr[yy], yy-pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==5){
                    //right-side to bottom
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy-oldpullback[yy],7-LED_Old[yy],xx , 0, 0, 0);
                            LED( yy-pullback[yy],7-folderaddr[yy],xx , ranx, rany, ranz);
                        }}}
            }//right

            if(left==1){
                if(side==4){
                    //left-side to top
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy+oldpullback[yy],LED_Old[7-yy],xx , 0, 0, 0);
                            LED( yy+pullback[yy],folderaddr[7-yy],xx , ranx, rany, ranz);
                        }}}
                if(side==3){
                    //left-side to front-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, LED_Old[7-yy],yy+oldpullback[yy], 0, 0, 0);
                            LED(xx,folderaddr[7-yy], yy+pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==2){
                    //left-side to back-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, LED_Old[yy],yy-oldpullback[yy], 0, 0, 0);
                            LED(xx,folderaddr[yy], yy-pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==5){
                    //left-side to bottom
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy-oldpullback[yy],LED_Old[yy],xx , 0, 0, 0);
                            LED( yy-pullback[yy],folderaddr[yy],xx , ranx, rany, ranz);
                        }}}
            }//left

            if(back==1){
                if(side==1){
                    //back-side to right-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, yy+oldpullback[yy],LED_Old[7-yy], 0, 0, 0);
                            LED(xx, yy+pullback[yy],folderaddr[7-yy], ranx, rany, ranz);
                        }}}
                if(side==4){
                    // back-side to top-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy+oldpullback[yy],xx,LED_Old[7-yy] , 0, 0, 0);
                            LED( yy+pullback[yy],xx,folderaddr[7-yy] , ranx, rany, ranz);
                        }}}
                if(side==5){
                    // back-side to bottom
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy-oldpullback[yy],xx,LED_Old[yy] , 0, 0, 0);
                            LED( yy-pullback[yy],xx,folderaddr[yy] , ranx, rany, ranz);
                        }}}//state1
                if(side==0){
                    //back-side to left-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, yy-oldpullback[yy],LED_Old[yy], 0, 0, 0);
                            LED(xx, yy-pullback[yy],folderaddr[yy], ranx, rany, ranz);
                        }}}
            }//back

            if(bot==1){
                if(side==1){
                    // bottom-side to right-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(LED_Old[7-yy], yy+oldpullback[yy],xx , 0, 0, 0);
                            LED(folderaddr[7-yy], yy+pullback[yy],xx , ranx, rany, ranz);
                        }}}
                if(side==3){
                    //bottom to front-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(LED_Old[7-yy], xx, yy+oldpullback[yy], 0, 0, 0);
                            LED(folderaddr[7-yy], xx, yy+pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==2){
                    //bottom to back-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(LED_Old[yy], xx, yy-oldpullback[yy], 0, 0, 0);
                            LED(folderaddr[yy], xx, yy-pullback[yy], ranx, rany, ranz);
                        }}}
                if(side==0){
                    //bottom to left-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(LED_Old[yy], yy-oldpullback[yy],xx , 0, 0, 0);
                            LED(folderaddr[yy], yy-pullback[yy],xx , ranx, rany, ranz);
                        }}}
            }//bot

            if(front==1){
                if(side==0){
                    //front-side to left-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, yy-oldpullback[yy],7-LED_Old[yy], 0, 0, 0);
                            LED(xx, yy-pullback[yy],7-folderaddr[yy], ranx, rany, ranz);
                        }}}
                if(side==5){
                    // front-side to bottom
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy-oldpullback[yy],xx,7-LED_Old[yy] , 0, 0, 0);
                            LED( yy-pullback[yy],xx,7-folderaddr[yy] , ranx, rany, ranz);
                        }}}
                if(side==4){
                    // front-side to top-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(yy+oldpullback[yy],xx,7-LED_Old[7-yy] , 0, 0, 0);
                            LED( yy+pullback[yy],xx,7-folderaddr[7-yy] , ranx, rany, ranz);
                        }}}
                if(side==1){
                    //front-side to right-side
                    for(yy=0; yy<8; yy++){
                        for(xx=0; xx<8; xx++){
                            LED(xx, yy+oldpullback[yy],7-LED_Old[7-yy], 0, 0, 0);
                            LED(xx, yy+pullback[yy],7-folderaddr[7-yy], ranx, rany, ranz);
                        }}}
            }//front

            for(xx=0; xx<8; xx++){
                LED_Old[xx]=folderaddr[xx];
                oldpullback[xx]=pullback[xx];
            }

            if(folderaddr[7]==7){
                // pullback=8;
                for(zz=0; zz<8; zz++)
                    pullback[zz] = pullback[zz]+1;

                if(pullback[7]==8){//finished with fold

                    ranselect= random(3);
                    if(ranselect==0){
                        ranx=0;
                        rany=random(1,16);
                        ranz=random(1,16);}
                    if(ranselect==1){
                        ranx=random(1,16);
                        rany=0;
                        ranz=random(1,16);}
                    if(ranselect==2){
                        ranx=random(1,16);
                        rany=random(1,16);
                        ranz=0;}     

                    side_select=random(3);

                    if(top==1){//                 TOP
                        top=0; 
                        if(side==0){//top to left
                            left=1;
                            if(side_select==0) side=2;
                            if(side_select==1) side=3;
                            //if(side_select==2) side=4;
                            if(side_select==2) side=5;} else    
                                if(side==1){//top to right
                                    right=1;
                                    if(side_select==0) side=5;
                                    if(side_select==1) side=2;
                                    if(side_select==2) side=3;
                                    //if(side_select==3) side=4;
                                } else  
                                    if(side==2){//top to back
                                        back=1;
                                        if(side_select==0) side=0;
                                        if(side_select==1) side=1;
                                        if(side_select==2) side=5;
                                        //if(side_select==3) side=4;
                                    } else      
                                        if(side==3){//top to front
                                            front=1;
                                            if(side_select==0) side=0;
                                            if(side_select==1) side=1;
                                            if(side_select==2) side=5;
                                            //if(side_select==3) side=4;
                                        }   
                    } else//top
                        if(bot==1){//                 BOTTOM
                            bot=0; 
                            if(side==0){//bot to left
                                left=1;
                                if(side_select==0) side=2;
                                if(side_select==1) side=3;
                                if(side_select==2) side=4;
                                //if(side_select==3) side=5;
                            } else    
                                if(side==1){//bot to right
                                    right=1;
                                    //if(side_select==0) side=5;
                                    if(side_select==0) side=2;
                                    if(side_select==1) side=3;
                                    if(side_select==2) side=4;} else  
                                        if(side==2){//bot to back
                                            back=1;
                                            if(side_select==0) side=0;
                                            if(side_select==1) side=1;
                                            //if(side_select==2) side=5;
                                            if(side_select==2) side=4;} else      
                                                if(side==3){//bot to front
                                                    front=1;
                                                    if(side_select==0) side=0;
                                                    if(side_select==1) side=1;
                                                    //if(side_select==2) side=5;
                                                    if(side_select==2) side=4;}   
                        } else//bot
                            if(right==1){//                 RIGHT
                                right=0; 
                                if(side==4){//right to top
                                    top=1;
                                    if(side_select==0) side=2;
                                    if(side_select==1) side=3;
                                    if(side_select==2) side=0;
                                    //if(side_select==3) side=1;
                                } else    
                                    if(side==5){//right to bot
                                        bot=1;
                                        if(side_select==0) side=0;
                                        if(side_select==1) side=2;
                                        if(side_select==2) side=3;
                                        //if(side_select==3) side=1;
                                    } 
                                    else  
                                        if(side==2){//right to back
                                            back=1;
                                            if(side_select==0) side=0;
                                            //if(side_select==1) side=1;
                                            if(side_select==1) side=5;
                                            if(side_select==2) side=4;} else      
                                                if(side==3){//right to front
                                                    front=1;
                                                    if(side_select==0) side=0;
                                                    //if(side_select==1) side=1;
                                                    if(side_select==1) side=5;
                                                    if(side_select==2) side=4;}   
                            } else//bot
                                if(left==1){//                 LEFT
                                    left=0; 
                                    if(side==4){//left to top
                                        top=1;
                                        //if(side_select==0) side=2;
                                        if(side_select==0) side=3;
                                        if(side_select==1) side=2;
                                        if(side_select==2) side=1;} else    
                                            if(side==5){//left to bot
                                                bot=1;
                                                //if(side_select==0) side=0;
                                                if(side_select==0) side=2;
                                                if(side_select==1) side=3;
                                                if(side_select==2) side=1;} else  
                                                    if(side==2){//left to back
                                                        back=1;
                                                        //if(side_select==0) side=0;
                                                        if(side_select==0) side=1;
                                                        if(side_select==1) side=5;
                                                        if(side_select==2) side=4;} else      
                                                            if(side==3){//left to front
                                                                front=1;
                                                                //if(side_select==0) side=0;
                                                                if(side_select==0) side=1;
                                                                if(side_select==1) side=5;
                                                                if(side_select==2) side=4;}   
                                } else//bot
                                    if(front==1){//                 front
                                        front=0; 
                                        if(side==4){//front to top
                                            top=1;
                                            if(side_select==0) side=2;
                                            //if(side_select==1) side=3;
                                            if(side_select==1) side=0;
                                            if(side_select==2) side=1;} else    
                                                if(side==5){//front to bot
                                                    bot=1;
                                                    if(side_select==0) side=0;
                                                    if(side_select==1) side=2;
                                                    //if(side_select==2) side=3;
                                                    if(side_select==2) side=1;} else  
                                                        if(side==0){//front to left
                                                            left=1;
                                                            if(side_select==0) side=2;
                                                            // if(side_select==1) side=3;
                                                            if(side_select==1) side=5;
                                                            if(side_select==2) side=4;} else      
                                                                if(side==1){//front to right
                                                                    right=1;
                                                                    if(side_select==0) side=2;
                                                                    // if(side_select==1) side=3;
                                                                    if(side_select==1) side=5;
                                                                    if(side_select==2) side=4;}   
                                    } else//bot
                                        if(back==1){//                 back
                                            back=0; 
                                            if(side==4){//back to top
                                                top=1;
                                                //if(side_select==0) side=2;
                                                if(side_select==0) side=3;
                                                if(side_select==1) side=0;
                                                if(side_select==2) side=1;} else    
                                                    if(side==5){//back to bot
                                                        bot=1;
                                                        if(side_select==0) side=0;
                                                        //if(side_select==1) side=2;
                                                        if(side_select==1) side=3;
                                                        if(side_select==2) side=1;} else  
                                                            if(side==0){//back to left
                                                                left=1;
                                                                //if(side_select==0) side=2;
                                                                if(side_select==0) side=3;
                                                                if(side_select==1) side=5;
                                                                if(side_select==2) side=4;} else      
                                                                    if(side==1){//back to right
                                                                        right=1;
                                                                        //if(side_select==0) side=2;
                                                                        if(side_select==0) side=3;
                                                                        if(side_select==1) side=5;
                                                                        if(side_select==2) side=4;}   
                                        } //bot


                    for(xx=0; xx<8; xx++){
                        oldpullback[xx]=0;
                        pullback[xx]=0;}

                    folderaddr[0]=-8;
                    folderaddr[1]=-7;
                    folderaddr[2]=-6;
                    folderaddr[3]=-5;
                    folderaddr[4]=-4;
                    folderaddr[5]=-3;
                    folderaddr[6]=-2;
                    folderaddr[7]=-1;

                }//pullback==7
            }//folderaddr==7    

            if(folderaddr[7]!=7)
                for(zz=0; zz<8; zz++)
                    folderaddr[zz] = folderaddr[zz]+1;

            return 40;
        }
    }

    function AnimationWipeOut(){
        var xxx=0, yyy=0, zzz=0;
        var fx=random(8), fy=random(8), fz=random(8), direct, fxm=1, fym=1, fzm=1, fxo=0, fyo=0, fzo=0;
        var ftx=random(8), fty=random(8), ftz=random(8), ftxm=1, ftym=1, ftzm=1, ftxo=0, ftyo=0, ftzo=0;
        var select, rr, gg, bb, rrt, ggt, bbt;

        select=random(3);
        if(select==0){
            rr=random(1, 16);
            gg=random(1, 16);
            bb=0;} 
        if(select==1){
            rr=random(1, 16);
            gg=0;
            bb=random(1, 16);}    
        if(select==2){
            rr=0;
            gg=random(1, 16);
            bb=random(1, 16);}

        select=random(3);
        if(select==0){
            rrt=random(1, 16);
            ggt=random(1, 16);
            bbt=0;} 
        if(select==1){
            rrt=random(1, 16);
            ggt=0;
            bbt=random(1, 16);}    
        if(select==2){
            rrt=0;
            ggt=random(1, 16);
            bbt=random(1, 16);}  

        return function () {

            LED(fxo, fyo, fzo, 0, 0, 0);
            LED(fxo, fyo, fzo+1, 0, 0, 0);
            LED(fxo, fyo, fzo-1, 0, 0, 0);
            LED(fxo+1, fyo, fzo, 0, 0, 0);
            LED(fxo-1, fyo, fzo, 0, 0, 0);
            LED(fxo, fyo+1, fzo, 0, 0, 0);
            LED(fxo, fyo-1, fzo, 0, 0, 0);

            LED(ftxo, ftyo, ftzo, 0, 0, 0);
            LED(ftxo, ftyo, ftzo+1, 0, 0, 0);
            LED(ftxo, ftyo, ftzo-1, 0, 0, 0);
            LED(ftxo+1, ftyo, ftzo, 0, 0, 0);
            LED(ftxo-1, ftyo, ftzo, 0, 0, 0);
            LED(ftxo, ftyo+1, ftzo, 0, 0, 0);
            LED(ftxo, ftyo-1, ftzo, 0, 0, 0);

            LED(ftx, fty, ftz, rr, gg, bb);
            LED(ftx, fty, ftz+1, rr, gg, bb);
            LED(ftx, fty, ftz-1,  rr, gg, bb);
            LED(ftx+1, fty, ftz, rr, gg, bb);
            LED(ftx-1, fty, ftz, rr, gg, bb);
            LED(ftx, fty+1, ftz, rr, gg, bb);
            LED(ftx, fty-1, ftz, rr, gg, bb);     

            LED(fx, fy, fz, rrt, ggt, bbt);
            LED(fx, fy, fz+1, rrt, ggt, bbt);
            LED(fx, fy, fz-1, rrt, ggt, bbt);
            LED(fx+1, fy, fz, rrt, ggt, bbt);
            LED(fx-1, fy, fz, rrt, ggt, bbt);
            LED(fx, fy+1, fz, rrt, ggt, bbt);
            LED(fx, fy-1, fz, rrt, ggt, bbt);  

            fxo=fx;
            fyo=fy;
            fzo=fz; 

            ftxo=ftx;
            ftyo=fty;
            ftzo=ftz; 

            direct=random(3);
            if(direct==0)
                fx= fx+fxm;
            if(direct==1)
                fy= fy+fym;  
            if(direct==2)
                fz= fz+fzm;  
            if(fx<0){
                fx=0; fxm=1;}
            if(fx>7){
                fx=7; fxm=-1;}  
            if(fy<0){
                fy=0; fym=1;}
            if(fy>7){
                fy=7; fym=-1;}    
            if(fz<0){
                fz=0; fzm=1;}
            if(fz>7){
                fz=7; fzm=-1;}  

            direct=random(3);
            if(direct==0)
                ftx= ftx+ftxm;
            if(direct==1)
                fty= fty+ftym;  
            if(direct==2)
                ftz= ftz+ftzm;  
            if(ftx<0){
                ftx=0; ftxm=1;}
            if(ftx>7){
                ftx=7; ftxm=-1;}  
            if(fty<0){
                fty=0; ftym=1;}
            if(fty>7){
                fty=7; ftym=-1;}    
            if(ftz<0){
                ftz=0; ftzm=1;}
            if(ftz>7){
                ftz=7; ftzm=-1;} 

            return 100;
        }
    }

    function AnimationBouncy(){
        var wipex, wipey, wipez, ranr, rang, ranb, select, oldx=[], oldy=[], oldz=[];
        var x=[], y=[], z=[], addr, ledcount=20, direct, direcTwo;
        var xx=[], yy=[], zz=[];
        var xbit=1, ybit=1, zbit=1;

        for(addr=0; addr<ledcount+1; addr++){
            oldx[addr]=0;
            oldy[addr]=0;
            oldz[addr]=0;
            x[addr]=0;
            y[addr]=0;
            z[addr]=0;
            xx[addr]=0;
            yy[addr]=0;
            zz[addr]=0;
        }

        return function () {
            direct = random(3);

            for(addr=1; addr<ledcount+1; addr++){
                LED(oldx[addr], oldy[addr],oldz[addr], 0,0,0);
                LED(x[addr], y[addr], z[addr], xx[addr],yy[addr],zz[addr]);
            }

            for(addr=1; addr<ledcount+1; addr++){
                oldx[addr]=x[addr];
                oldy[addr]=y[addr];
                oldz[addr]=z[addr];
            }

            if(direct==0)
                x[0]= x[0]+xbit;
            if(direct==1)
                y[0]= y[0]+ybit;
            if(direct==2)
                z[0]= z[0]+zbit;

            if(direct==3)
                x[0]= x[0]-xbit;
            if(direct==4)
                y[0]= y[0]-ybit;
            if(direct==5)
                z[0]= z[0]-zbit;

            if(x[0]>7){
                xbit=-1;
                x[0]=7;
                xx[0]=random(16);
                yy[0]=random(16);
                zz[0]=0;
            }
            if(x[0]<0){
                xbit=1;
                x[0]=0;
                xx[0]=random(16);
                yy[0]=0;
                zz[0]=random(16);
            }
            if(y[0]>7){
                ybit=-1;
                y[0]=7;
                xx[0]=0;
                yy[0]=random(16);
                zz[0]=random(16);
            }
            if(y[0]<0){
                ybit=1;
                y[0]=0;
                xx[0]=0;
                yy[0]=random(16);
                zz[0]=random(16);
            }
            if(z[0]>7){
                zbit=-1;
                z[0]=7;
                xx[0]=random(16);
                yy[0]=0;
                zz[0]=random(16);
            }
            if(z[0]<0){
                zbit=1;
                z[0]=0;
                xx[0]=random(16);
                yy[0]=random(16);
                zz[0]=0;
            }

            for(addr=ledcount; addr>0; addr--){
                x[addr]=x[addr-1];
                y[addr]=y[addr-1];
                z[addr]=z[addr-1];
                xx[addr]=xx[addr-1];
                yy[addr]=yy[addr-1];
                zz[addr]=zz[addr-1];
            }

            return 100;
        }
    }

    function AnimationColorWheel(){
        var xx=0, yy=0, zz=0, ranx, rany, ranz, select, swiper;
        var delay = 100;

        var randomize = function () {
            swiper=random(6);

            x = 0;
            y = 0;
            z = 0;

            if (swiper == 3) {
                yy = 7;
            } else if (swiper == 4) {
                xx = 7;
            } else if (swiper == 5) {
                zz = 7;
            }

            select=random(3);
            if(select==0){
                ranx=0;
                rany=random(16);
                ranz=random(16);}
            if(select==1){
                ranx=random(16);
                rany=0;
                ranz=random(16);}   
            if(select==2){
                ranx=random(16);
                rany=random(16);
                ranz=0;}  
        };

        randomize();

        return function () {
            if(swiper==0){
                if(yy<8){//left to right
                    for(xx=0;xx<8;xx++){
                        for(zz=0;zz<8;zz++){
                            LED(xx, yy, zz,  ranx, ranz, rany);
                        }
                    }

                    yy++;
                    return delay;
                }
            } else if(swiper==1){//bot to top
                if(xx<8){
                    for(yy=0;yy<8;yy++){
                        for(zz=0;zz<8;zz++){
                            LED(xx, yy, zz,  ranx, ranz, rany);
                        }
                    }

                    xx++;
                    return delay;
                }
            } else if(swiper==2){//back to front
                if(zz<8){
                    for(xx=0;xx<8;xx++){
                        for(yy=0;yy<8;yy++){
                            LED(xx, yy, zz,  ranx, ranz, rany);
                        }
                    }
                    zz++;
                    return delay;
                }

                randomize();
            } else if(swiper==3){
                if(yy>=0){//right to left
                    for(xx=0;xx<8;xx++){
                        for(zz=0;zz<8;zz++){
                            LED(xx, yy, zz,  ranx, ranz, rany);
                        }
                    }
                    yy--;
                    return delay;
                }

                randomize();
            } else if(swiper==4){//top to bot
                if(xx>=0){
                    for(yy=0;yy<8;yy++){
                        for(zz=0;zz<8;zz++){
                            LED(xx, yy, zz,  ranx, ranz, rany);
                        }
                    }
                    xx--;
                    return delay;
                }

                randomize();
            } else if(swiper==5){//front to back
                if (zz>=0){
                    for(xx=0;xx<8;xx++){
                        for(yy=0;yy<8;yy++){
                            LED(xx, yy, zz,  ranx, ranz, rany);
                        }
                    }
                    zz--;
                    return delay;
                }
            }

            randomize();

            return 0;
        }
    }

    return {
        'SineWave':     AnimationSineWave
        , 'Rain':       AnimationRain
        , 'Folder':     AnimationFolder
        , 'WipeOut':    AnimationWipeOut
        , 'Bouncy':     AnimationBouncy
        , 'ColorWheel': AnimationColorWheel
    }
}();
