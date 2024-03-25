const canvas = document.getElementById("canvas-1");
const ctx = canvas.getContext("2d");

const sliderAlignement1 = document.getElementById("myRange1");
const sliderAlignement2 = document.getElementById("myRange2");
const sliderAlignement3 = document.getElementById("myRange3");

class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    set(x, y){
        this.x = x;
        this.y = y;
    }

    add(vector){
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector){
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(vector){
        this.x *= vector.x;
        this.y *= vector.y;
    }

    divide(number){
        this.x /= number;
        this.y /= number;
    }

    scaleBy(number){
        this.x *= number;
        this.y *= number;
    }

    length(){
        return Math.hypot(this.x, this.y);
    }

    normalize(){
        this.scaleBy(1/this.length());
    }

    setLength(newLength){
        this.normalize();
        this.scaleBy(newLength);
    }

    limitLength(length){
        if (this.length() > length){
            this.setLength(length);
        }
    }

    negate(){
        this.x *= -1;
        this.y *= -1;
    }

    dotProduct(vector){
        let dot = this.x*vector.x + this.y*vector.y;
        return dot;
    }

    getAngle(){
        let normalVector = new Vector(0, 1);
        let angle = Math.acos(this.dotProduct(normalVector)/(normalVector.length()*this.length()));
        return angle;
    }
}

class Boid{
    constructor(canvas){
        this.canvas = canvas
        this.position = new Vector(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));
        this.speed = 1;
        this.maxSpeed = 1;
        this.maxForce = 0.1;
        this.velocity = new Vector(Math.floor(Math.random() * canvas.width) * (Math.round(Math.random()) ? 1 : -1), Math.floor(Math.random() * canvas.height) * (Math.round(Math.random()) ? 1 : -1));
        this.velocity.setLength(this.speed);
        this.acceleration = new Vector(0, 0);
        this.size = new Vector(10, 10);
    }

    draw(context){
        context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.beginPath();
        //context.moveTo(this.position.x + this.size.x/2, this.position.y + this.size.y/2);
        //context.lineTo(this.position.x + this.size.x/2 + 15*Math.cos(-Math.PI/2) + 15*Math.cos(this.velocity.getAngle()), this.position.y + this.size.y/2 + 15*Math.sin(-Math.PI/2) + 15*Math.sin(this.velocity.getAngle()));
        context.lineWidth = 3;
        //context.stroke();
    }

    align(boids){
        let maxDistance = 100;
        let avg = new Vector(0, 0);
        let index = 0;
        for (let boid of boids){
            const distance = Math.sqrt((boid.position.x - this.position.x)**2+(boid.position.y - this.position.y)**2);
            if (boid != this && distance < maxDistance){
                index ++;
                avg.add(boid.velocity);
            }
        }
        if (index > 0){
            avg.divide(index);
            avg.setLength(this.maxSpeed);
            avg.subtract(this.velocity);
            avg.limitLength(this.maxForce);
        }
        return avg;
    }

    cohesion(boids){
        let maxDistance = 100;
        let avgPos = new Vector(0, 0);
        let index = 0;
        for (let boid of boids){
            const distance = Math.sqrt((boid.position.x - this.position.x)**2+(boid.position.y - this.position.y)**2);
            if (boid != this && distance < maxDistance){
                index ++;
                avgPos.add(boid.position);
            }
        }
        if (index > 0){
            avgPos.divide(index);
            avgPos.subtract(this.position);
            avgPos.setLength(this.maxSpeed);
            avgPos.subtract(this.velocity);
            avgPos.limitLength(this.maxForce);
        }
        return avgPos;
    }

    separation(boids){
        let maxDistance = 20;
        let avgPosSepa = new Vector(0, 0);
        let index = 0;
        for (let boid of boids){
            const distance = Math.sqrt((boid.position.x - this.position.x)**2+(boid.position.y - this.position.y)**2);
            if (boid != this && distance < maxDistance){
                index ++;
                let diff = new Vector(this.position.x - boid.position.x, this.position.y - boid.position.y);
                diff.divide(distance);
                avgPosSepa.add(diff);
            }
        }
        if (index > 0){
            avgPosSepa.divide(index);
            //avgPos.subtract(this.position);
            avgPosSepa.setLength(this.maxSpeed);
            avgPosSepa.subtract(this.velocity);
            avgPosSepa.limitLength(this.maxForce);
        }
        return avgPosSepa;
    }

    flock(boids){
        let alignement = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignement.scaleBy(sliderAlignement1.value/100);
        cohesion.scaleBy(sliderAlignement2.value/100);
        separation.scaleBy(sliderAlignement3.value/100);

        this.acceleration.add(alignement);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        //this.velocity.limitLength(this.maxSpeed);
        if (this.position.x >= canvas.width){
            this.position.x = 0 - this.size.x;
        } else if (this.position.x <= 0 - this.size.x){
            this.position.x = canvas.width;
        }
        if (this.position.y >= canvas.height){
            this.position.y = 0 - this.size.y;
        } else if (this.position.y <= 0 - this.size.y){
            this.position.y = canvas.height;
        }
        this.acceleration.set(0, 0); 
    }
}


canvas.height = 600;
canvas.width = 1000;

//Global settings
ctx.lineWidth = 10;


const boids = []

for (let i = 0; i < 1000; i++){
    boids.push(new Boid(canvas))
}


function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let boid of boids){
        boid.draw(ctx);
        boid.flock(boids);
        boid.update();
    }

    requestAnimationFrame(animate);
}

animate();
