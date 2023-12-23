# Minesweeper Prime

## Description

Minesweeper game with a variety of procedural generation mechanisms for game boards and an infinite scrolling feature. 

## Features

- Infinite grid generation
- Novel algorithms for minefield generation
- Multiple schemes for giving hints about adjacent mines
- Customizable mine density
- Dynamic row addition upon scrolling

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
