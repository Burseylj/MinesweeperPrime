# Minesweeper Prime

## Description

Minesweeper game with a variety of procedural generation mechanisms for game boards and an infinite scrolling feature. Hosted at burseylj.github.io

## Features

- Infinite grid generation
- Novel algorithms for minefield generation
- Multiple schemes for giving hints about adjacent mines
- Customizable mine density
- Dynamic row addition upon scrolling

## Discussion of Algorithms
Here's a rundown of the different algorithms used to create minesweeper boards. Note that you can look at the placement of mines at any time by toggling debug mode on (the mines will be marked with an X):

### Unstructured:

This is how a typical game of minesweeper is created. We simply create a zero matrix (a grid of numbers where all the numbers are zero) and then pick random pairs of rows and columns to add mines to, until we have created the required number of mines. This is a purely random matrix. 

Ex:
<img width="840" height="451" alt="image" src="https://github.com/user-attachments/assets/e121337f-9b7c-4d48-b814-41b4363fbf06" />

Its visual equivalent would be something like white noise or TV static, where there is no apparent pattern to the black or white pixels that are displayed:
<img width="240" height="180" alt="image" src="https://github.com/user-attachments/assets/85891a46-c6e1-4b11-b2d9-9c39126d493e" />


### HoleEveryThree:

Here we follow the same proceedure as the unstructured board, except that we don't allow mines to be placed in one out of every 3 columns. This makes the game significantly easier, because it prevents large clusters of mines from being created. This is still fairly random, but visually you will notice that there are empty vertical lines which contain no lines. 

Ex:
<img width="831" height="455" alt="image" src="https://github.com/user-attachments/assets/074095eb-9b8b-4449-863b-5f6778917da5" />


### Gaussian Blur:

This algorithm starts with an unstructured matrix. Then we apply a "gaussian blur" to the matrix. The idea here is to replace each cell with a value that represents the average of the cells around it. We go through each cell, get all of the cells surrounding it, multiply them by a weight (so that the diagonal cells have a lower weight, since they are further away from the center), and then add them up. Then once we have a new matrix of all of these averages, we take the cells with the highest values and make them mines. 
Ex:
<img width="832" height="450" alt="image" src="https://github.com/user-attachments/assets/0aa8f1c7-b802-4919-9559-1caf51c149f1" />


The result of this algorithm is a matrix that has noticable clustering. It looks almost like it creates little islands. The gameplay is now noticably different because the player can expect mines to cluster up. They will get a sense of intuition about where mines will be, instead of relying purely on logic. 

This algorithm is borrowed from image processing. This is the most common algorithm used to create a blurring effect. Each pixel is averaged with the values of its neighbours, which removes detail and smooths out the image.

<img width="320" height="639" alt="image" src="https://github.com/user-attachments/assets/10afe7db-ee2a-40e4-957b-15121a1f6c01" />


### TripleGaussianBlur:

Here we simply apply a gaussian blur to a matrix three times. This creates very large clusters. It is sort of awkward to play but it's interesting!

Ex:
<img width="836" height="457" alt="image" src="https://github.com/user-attachments/assets/965f6abe-f76d-47c2-8751-2b8e65329389" />


### GaussianBlurPlusUnstructured:

Here we create half of the mines with the gaussian blur algorithm and then add half of them purely randomly. This creates some clustered areas but still introduces a number of unclustered areas. This type of board creates a lot of interesting structures for the player to work out.

Ex:
<img width="832" height="452" alt="image" src="https://github.com/user-attachments/assets/6ea673cd-6026-44c6-8236-5e5e607a4bfb" />


### Perlin:

This is an algorithm that is often used in game for generating things like terrain (Minecraft uses it to generate hills and valleys). This is harder to explain and I used a library to implement it because the actual code is quite involved. Basically, what happens is that we create gradient vectors (or arrows pointing in some direction with a corresponding value) on a wider grid that sits on top of the matrix. Then for each cell, we look at the surrounding corner vectors, compute how much they should be influencing that cell, and then blends all of the cells smoothly using interpolation. Then each cell has a vector (ie an arrow and a value that represnts the "length" of that arrow). We then take the cells with the highest values (ignoring the arrows or the direction vector) and turn them into mines. Here is a good explaination with visuals: https://rtouti.github.io/graphics/perlin-noise-algorithm

Ex:
<img width="830" height="452" alt="image" src="https://github.com/user-attachments/assets/aafcd4f1-0286-4620-b0fc-42707feb5479" />

This algorithm tends to create branching patterns which feel sort of like mountain ridges. Because of the grid that we create on top of the matrix, it tends to have very horizontal/vertical branches. In the following visual example of a texture generated with perlin noise, you can imagine that the darker areas would become mines in this game.
<img width="960" height="960" alt="image" src="https://github.com/user-attachments/assets/54efc0b4-0a2e-462b-88fa-fd69c1994e26" />


### Simplex:

This is another texture generation algorithm used often in games. Instead of creating a square board, it divides the board into triangles. This creates less grid like horizontal and vetical branches and more organic looking structures. It is also allegedly faster than perlin but I am not going to investigate performance for this project.

<img width="835" height="450" alt="image" src="https://github.com/user-attachments/assets/8d9d54a5-e456-4f5f-93e1-673546519384" />

Here is a visual example of simplex noise:
<img width="256" height="256" alt="image" src="https://github.com/user-attachments/assets/c71cf5c3-313e-4104-b3a1-0926acd7c82a" />

### UnstructuredWithSimplex:

Generate some of the mines with simplex noise and some with unstructured noise. A good mix of structures along with scattered mines.

<img width="830" height="453" alt="image" src="https://github.com/user-attachments/assets/9faffd1a-d8a0-4ed9-906b-0ff1b8103053" />

## Quick Start

Game is hosted [here](https://burseylj.github.io/)


To run locally, install the dependencies:

```bash
npm install
```

Run the application:

```bash
ng serve
```

Navigate to `http://localhost:4200/`

## Technologies

- Angular
- TypeScript
- RxJS
- SCSS
- HTML5

## Next steps:
- The state mangement here is both inconsitent and over engineered for this project. I wanted to explore a couple options just out of interest.
-  The Cell component is definitely doing too much right now, and a lot of it's behavior should be pulled out to a service.
-  Would like to implement my own perlin noise algorithms, this is starting to be a lot of code for client side JS though.
-  Would like to add easily recognizable geometric shapes (spirals, cubes, etc.) and sprinkle them into game boards. I think that being able to predict the shape of the game board to a certain extent adds a unique flavor to the game.

## Testing

Run the test suite with:

```bash
ng test
```
