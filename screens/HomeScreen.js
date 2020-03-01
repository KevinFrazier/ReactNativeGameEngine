
import React from 'react';
import { Dimensions, StyleSheet, Text, View, StatusBar } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";
import Box from '../components/Box';

const { width, height } = Dimensions.get("screen");
const boxSize = Math.trunc(Math.max(width, height) * 0.075);
const engine = Matter.Engine.create({ enableSleeping: false });
const world = engine.world;

world.gravity.scaling = 0
world.gravity.x = 0
world.gravity.y = 0

const initialBox = Matter.Bodies.rectangle(width / 2, height / 2, boxSize, boxSize);
const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize, { isStatic: true });
Matter.World.add(world, [initialBox, floor]);


//for movePlayer()
var moving = false;
var joyStickRef = false;
var actionQueue = []

//for CreateBox
let boxIds = 0;

const Physics = (entities, { time }) => {
  let engine = entities["physics"].engine;


  //frame
  Matter.Engine.update(engine, time.delta);

  return entities;
};

const addObject = (entities, body) => {
  let world = entities["physics"].world;

  //add to world
  Matter.World.add(world, [body]);

  //add to entities
  entities[++boxIds] = {
    body: body,
    size: [boxSize, boxSize],
    color: boxIds % 2 == 0 ? "pink" : "#B8E986",
    renderer: Box
  };

}

const CreateBox = (entities, { touches, screen }) => {
  let world = entities["physics"].world;
  let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075);
  touches.filter(t => t.type === "press").forEach(t => {
    let body = Matter.Bodies.rectangle(
      t.event.pageX,
      t.event.pageY,
      boxSize,
      boxSize,
      {
        frictionAir: .1,
        restitution: 7,
        isSleeping: false //temporary static -> set with Matter.Sleeping.set() 
      }
    );

    Matter.World.add(world, [body]);

    entities[++boxIds] = {
      body: body,
      size: [boxSize, boxSize],
      color: boxIds % 2 == 0 ? "pink" : "#B8E986",
      renderer: Box
    };
  });
  return entities;
};

const deleteBox = (entities, {touches}) => {

  let world = entities["physics"].world;
  

}
const movePlayer = (entities, {touches}) => {
  let world = entities["physics"].world;

  touches.filter(t => t.type === "end").forEach(t =>{

    console.log("ending")
    moving = false
    Matter.Body.setVelocity(initialBox, {x: 0, y:0})

    
  })
  touches.filter(t => t.type === "move").forEach(t => {
    
    // console.log("t:")
    // console.log(t)

    //check off screen drag touches
    const PROPAGATION = 5
    if(t.event.pageX >= width - PROPAGATION || t.event.pageX <= 0 + PROPAGATION){
      moving = false
      Matter.Body.setVelocity(initialBox, {x: 0, y: 0})
      joyStickRef = {
        x: 0,
        y: 0,
      }
    }
    else if(t.event.pageY >= height - PROPAGATION || t.event.pageY <= 0 + PROPAGATION){
      moving = false
      Matter.Body.setVelocity(initialBox, {x: 0, y: 0})
      joyStickRef = {
        x: 0,
        y: 0,
      }
    }
    else{
      
      // console.log("moving metadata:")
      // console.log("t.event: ")    
      // console.log(t.event)            
      // console.log("joyStickRef: ")
      // console.log(joyStickRef)

      if(!moving){
        //set moving
        moving = true
        //get joystick frame of reference
        joyStickRef = {
          x: t.event.pageX,
          y: t.event.pageY,
        }
      }
      else{
      //determine the direction of movement at point in time

        if(t.event.pageX && t.event.pageY){
          const newPosition = {
            x : t.event.pageX - joyStickRef.x,
            y : t.event.pageY - joyStickRef.y
          }
          console.log(newPosition)
          //determine the speed
          const SPEED_COEFF = 5

          //calculate the unit vector
          var denom = Math.sqrt(Math.pow(newPosition.x,2) + Math.pow(newPosition.y, 2))
          // console.log("denom:")
          // console.log(denom)
          
          //set Velocity
          var resultVelocity = {x: (SPEED_COEFF*newPosition.x/denom), y: (SPEED_COEFF*newPosition.y/denom)}
          // console.log("resultVelocity")
          // console.log(resultVelocity)
          Matter.Body.setVelocity(initialBox, resultVelocity)
          
        }

    }


    }

  
  });

  return entities
}

export default class App extends React.Component {

  render() {
    console.log("rendering")
    return (
      
        <GameEngine
          style = {styles.container}
          systems={[Physics,movePlayer, CreateBox]} // Array of Systems
          entities={{
            physics: { engine: engine, world: world },
            floor: { body: floor, size: [width, boxSize], color: "green", renderer: Box },
            initialBox: { body: initialBox, size: [boxSize, boxSize], color: 'red', renderer: Box }
          }}
        >
          <StatusBar hidden={true} />
        </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});