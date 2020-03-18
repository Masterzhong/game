(function () {
  let canvas = document.getElementById('canvas');
  let tag
  class game {
    constructor(canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.canvas = canvas
      this.ctx = canvas.getContext("2d");
      this.speed = 50;
      this.point = 0;
      this.over = false;
      this.pre = null;//储存蛇头坐标
      this.snake = {
        px: 15,//像素大小
        color: 'rgba(0,0,0)',
        direct: 'ArrowRight',//方向
        body: [
          { x: 100, y: 100 },
          { x: 85, y: 100 },
          { x: 70, y: 100 },
          { x: 55, y: 100 },
        ]
      }
      this.food = {
        px: 20,
        color: 'rgba(142,229,238)',
        x: 0,
        y: 0,
      }
      this.init()
      this.changeDirect()
      this.createFood(this.food.x, this.food.y);
      tag = setInterval(() => { this.move();this.eat() }, this.speed)
      this.move()
    }

    init() {
      this.food.x = this.rand(0, this.canvas.width);
      this.food.y = this.rand(0, this.canvas.height);
      this.snake.body.forEach(val => {
        this.draw(this.snake.color, val.x, val.y, this.snake.px)
      })

    }

    //随机创建食物
    createFood(x, y) {
      this.ctx.fillStyle = this.food.color;
      this.ctx.fillRect(x, y, this.food.px, this.food.px);
      this.ctx.beginPath();
    }

    //吃食物
    eat() {
      if ((this.snake.body[0].x >= this.food.x - (this.food.px ) && this.snake.body[0].x <= this.food.x + (this.food.px )) && (this.snake.body[0].y >= this.food.y - (this.food.px ) && this.snake.body[0].y <= this.food.y + (this.food.px ))) {
        this.ctx.clearRect(this.food.x, this.food.y, this.food.px+2, this.food.px+2);
        this.snake.body.push({x:this.food.x,y:this.food.y})
        this.food.x = this.rand(0, this.canvas.width);
        this.food.y = this.rand(0, this.canvas.height);
        this.createFood(this.food.x,this.food.y);
        this.getpoint();
      }
    }

    //得分
    getpoint(){
      this.point++
      var pointHtml = document.getElementsByClassName('point')[0]
      pointHtml.innerHTML = `得分:${this.point}`
      if(this.speed>=10){//难度逐级递增
        this.speed--
      }
    }

    //设置随机范围
    rand(min, max) { return Math.random() * (max - min) + min; }

    //画点
    draw(color, x, y, r) {
      if (x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, r, r);
        this.ctx.beginPath();
      } else {
        this.over = true
        this.gameover()
      }
    }

    //绘制蛇身
    snakeBody() {
      var tmp
      this.draw(this.snake.color, this.snake.body[0].x, this.snake.body[0].y, this.snake.px)
      for (var i = 1; i < this.snake.body.length; i++) {
        tmp = this.snake.body[i];
        this.snake.body[i] = this.pre;
        this.pre = tmp;
        this.draw(this.snake.color, this.snake.body[i].x, this.snake.body[i].y, this.snake.px)
      }
    }
   
    //蛇的头部碰到蛇的身体检测
     touchbody(){
       var x = this.snake.body[0].x
       var y = this.snake.body[0].y
       for(var i = 3; i<this.snake.body.length; i++){
          if(x == this.snake.body[i].x&&y == this.snake.body[i].y){
               this.over = true;
               this.gameover();
               break;
          }
       }
     }

    //蛇移动
    move() {
      var lastx = this.snake.body[this.snake.body.length - 1].x
      var lasty = this.snake.body[this.snake.body.length - 1].y
      this.ctx.clearRect(lastx, lasty, this.snake.px + 1, this.snake.px + 1);
      
      //检测是否碰到蛇身体
      switch (this.snake.direct) {
        case 'ArrowUp':
          this.pre = this.snake.body[0]
          this.snake.body[0] = { x: this.pre.x, y: this.pre.y - this.snake.px }
          this.snakeBody()
          break;
        case 'ArrowDown':
          this.pre = this.snake.body[0]
          this.snake.body[0] = { x: this.pre.x, y: this.pre.y + this.snake.px }
          this.snakeBody()
          break;
        case 'ArrowRight':
          this.pre = this.snake.body[0]
          this.snake.body[0] = { x: this.pre.x + this.snake.px, y: this.pre.y }
          this.snakeBody()
          break;
        case 'ArrowLeft':
          this.pre = this.snake.body[0]
          this.snake.body[0] = { x: this.pre.x - this.snake.px, y: this.pre.y }
          this.snakeBody()
          break;
      }
      this.touchbody();
    }

    //改变方向
    changeDirect() {
      window.addEventListener('keydown', e => {
        switch (e.code) {
          case 'ArrowUp':
              if(this.snake.direct != 'ArrowDown'){
                this.snake.direct = e.code
              }
            break;
          case 'ArrowDown':
              if(this.snake.direct != 'ArrowUp'){
                this.snake.direct = e.code
              }
            break;
          case 'ArrowRight':
              if(this.snake.direct != 'ArrowLeft'){
                this.snake.direct = e.code
              }
            break;
          case 'ArrowLeft':
              if(this.snake.direct != 'ArrowRight'){
                this.snake.direct = e.code
              }
            break;
        }
        
      })
    }

    //游戏结束
    gameover() {
      if (this.over) {
        clearInterval(tag)
        alert('游戏结束')
      }
    }
  }

  new game(canvas)
})()
