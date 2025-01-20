import { planetData } from './planets.js'

const scale = 5 // 5 pixels = 1 meter

// stores the canvas to draw the points on
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

// simulates the projectiles motion on the canvas
async function simulateProjectileMotion(projectileData)
{
    // sends the data to /motion to get the points of the projectile
    const response = await fetch("/motion", 
        {
            'method': 'POST',
            'body': JSON.stringify(projectileData),
            'headers': 
            {
                'Content-Type': 'application/json'
            }
        }
    )
    
    // stores the results 
    const results = await response.json()   
    const timeInterval = projectileData['stepSize']

    // function for turning on and off the form
    const switchForm = (bool) => {
        const form = document.getElementsByClassName('inputParameters')
        for (let inputs = 0; inputs < form.length; inputs++)
        {
            form[inputs].disabled = bool
        }
    }

    // turns off the form, disabling it
    switchForm(true)

    // getting all the sim data for updates
    const simTimer = document.getElementById('simTimer')
    const simHeight = document.getElementById('simHeight')
    const simDistance = document.getElementById('simDistance')
    const simGravity = document.getElementById('simGravity')


    // stole this from stack overflow <https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep>
    const sleep = ms => new Promise(r => setTimeout(r, ms))

    //go to the bottom left corner and start drawing
    context.moveTo(50, 600)
    context.beginPath()
    context.strokeStyle = '#AA00AA'
    
    // sets the gravity of the planet to the sim data
    simGravity.innerHTML = projectileData['acceleration']

    // goes through each point in the simulation
    for (const elements in results)
    {
        // getting the info from each point
        const coords = results[elements]
        const x = coords['distance']
        const y = coords['height']
        const time = coords['time']

        // update the sim data
        simTimer.innerHTML = time
        simHeight.innerHTML = y
        simDistance.innerHTML = x

        // draws the motion's line
        context.lineTo(50 + x*scale, 600-y*scale)
        context.stroke()

        await sleep(timeInterval*1000)
    }

    // finish drawing
    context.closePath()
    
    // renable the form
    switchForm(false)

}

// the function to parse the form data to simulate the motion of the projectile
function onSubmit()
{
    // stores the form data
    let projectileSettings = document.forms['projectileSettings']

    let planet = {}

    // search for the planet from the dataset in planets.js
    for (const planets in planetData)
    {
        if (planetData[planets]['planet'] == projectileSettings['planets'].value)
        {
            planet = planetData[planets]
            break
        }
    }

    // gets the projectile data from the form
    const projectileData = {
        'velocity': parseInt(projectileSettings['velocity'].value),
        'angleDegree': parseInt(projectileSettings['angle'].value),
        'initialHeight': parseInt(projectileSettings['height'].value),
        'stepSize': parseFloat(projectileSettings['stepSize'].value),
        'acceleration': planet['acceleration']
    } 

    return {
        'projectileData': projectileData,
        'background': planet['backgroundImage']
    }
}

// for reseting the canvas
function resetCanvas(planetBackground)
{

    // clears the canvas of drawings
    context.clearRect(0, 0, canvas.width, canvas.height)

    // gets the background planet 
    const background = new Image()
    background.src = '../static/assets/' + planetBackground

    // loads it onto the canvas
    background.onload = () => {
        context.drawImage(background, 0, 0, canvas.width, canvas.height)
    }  

}

// the function for drawing the cannon
function drawCannon(elevation, angle) 
{

    const cannon = new Image()
    const y = 600 - elevation*scale
    cannon.src = '../static/assets/cannon.png'

    cannon.onload = () => {
        // stole this from stack overflow <https://stackoverflow.com/questions/7496674/how-to-rotate-one-image-in-a-canvas>
        // this rotates the cannon to the angle specified but also changes the elevation of the cannon
        context.save()
        context.translate(50, y)
        context.rotate( (360-angle)*3.14/180 )
        context.drawImage(cannon, -50, -50)
        context.restore()
        context.beginPath()
        context.fillStyle = '#555555'
        // draws the pillar that the cannon stands on
        context.fillRect(0, 650, 70, -elevation*scale)
    }


}

function main()
{
    // stores the form data in a variable
    const sumbitForm = document.getElementById('projectileForm')
    const formData = document.forms['projectileSettings']

    // to process when the form is submitted
    sumbitForm.addEventListener("submit", (e) => {

        // prevents the page from refreshing
        e.preventDefault()

        // stores the form data
        const data = onSubmit()

        // resets the canvas
        resetCanvas(data['background'])

        drawCannon(
            data['projectileData']['initialHeight'], 
            data['projectileData']['angleDegree'])

        // draw the motion of the projectile
        simulateProjectileMotion(data['projectileData'])

    })

    // to update the cannon and background when the settings are changed
    sumbitForm.addEventListener('change', (e) =>{

        const planet = formData['planets'].value.toLowerCase() + '.png'
        const height =  parseInt(formData['height'].value)
        const angle =  parseInt(formData['angle'].value)

        resetCanvas(planet)

        drawCannon(height, angle)

    })
}

window.onload = () => {
    main()
    // to initialize the canvas 
    resetCanvas('earth.png')
    drawCannon(0, 45)
}
