# BoidsJS
Flocking simulation (boids) in JavaScript

This boid simulation is made in javascript, with no external libraries.

It contains 3 files:
  - main.html
  - style.css
  - main.js

For the code to work, you just need to put all the files in a folder, then open the main.html file. And here you go !
Then you can play around with the value sliders to change how each rules affect the boids.


*All the real code for the simulation is in the main.js file.*
**How does it works :**
In the js file, there's a Vector class, with different methods that makes easier everything about boids, such as their position, velocity, etc...
Then, you have the Boid class, with a method for each rules of the flocking simulation : Separation, Cohesion and Alignement.
And finally, everything is draw in the animate function.

For more details about boids from Craig Reynolds and how it works, here's a link :
https://www.red3d.com/cwr/boids/

