let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

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


// Constants
let current_focus = -1
var button_texts = ["BAN", "Player1", "Player2", "Player3", "Player4"]
const button_idle_colors = ["#E0E0E0", "#FFCCCC", "#CCFFCC", "#CCE5FF", "#E5CCFF"]
const button_focus_colors = ["#808080", "#FF6666", "#00D000", "#66B2FF", "#B266FF"]

const n_row = 6
const n_col = 8

const imgWidth = canvas.width / n_col
const imgHeight = imgWidth * 277 / 404 // ratio of image


// Get URL parameter
const urlParams = new URLSearchParams(window.location.search)
button_texts[1] = urlParams.get('p1') || button_texts[1]
button_texts[2] = urlParams.get('p2') || button_texts[2]
button_texts[3] = urlParams.get('p3') || button_texts[3]
button_texts[4] = urlParams.get('p4') || button_texts[4]


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

const grd = c.createLinearGradient(0, bottomRectY, 0, canvas.height)
grd.addColorStop(0, '#b8b8b8')
grd.addColorStop(1, '#d6d6d6')

// Fill with gradient
c.fillStyle = grd
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
const buttonWidth = Math.min(450, canvas.width / 7)
const buttonStartX = buttonWidth * 1.2
const gap = (canvas.width - buttonStartX - buttonWidth * 5) / 6
const buttonY = bottomRectY + (bottomHeight - buttonHeight) / 2

for (let i = 0; i < 5; i++) {
    const buttonX = buttonStartX + gap*i + buttonWidth*i
    buttons.push(new TextButton(buttonX, buttonY, buttonWidth, buttonHeight, i))
}

// Reset Button
resetButton = new ResetButton(buttonStartX * 0.35, buttonY, buttonHeight, "./images/reset.png")
randomButton = new RandomButton(buttonStartX * 0.35, buttonY, buttonHeight, "./images/random.png", true)

canvas.addEventListener('click', (event) => {
    let m = oMousePosScaleCSS(canvas, event)

    courses.forEach(b => {
        if (b.inBound(m.x, m.y) && b.onClick) b.onClick()
    })

    var isFocused = false
    buttons.forEach(b => {
        if (b.inBound(m.x, m.y) && b.onClick) {
            b.onClick()
            isFocused = true
        } else {
            b.releaseFocus()
        }
    })
    if (randomButton.inBound(m.x, m.y) && randomButton.onClick) {
        randomButton.onClick()
    }
    if (resetButton.inBound(m.x, m.y) && resetButton.onClick) {
        resetButton.onClick()
    }

    if (!isFocused)
        current_focus = -1
    if (isFocused) {
        resetButton.hide()
        randomButton.show()
    } else {
        resetButton.show()
        randomButton.hide()
    }
})