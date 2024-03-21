function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '')
  if (hex.length !== 6)
    throw new Error('Invalid hex color format')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}


function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}


class Button {
    constructor(x1, y1, width, height) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x1 + width
        this.y2 = y1 + height
        this.width = width
        this.height = height
    }

    inBound(mouseX, mouseY) {
        return !(mouseX < this.x1 || mouseX > this.x2 || mouseY < this.y1 || mouseY > this.y2)
    }

    onClick() {
        console.log('Button clicked!')
    }
}


class CourseButton extends Button {
    constructor(x1, y1, width, height, imgSrc) {
        super(x1, y1, width, height)
        this.color_img = new Image()
        this.gray_img = new Image()
        this.color_img.src = imgSrc
        this.gray_img.src = imgSrc.replace('.png', '-grayscale.png')

        this._isPicked = null
        this.load_counter = 0
        this.color_img.addEventListener('load', () => this.initDraw())
        this.gray_img.addEventListener('load', () => this.initDraw())
    }

    get isPicked() {
        if (this._isPicked === null) {
            this._isPicked = parseInt(window.localStorage.getItem(this.color_img.src))
            if (isNaN(this._isPicked))
                this._isPicked = -1
        }
        return this._isPicked
    }

    set isPicked(value) {
        window.localStorage.setItem(this.color_img.src, this._isPicked = value)
    }

    initDraw() {
        this.load_counter += 1
        if (this.load_counter == 2) {
            this.draw()
        }
    }

    draw() {
        const img = this.isPicked == -1 ? this.color_img : this.gray_img
        c.drawImage(img, this.x1, this.y1, this.width, this.height)
        if (this.isPicked > -1) {
            if (this.isPicked > 0) {
                c.beginPath()
                c.lineWidth = 8
                const rectX = this.x1+c.lineWidth/2
                const rectY = this.y1+c.lineWidth/2
                const rectW = this.width-c.lineWidth
                const rectH = this.height-c.lineWidth
                c.roundRect(rectX, rectY, rectW, rectH, 10)
                c.strokeStyle = button_focus_colors[this.isPicked]
                c.stroke()
                c.fillStyle = hexToRgba(button_focus_colors[this.isPicked], 0.5)
                c.fill()
            } else {
                c.beginPath()
                c.fillStyle = 'rgba(0, 0, 0, 0.5)'
                c.roundRect(this.x1, this.y1, this.width, this.height, 10)
                c.fill()
            }
            current_focus = -1
        }
    }

    onClick() {
        this.isPicked = current_focus
        this.draw()
    }
}

class CourseTile extends CourseButton {
    constructor(x1, y1, width, height, imgSrc) {
        const shrinkRatio = 0.95
        const innerWidth = shrinkRatio * width
        const innerHeight = shrinkRatio * height
        const innerX1 = x1 + (width - innerWidth) / 2
        const innerY1 = y1 + (height - innerHeight) / 2
        super(innerX1, innerY1, innerWidth, innerHeight, imgSrc)

        this.paddingX1 = x1
        this.paddingY1 = y1
        this.paddingWidth = width
        this.paddingHeight = height
    }

    draw() {
        c.beginPath()
        c.fillStyle = 'white'
        c.fillRect(this.paddingX1, this.paddingY1, this.paddingWidth, this.paddingHeight)
        super.draw()
    }
}


class TextButton extends Button {
    constructor(x1, y1, width, height, index) {
        super(x1, y1, width, height)
        this.index = index
        this.text = button_texts[index]
        this.bgColor = button_idle_colors[index]
        this.focusColor = button_focus_colors[index]
        this.isFocus = false

        document.fonts.ready.then(this.draw.bind(this))
    }

    draw() {
        c.beginPath()
        c.roundRect(this.x1, this.y1, this.width, this.height, 10)
        c.fillStyle = this.isFocus ? this.focusColor : this.bgColor 
        c.fill()

        c.font = '60px Nunito'
        c.fillStyle = 'black'
        const textX = this.x1 + (this.width - c.measureText(this.text).width) / 2
        const textY = this.y1 + this.height / 2 + 22
        c.fillText(this.text, textX, textY)

        c.lineWidth = 5
        const rectX = this.x1+c.lineWidth/2
        const rectY = this.y1+c.lineWidth/2
        const rectW = this.width-c.lineWidth
        const rectH = this.height-c.lineWidth
        c.roundRect(rectX, rectY, rectW, rectH, 10)
        c.strokeStyle = "#8cc8ff"
        c.stroke()
    }
    
    onClick() {
        current_focus = this.isFocus ? -1 : this.index
        this.isFocus = (current_focus === this.index)
        this.draw()
    }

    releaseFocus() {
        this.isFocus = false
        this.draw()
    }
}


class FunctionButton extends Button {
    constructor(x1, y1, diameter, imgSrc, isHide = false) {
        const shrink = diameter * 0.15
        super(x1 + shrink, y1 + shrink, diameter - shrink*2, diameter - shrink*2)
        this.radius = diameter / 2
        this.centerX = x1 + this.radius
        this.centerY = y1 + this.radius

        this.isHide = isHide
        this.img = new Image()
        this.img.src = imgSrc
        this.img.addEventListener('load', () => this.draw())
    }

    draw() {
        if (this.isHide)
            return
        c.beginPath()
        c.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI)
        c.fillStyle = `rgba(255, 100, 100, 1)`
        c.fill()
        c.drawImage(this.img, this.x1, this.y1, this.width, this.height)
        c.lineWidth = 10
        c.strokeStyle = "#8cc8ff"
        c.stroke()
    }

    show() {
        this.isHide = false
        this.draw()
    }

    hide() {
        this.isHide = true
        this.draw()
    }

    inBound(mouseX, mouseY) {
        return !this.isHide && super.inBound(mouseX, mouseY)
    }
}


class ResetButton extends FunctionButton {
    onClick() {
		if (window.confirm("Reset all?")) {
			window.localStorage.clear()
			courses.forEach(b => {
				b.isPicked = -1      
				b.draw()
			})
		}
    }
}


class RandomButton extends FunctionButton {
    onClick() {
        var counter = courses.filter(b => b.isPicked === -1).length
        counter = getRandomInt(0, counter)
        courses.forEach(b => {
            if (b.isPicked === -1) {
                if (counter == 0)
                    b.onClick()
                counter -= 1
            }
        })
    }
}
