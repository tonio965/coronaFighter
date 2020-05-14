import React, { PureComponent } from "react";
import { StyleSheet, View, Animated, Easing, Image, Text, Alert } from "react-native";
import SpriteSheet from 'rn-sprite-sheet';
import { Accelerometer } from 'expo-sensors';
 
class Fighter extends PureComponent {
  
  constructor(props) {
    super(props);
    renderers[this.props.id] = this;
    this.isAnimating = false;
  }

  play = type => {
    this.isAnimating = true;
    this.mummy.play({
      type,
      fps: 24,
      loop: true,
      resetAfterFinish: true,
      onFinish: () => console.log('hi')
    });
  };
  
  stop = () => {
    this.mummy.stop(() => console.log('stopped'));
  };
  
  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    
     
    return (
      <View 
        style={{
          overflow: "hidden",
          width: 412,
          height: 684,
          position: "absolute",
          left: x,
          top: y }}
      >
      <SpriteSheet
        ref={ref => (this.mummy = ref)}
        source={require('./images/fighter.png')}
        columns={8}   // zakladamy że obraz kolejne klatki animacji umieszczone są w obrazie na rownomiernej siatce 
        rows={1}      // o podanych wymiarach liczba wierszy x liczba kolumn, klatki numerowane są od 0 od lewej do prawej, z góry na dół 
        height={192}  // set either, none, but not both (blokada aspect-ratio)
        // width={200}
        imageStyle={{ 
          marginTop: -1, 
          left: 0,
          top: 0 
        }}
        animations={{
          idle: [0, 1, 2, 3, 4, 5, 6, 7], // numery klatek towrzących animacje, mozna dodawac kolejne sekwencje
                                          // wystarczy tylko przyszkowac odpowiedni szablon (sheet) 
                                          // np. przy użyciu GIMPa i znalezisk na www.OpenGameArt 
        }}                                
      />
      
      </View>
    );
  }
}
class Score extends PureComponent {
  constructor(props) {
    super(props);
  }	
    
    
  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    const score = this.props.score;
    const scorey = this.props.amount;
    const text = this.props.text;
    if(text==="Lives"){
      if(scorey<1){
        Alert.alert(
          "congratulations",
          "you lost",
          [ ],
        )
      }
    }
  
    
      
    return (
      <View>
       <Text style={styles.baseText}>{text} :  {scorey}</Text>
      </View>
    );
  }
}

class Bullet extends PureComponent {
  constructor(props){
    super(props);
    renderers[this.props.id] = this;
    // console.log("xd" + JSON.stringify(renderers[this.props.id])); // co to
    this.animatedValue = new Animated.Value(0);
    this.animatedValue.addListener(({value}) => this._animatedValue = value); 
    this.isMoving = false;
  }


  play = (delay) => {
    // console.log("starting animation");
    this.animatedValue.setValue(0);
    this.isMoving = true;
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: delay,
      easing: Easing.linear,
      useNativeDriver: true, // <-- Add this
    }).start((res) => {
      this.isMoving = false;
    });
       
  }
  render (){
    var img;
    console.log("rendering bullet");
    console.log(this.animatedValue._animatedValue);
    const xpos = this.props.position[0];
    const ypos = this.props.position[1];
    img = require('./images/bullet.png');

      

    return (
      <Animated.View 
      style={{
        overflow: "hidden",
        width: 80,
        height: 80,
        position: "absolute",
        transform: [ { translateX: ypos}, 
                     { translateY: this.animatedValue.interpolate({
                  inputRange:  [0, 1],             
                  outputRange: [xpos, -100]}) } ]
      }}
    >

      <Image //sam image sie respi elegancko
        style={{
          height: 80,
          width: 80,
          top: 0,
          left: 0,
          resizeMode: 'stretch'
        }}
        source={img}
      />

    </Animated.View>
     
    //  <Image
    //     style={{
    //       height: 80,
    //       width: 80,
    //       top: xpos,
    //       left: ypos,
    //       resizeMode: 'stretch'
    //     }}
    //     source={img}
    //   />
    );
  }
}

class Znajdzka3 extends PureComponent {
  
