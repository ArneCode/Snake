function runSnake() {
  let canvas = document.getElementById("canvas")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  let ctx = canvas.getContext("2d")
  let cellsize = 50
  let gridwidth = Math.round(window.innerWidth / cellsize)
  let gridheight = Math.round(window.innerHeight / cellsize)
  let grid = Array.from({
    length: gridheight
  }, x => new Array(gridwidth).fill(null))
  let posx = Math.floor(gridwidth / 2)
  let posy = Math.floor(gridheight / 2)

  let snakehead = new Snakesegment(null, posx, posy, grid)
  let nextseg=snakehead
  let snakelength=5
  for(let i=0;i<snakelength;i++){
  nextseg = new Snakesegment(nextseg, posx - (i+1), posy, grid)
    
    }
  let snakend = new Snakesegment(nextseg, posx - snakelength, posy, grid)
  let food
  generateFood()
  let snakedirx = [0]
  let snakediry = [1]
  canvas.addEventListener("click", changeDir)
//  canvas.addEventListener("mousedown", changeDir)
  //canvas.addEventListener("mouseup", changeDir)
  
  update()

  function changeDir(e) {
    let posX = e.clientX - window.innerWidth / 2
    let posY = e.clientY - window.innerHeight / 2

    if (posX > 0) {
      if (posY > posX && snakediry != -1) {
        snakedirx.push(0);
        snakediry.push(1)
      } else if (posY * -1 > posX && snakediry != 1) {
        snakedirx.push(0);
        snakediry.push(-1)

      } else if (snakedirx != -1) {
        snakedirx.push(1);
        snakediry.push(0)

      }
    } else {
      if (posY < posX && snakediry != 1) {
        snakedirx.push(0);
        snakediry.push(-1)

      } else if (posY * -1 < posX && snakediry != -1) {
        snakedirx.push(0);
        snakediry.push(1)

      } else if (snakedirx != 1) {
        snakedirx.push(-1);
        snakediry.push(0)

      }
    }
    console.log(snakedirx, snakediry)
  }

  function update(collided=false) {
    let dead = false
    if (snakedirx.length > 1) {
      snakedirx.shift() 
      snakediry.shift()
    }

    posx += snakedirx[0]
    posy += snakediry[0]
    if (posx > gridwidth - 1) {
      posx = 0
    }
    if (posy > gridheight - 1) {
      posy = 0
    }
    if (posx < 0) {
      posx = gridwidth - 1
    }
    if (posy < 0) {
      posy = gridheight - 1
    }


    if (grid[posy][posx] != null) {
      if (grid[posy][posx].type == "snake") {
        dead = true
        alert("dead")
        runSnake()
      } else if (grid[posy][posx].type == "food") {
        generateFood()
      }
    } else {
      snakend.delete(grid)
      snakend = snakend.next
    }
    let newhead = new Snakesegment(null, posx, posy, grid)
    snakehead.next = newhead
    snakehead = newhead

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let curr_to_draw = snakend
    while (curr_to_draw != null) {
      drawPart(curr_to_draw)
      curr_to_draw = curr_to_draw.next
    }
    drawPart(food, true)
    if (!dead) {
      setTimeout(update, 100)
    }
  }

  function drawPart(p, isFood = false) {
    ctx.beginPath();
    ctx.rect(p.posx * cellsize, p.posy * cellsize, cellsize, cellsize);
    if (isFood) {
      ctx.stroke()
    } else {
      ctx.fill();
    }
  }

  function generateFood() {
    let posx, posy
    do {
      posx = Math.floor(Math.random() * gridwidth)
      posy = Math.floor(Math.random() * gridheight)
    } while (grid[posy][posx] != null)

    food = {
      posx,
      posy,
      type: "food"
    }
    grid[posy][posx] = food
  }
}
class Snakesegment {
  constructor(next, posx, posy, grid) {
    this.next = next
    this.posx = posx
    this.posy = posy
    grid[posy][posx] = this
    this.type = "snake"
  }
  delete(grid) {
    grid[this.posy][this.posx] = null
  }
}
