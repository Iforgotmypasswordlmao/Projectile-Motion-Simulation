import math

def simulateProjectilePoints(velocity: float, 
                             angleDegree: float, 
                             initialHeight: float=0,
                             stepSize: float=0.5,
                             sigFigs: int=2,
                             acceleration: float=9.81)-> list:
    
    #Acceleration variable
    Planetgravity = acceleration
    #This is used to break down the velocity into its horizontal and vertical components
    angleRadians = angleDegree*math.pi/180
    horizontalVelocity = velocity*math.cos(angleRadians)
    verticalVelocity = velocity*math.sin(angleRadians)
    #The list of points simulated
    simulatedProjectileMotionPoints = []
    #Initial variables
    height = initialHeight
    distance = 0
    time = 0
    #Simulation loop of the projectile being shot
    while height >= 0:
        simulatedProjectileMotionPoints.append(
            {
                'height': round(height, sigFigs),
                'distance': round(distance, sigFigs),
                'time': round(time, 1)
            }
        )
        time += stepSize
        distance = time*horizontalVelocity
        height = (time*verticalVelocity) - (Planetgravity*0.5*time**2) + initialHeight

    # Adds the point where the height reaches 0 
    # formula for total time stolen from <https://www.omnicalculator.com/physics/time-of-flight-projectile-motion>
    time = ((verticalVelocity) + math.sqrt(verticalVelocity**2 + (2*Planetgravity*initialHeight)))/Planetgravity
    distance = time*horizontalVelocity
    simulatedProjectileMotionPoints.append(
        {
                'height': 0,
                'distance': round(distance, sigFigs),
                'time': round(time, 1)
        }
    )
    

    return simulatedProjectileMotionPoints