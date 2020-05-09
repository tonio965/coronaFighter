import React, { PureComponent } from "react";
import { StyleSheet, View, Animated, Easing, Image } from "react-native";
import SpriteSheet from 'rn-sprite-sheet';
 
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

class Virus extends PureComponent {
  
  constructor(props) {
    super(props);
    
    renderers[this.props.id] = this; 
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
    
    if (this.props.hit)
      img = require('./images/explosion.png');
    else
      img = require('./images/virus.png');
    
      
    // Poniżej animowany/przesuwany widok w którym osadzony jest statyczny obraz. 
    // W celu zrobienia poruszajacej się animacji wybuchu (czyli animacja w animacji) wystarczy podmienić <Image> na <SpriteSheet> 
    // a następnie w kontrolerach (systems.js) odpalać tą animację podobnie jak w metodą play().
    // Można też pozostawic jak jest i w kontrolerze "na piechotkę" decydowac jaka klatka ma się wyświetlać
    // poprzez odpowiedni atrybut, ktory jest kopiowny do this.props.hit (patrz wyżej) 
    
    // Interpretacja parametrow dla animatedValue.interpolate:
    //   jak animatedValue == 0 to translateY == -80
    //   jak animatedValue == 1 to translateY == 684 
    //   jak pomiedzy 0 i 1 patrz interpolacja liniowa
      
    return (
       
      <Animated.View 
        style={{
          overflow: "hidden",
          width: 80,
          height: 80,
          position: "absolute",
          transform: [ { translateX: x}, 
                       { translateY: this.animatedValue.interpolate({
                    inputRange:  [0, 1],             
                    outputRange: [-80, 684]}) } ]
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
          height: 684,
          backgroundColor: "black",
          position: "absolute",
          left: 0,
          top: 0 }}
      >
	    <Animated.Image
        style={{
          width: 412,
          height: 3*412,
          transform: [ { translateX: 0}, 
                       { translateY: this.animatedValue.interpolate({
                    inputRange:  [0, 1],
                    outputRange: [-412, 1]}) } ]
        }}
        fadeDuration={0} 
        source={require('./images/bkgnd1_2x1.png')}
        resizeMode={"stretch"}
      />
	  </View>
    );
  }
}
 
export { Virus, Background, Fighter};


