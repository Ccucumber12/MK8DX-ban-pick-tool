let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

function canvasResize() {
    // canvas.width = Math.min(window.innerWidth, window.innerHeight * 16 / 9)
    // canvas.height = canvas.width * 9 / 16
    canvas.width = 3840
    canvas.height = 2160
}
canvasResize()
// window.onresize = canvasResize()

function oMousePosScaleCSS(canvas, event) {
    let ClientRect = canvas.getBoundingClientRect()
    let scaleX = canvas.width / ClientRect.width
    let scaleY = canvas.height / ClientRect.height
    return {
        x: (event.clientX - ClientRect.left) * scaleX, 
        y: (event.clientY - ClientRect.top) * scaleY 
    }
}

let current_focus = -1
const button_texts = ["BAN", "Player1", "Player2", "Player3", "Player4"]
const button_idle_colors = ["#E0E0E0", "#FFCCCC", "#CCFFCC", "#CCE5FF", "#E5CCFF"]
const button_focus_colors = ["#808080", "#FF6666", "#00D000", "#66B2FF", "#B266FF"]

const n_row = 6
const n_col = 8


var imgWidth = canvas.width / n_col
var imgHeight = imgWidth * 277 / 404 // ratio of image

// Course Buttons
let courses = []
for (let i = 0; i<n_row; i++) {
    for (let j=0; j<n_col; j++) {
        courses.push(new CourseTile(imgWidth * j, imgHeight * i, imgWidth, imgHeight, imgSources[i*n_col+j]))
    }
}


// Select Buttons
const bottomHeight = (canvas.height - imgHeight * n_row) * 0.9
const bottomRectY = canvas.height - bottomHeight

// Draw bottom Rect
c.fillStyle = '#d6d6d6'

const grd = c.createLinearGradient(0, bottomRectY, 0, canvas.height);
grd.addColorStop(0, '#b8b8b8');
grd.addColorStop(1, '#d6d6d6');

// Fill with gradient
c.fillStyle = grd;
c.fillRect(0, bottomRectY, canvas.width, canvas.height)

// Draw bottom line
c.beginPath()
c.moveTo(0, bottomRectY)
c.lineTo(canvas.width, bottomRectY)
c.strokeStyle = "#8cc8ff"
c.lineWidth = 6
c.stroke()

let buttons = []
const buttonHeight = bottomHeight * 0.7
const buttonWidth = Math.min(500, canvas.width / 6)
const gap = (canvas.width - buttonWidth * 5) / 6
const buttonY = bottomRectY + (bottomHeight - buttonHeight) / 2

for (let i = 0; i < 5; i++) {
    const buttonX = gap*(i+1) + buttonWidth*i
    buttons.push(new TextButton(buttonX, buttonY, buttonWidth, buttonHeight, i))
}


canvas.addEventListener('click', (event) => {
    let m = oMousePosScaleCSS(canvas, event)

    courses.forEach(b => {
        if (b.inBound(m.x, m.y) && b.onClick) b.onClick()
    })

    buttons.forEach(b => {
        if (b.inBound(m.x, m.y) && b.onClick) {
            b.onClick()
        } else {
            b.releaseFocus()
        }
    })
})