  constructor(props) {
    super(props);
    
    renderers[this.props.id] = this;
    // console.log("xd" + JSON.stringify(renderers[this.props.id])); // co to 
    this.animatedValue = new Animated.Value(0);
    // UWAGA! Nie ma innej mozliwosci na pobranie tej wartości synchronicznie
    this.animatedValue.addListener(({value}) => this._animatedValue = value); 
    this.isMoving = false;
  }	
    
  // uruchamia plynna animację/poruszanie sie koronawirusa z góry ekranu na dół
  play = (delay) => {
    this.animatedValue.setValue(0);
    this.isMoving = true;
        
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: delay,
      easing: Easing.linear,
      useNativeDriver: true, // <-- Add this
    }).start((res) => {
      // Logic whenever an iteration finishes...
      //console.log('ended '+res.finished);

      this.isMoving = false;
    });
       
  }
    
  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    
    var img;
    
    if (this.props.hit){
      img = require('./images/explosion.png');
    }
    else
      img = require('./images/killAllEnemies.png');
      
    return (
       
      <Animated.View 
        style={{
          overflow: "hidden",
          width: 80,
          height: 80,
          position: "absolute",
          transform: [ { translateX: x}, 
                       { translateY: this.animatedValue.interpolate({ //interpolacja w dokumentacji reacta po prsotu idzie se animacja od 0 do 1 czyli od dolu do gory i napisane pixele na sztywno
                    inputRange:  [0, 1],             
                    outputRange: [-80, 800]}) } ]
        }}
      >
     
     <Image
        style={{
          height: 80,
          width: 80,
          top: 0,
          left: 0,
          resizeMode: 'stretch'
        }}
        source={img}
      />
        
      </Animated.View>
    );
  }
}










class Znajdzka2 extends PureComponent {
  
  constructor(props) {
    super(props);
    
    renderers[this.props.id] = this;
    // console.log("xd" + JSON.stringify(renderers[this.props.id])); // co to 
    this.animatedValue = new Animated.Value(0);
    // UWAGA! Nie ma innej mozliwosci na pobranie tej wartości synchronicznie
    this.animatedValue.addListener(({value}) => this._animatedValue = value); 
    this.isMoving = false;
  }	
    
  // uruchamia plynna animację/poruszanie sie koronawirusa z góry ekranu na dół
  play = (delay) => {
    this.animatedValue.setValue(0);
    this.isMoving = true;
        
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: delay,
      easing: Easing.linear,
      useNativeDriver: true, // <-- Add this
    }).start((res) => {
      // Logic whenever an iteration finishes...
      //console.log('ended '+res.finished);

      this.isMoving = false;
    });
       
  }
    
  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    
    var img;
    
    if (this.props.hit){
      img = require('./images/greenExplosion.png');
    }
    else
      img = require('./images/health.png');
      
    return (
       
      <Animated.View 
        style={{
          overflow: "hidden",
          width: 80,
          height: 80,
          position: "absolute",
          transform: [ { translateX: x}, 
                       { translateY: this.animatedValue.interpolate({ //interpolacja w dokumentacji reacta po prsotu idzie se animacja od 0 do 1 czyli od dolu do gory i napisane pixele na sztywno
                    inputRange:  [0, 1],             
                    outputRange: [-80, 800]}) } ]
        }}
      >
     
     <Image
        style={{
          height: 80,
          width: 80,
          top: 0,
          left: 0,
          resizeMode: 'stretch'
        }}
        source={img}
      />
        
      </Animated.View>
    );
  }
}
class Znajdzka extends PureComponent { //znajdzka
  
  constructor(props) {
    super(props);
    
    renderers[this.props.id] = this;
    // console.log("xd" + JSON.stringify(renderers[this.props.id])); // co to 
    this.animatedValue = new Animated.Value(0);
    // UWAGA! Nie ma innej mozliwosci na pobranie tej wartości synchronicznie
    this.animatedValue.addListener(({value}) => this._animatedValue = value); 
    this.isMoving = false;
  }	
    
