9// 属性   哪些字母、个数、关卡、速度、位置、生命值、分数
// 方法
// 1.产生字符：
// 2.下落：
// 3.摁键盘时消除字母：
// 4.重新开始
// 5.下一关
// <!--通过构造函数去写-->
    function Game(){
    // 属性
        // 1.能产生那些字符
        this.charArr=[['Q','img/Q.png'],
            ['W','img/W.png'],
            ['E','img/E.png'],
            ['R','img/R.png'],
            ['T','img/T.png'],
            ['Y','img/Y.png'],
            ['U','img/U.png'],
            ['I','img/I.png'],
            ['O','img/O.png'],
            ['P','img/P.png'],
            ['A','img/A.png'],
            ['S','img/S.png'],
            ['D','img/D.png'],
            ['F','img/F.png'],
            ['G','img/G.png'],
            ['H','img/H.png'],
            ['J','img/J.png'],
            ['K','img/K.png'],
            ['L','img/L.png'],
            ['Z','img/Z.png'],
            ['X','img/X.png'],
            ['C','img/C.png'],
            ['V','img/V.png'],
            ['B','img/B.png'],
            ['N','img/N.png'],
            ['M','img/M.png']
    ];
        // 2.写多少个字母//页面中的元素
        this.current=[];
        // 3.页面中产生多少字母//几个元素
         this.number=3;
        // 4.速度
        this.drop=1;
        this.fenshu=10;
        this.positio=[];
        this.gk=1;
        this.score=0;
        this.scoreover=document.querySelector('.overbox>span:nth-of-type(1)');
        this.scorebast=document.querySelector('.overbox>span:nth-of-type(2)');
        this.life=5;
        this.lifeimg=document.querySelector('.progress');
        this.lifeObj=document.querySelector('.lift>span');
        this.scoreObj=document.querySelector('.score>span');
        this.gks=document.querySelector('.gk1');
        this.overbox=document.querySelector('.overbox');
}

// 方法：
Game.prototype={
 // 产生若干个元素
    getChars:function(){
        for(let i=0;i<this.number;i++){
            this.getChar();
            this.speed();
            this.keya();
        }
},
    easy:function(){
        for(let i=0;i<this.number;i++){
            this.getChar();
            this.speed();
            this.keya();
        }
    },
    medium:function () {
        this.drop=3;
        this.number=4;
        for(let i=0;i<this.number;i++){
            this.getChar();
            this.speed();
            this.keya();
        }
    },
    hard:function () {
        this.drop=3;
        this.number=5;
        for(let i=0;i<this.number;i++){
            this.getChar();
            this.speed();
            this.keya();
        }
    },
    //块不会重复
    check:function(lefts){//left为新产生的
        let flds=this.positio.some(function (value) {
            return Math.abs(value-lefts)<60
        });
        return flds;
    },
    // 字母的去重
    checkchar:function(char){
        return this.current.some(element=>{
            return  element.innerText == char
        })
    },
// 产生一个元素
    getChar:function(){
          // 设置元素
        let divs=document.createElement('div');
        // 随机选取charArr的下标
        let num=Math.floor(Math.random()*this.charArr.length);
        while(this.checkchar(this.charArr[num][0])){
            num=Math.floor(Math.random()*this.charArr.length)
        }
        divs.innerHTML=this.charArr[num][0];
        divs.classList.add('char');
        let tops=Math.random()*100;
        let lefts=(innerWidth-400)*Math.random()+200;
        while (this.check(lefts,this.positio)){
            lefts=Math.random()*(innerWidth-400)+200;
        }
        divs.style.cssText=`
        top:${tops}px;left:${lefts}px;
        background-image:url(${this.charArr[num][1]});
        font-size:0;
        `;
        document.body.appendChild(divs);
        this.current.push(divs);
        this.positio.push(lefts);

    },
    // 下落
    speed:function(){
        let that=this;
           that .st=setInterval(function(){
            for(let i=0;i<that.current.length;i++){
                let tops=that.current[i].offsetTop+that.drop;
                that.current[i].style.top=`${tops}px`;
                if(tops>=500){
                    document.body.removeChild(that.current[i]);
                    that.current.splice(i,1);
                    that.positio.splice(i,1);
                    that.life--    ;
                    let zhi=that.life*20+"%";
                    that.lifeimg.style.backgroundSize=zhi+" 100%";
                    that.lifeObj.innerText=that.life;
                    that.getChar();
                    if(that.life <= 0){
                        let bb=confirm('是否要退出游戏');
                        for (let i=0;i<that.current.length;i++){
                            console.log(that);
                            document.body.removeChild(that.current[i]);
                        }
                        if(bb){
                            prompt('请输入名字');
                            close()
                        }else{
                            that.gameover()
                        }
                    }
                }
            }
        },300)

    },
// 键盘消除
    keya:function(){
        let that=this;
        document.onkeydown=function(e){
            for (let i=0;i<that.current.length;i++){
                if(that.current[i].innerText == String.fromCharCode(e.keyCode)){
                document.body.removeChild(that.current[i]);
                    that.current.splice(i,1);
                    that.positio.splice(i,1);
                    that.score++;
                    that.scoreObj.innerText=that.score;
                    that.getChar();
                    if(that.score==that.fenshu){
                        that.gk++;
                        that.gks.innerText=that.gk;
                        that.number++;
                        that.next();
                        that.fenshu+=10;
                        that.score=0;
                    }
                 }
            }
        }
    },
    // 游戏暂停
    pause1:function(){
        clearInterval(this.st);
        console.log(this.st);
        document.onkeydown=null;
        for(let i=0;i<this.current.length;i++) {
            let tops = this.current[i].offsetTop;
            this.current[i].style.top = `${tops}px`;
        }
        this.drop=0;
    },
    // 游戏的继续
    play:function(){
        this.speed();
        this.keya();
        this.drop=1;
    },
    //游戏结束
    gameover:function(){
        clearInterval(this.st);
        this.overbox.style.display='block';
        this.scoreObj.innerText=0;
        this.scoreover.innerText=this.score;
        this.current.length=0;
        this.positio.length=0;
        this.number=3;
        this.gk=1;
        this.drop=1;
        this.life=5;
        this.lifeimg.style.backgroundSize=this.life*20+"%"+" 100%";

    },
    //清空页面中字母
    trim:function(){
        that=this
        for (let i=0;i<that.current.length;i++){
            document.body.removeChild(that.current[i]);
        }
    },
    // 关卡
    next:function(){
        clearInterval(this.t);
        for (let i=0;i<this.current.length;i++){
            document.body.removeChild(this.current[i]);
        }
        this.scoreObj.innerText=0;
        this.current.length=0;
        this.positio.length=0;
        this.number++;
        this.getChars()
    },
    // 重新开始,
    restart:function(){
        clearInterval(this.t);
        for (let i=0;i<this.current;i++){
            document.body.removeChild(this.current[i]);
        }
        this.current.length=0;
        this.positio.length=0;
        this.number=3;
        this.fenshu=10;
        this.life=5;
        this.score=0;
        this.drop=1;
        this.gk=1;
        this.getChars()
    }












    }

