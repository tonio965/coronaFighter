/**
 * Sample CoronaFighter App
 *
 */

import React, { PureComponent } from "react";
import { Dimensions, AppRegistry, StyleSheet, StatusBar, Text, Alert } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Virus, Background, Fighter, Score, Bullet, Znajdzka, Znajdzka2} from "./renderers";
import { MoveFighter, VirusSpawner,ShootAmmo, ZnajdzkaSpawner, Znajdzka2Spawner} from "./systems"

global.renderers = [];
 
export default class BestGameEver extends PureComponent {
  constructor() {
    super();
    this.state = {
      x: 150,
      y: 150,
      score: 0,
      lives: 3
    };
  }
 
  render() {

    let width = Math.round(Dimensions.get('window').width);
    let height = Math.round(Dimensions.get('window').height);
    let currX;
    let currY;
        
    return (
      <GameEngine
        style={styles.container}
        systems={[MoveFighter, VirusSpawner, ShootAmmo, ZnajdzkaSpawner, Znajdzka2Spawner]} // funkcje logiki (kontrolery) uruchamiane co 16ms (teoretycznie)
        entities={{ 
          1: { id: 1, type: 'b', position: [40, 200], isHit: false, renderer: <Background/>}, // tlo
          2: { id: 2, type: 'f', position: [150,150],isHit:false, isOver: false, renderer: <Fighter />}, // fajter
          3: { id: 3, type: 'v', position: [10, 0],isHit:false, renderer: Virus}, // zaraza
          4: { id: 4, type: 'v', position: [20, 0],isHit:false, renderer: Virus},
          5: { id: 5, type: 'v', position: [40, 0],isHit:false, renderer: Virus},
          6: {id: 6, type: 's', position: [80,80], renderer: Score, amount:this.state.score, text: "Score"},
          7: {id: 7, type: "bu", position: [-100,-100], renderer: Bullet},
          8: {id: 8, type: 's', position: [500,80], renderer: Score, amount:this.state.lives, text: "Lives", score: this.state.score},
          9: {id: 9, type: 'z', position : [50,0], isHit:false, renderer: Znajdzka},
          10: {id: 10, type: 'z2', position : [45,0], isHit:false, renderer: Znajdzka2},
        }}>

        <StatusBar hidden={true} />

      </GameEngine>
      
    );
    
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
