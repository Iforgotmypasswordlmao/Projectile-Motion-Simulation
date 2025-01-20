from flask import Flask, render_template, request
from projectilePhysics import simulateProjectilePoints

app = Flask(__name__)

@app.route('/motion', methods=['POST'])
def motion():
    projectileData = request.get_json()
    if projectileData:
        return simulateProjectilePoints(
            projectileData['velocity'],
            projectileData['angleDegree'],
            initialHeight=projectileData['initialHeight'],
            stepSize=projectileData['stepSize'],
            acceleration=projectileData['acceleration']
        )

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)