  // uruchamia plynna animację/poruszanie sie koronawirusa z góry ekranu na dół
  play = (delay) => {
    this.animatedValue.setValue(0);
    this.isMoving = true;
        
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: delay,
      easing: Easing.linear,
      useNativeDriver: true, // <-- Add this
    }).start((res) => {
      // Logic whenever an iteration finishes...
      //console.log('ended '+res.finished);

      this.isMoving = false;
    });
       
  }
    
  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    
    var img;
    
    if (this.props.hit){
      img = require('./images/explosion2.png');
    }
    else
      img = require('./images/death.png');
      
    return (
       
      <Animated.View 
        style={{
          overflow: "hidden",
          width: 80,
          height: 80,
          position: "absolute",
          transform: [ { translateX: x}, 
                       { translateY: this.animatedValue.interpolate({ //interpolacja w dokumentacji reacta po prsotu idzie se animacja od 0 do 1 czyli od dolu do gory i napisane pixele na sztywno
                    inputRange:  [0, 1],             
                    outputRange: [-80, 800]}) } ]
        }}
      >
     
     <Image
        style={{
          height: 80,
          width: 80,
          top: 0,
          left: 0,
          resizeMode: 'stretch'
        }}
        source={img}
      />
        
      </Animated.View>
    );
  }
}



class Virus extends PureComponent { //wlasciwy wirus
  
  constructor(props) {
    super(props);
    
    renderers[this.props.id] = this;
    // console.log("xd" + JSON.stringify(renderers[this.props.id])); // co to 
    this.animatedValue = new Animated.Value(0);
    // UWAGA! Nie ma innej mozliwosci na pobranie tej wartości synchronicznie
    this.animatedValue.addListener(({value}) => this._animatedValue = value); 
    this.isMoving = false;
  }	
    
  // uruchamia plynna animację/poruszanie sie koronawirusa z góry ekranu na dół
  play = (delay) => {
    this.animatedValue.setValue(0);
    this.isMoving = true;
        
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: delay,
      easing: Easing.linear,
      useNativeDriver: true, // <-- Add this
    }).start((res) => {
      // Logic whenever an iteration finishes...
      //console.log('ended '+res.finished);

      this.isMoving = false;
    });
       
  }
    
  render() {
    const x = this.props.position[0];
    const y = this.props.position[1];
    
    var img;
    
    if (this.props.hit){
      img = require('./images/explosion.png');
    }
    else
      img = require('./images/virus.png');
      
    return (
       
      <Animated.View 
        style={{
          overflow: "hidden",
          width: 80,
          height: 80,
          position: "absolute",
          transform: [ { translateX: x}, 
                       { translateY: this.animatedValue.interpolate({ //interpolacja w dokumentacji reacta po prsotu idzie se animacja od 0 do 1 czyli od dolu do gory i napisane pixele na sztywno
                    inputRange:  [0, 1],             
                    outputRange: [-80, 800]}) } ]
        }}
      >
     
     <Image
        style={{
          height: 80,
          width: 80,
          top: 0,
          left: 0,
          resizeMode: 'stretch'
        }}
        source={img}
      />
        
      </Animated.View>
    );
  }
}

class Background extends PureComponent {
  
  constructor(props) {
    super(props);
    
    renderers[this.props.id] = this; 
    this.animatedValue = new Animated.Value(0);
    
    this.play();
  }	
  
  play = () => {
   
    this.animatedValue.setValue(0);
        
    var animation = Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 8000,
      easing: Easing.linear,
      useNativeDriver: true, // <-- Add this
    });
        
    Animated.loop(animation).start(); //zapetlenie
    
  }
    
  render() {
    return (
      <View 
        style={{
          overflow: "hidden",
          width: 412,
          height: 2*684,
          backgroundColor: "black",
          position: "absolute",
          left: 0,
          top: 0 }}
      >
	    <Animated.Image
        style={{
          width: 412,
          height: 4*412,
          transform: [ { translateX: 0}, 
                       { translateY: this.animatedValue.interpolate({
                    inputRange:  [0, 1],
                    outputRange: [-412, 1]}) } ]
        }}
        fadeDuration={0} 
        source={require('./images/bkgnd1_2x1_1080x2340.png')}
        resizeMode={"stretch"}
      />
	  </View>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"

  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
 
export { Virus, Background, Fighter, Score, Bullet, Znajdzka, Znajdzka2, Znajdzka3};


