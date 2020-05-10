import { Accelerometer } from 'expo-sensors';

const VirusSpawner = (entities, { touches, time }) => {
  
  // petla logiki jest uruchamiana co 16ms... w teorii, w praktyce sa to pobozne zyczenia
  // i odstep czasowy miedzy kolejnymi wywolaniami tej funckji moze wyniesc nawet 100-200ms szczegolnie w emulatorach 
  // co skutkowałoby plynnoscią animacji na poziomie 5-10FPS dlatego zamiast bezposrednio kontrolować pozycję obiektow sceny
  // w petli logiki, lepiej jedynie w niej inicjowac i kontrolować przebieg animacji a sama petla animacji jest realizowana
  // wewnętrznie asynchronicznie ze wsparciem sprzętowym => patrz komponenty Animated w renderers.js  

  for (var key in entities) 
    if (entities[key].type == 'v') { // wirusy

      let id = entities[key].id;
      
      if (renderers[id] && renderers[id].isMoving) { // porusza sie
        // przyblizona (ostatnia) pozycja y wirusa
        // _animatedValue jest uaktualnane asynchronicznie callbackiem
        //console.log(renderers[id]._animatedValue); 

        let x = entities[id].position[0]+40;
        let y = 684*renderers[id]._animatedValue+40;
        
        if (Math.abs(entities[2].position[0]+64 - x) < 64 &&
            Math.abs(entities[2].position[1]+64 - y) < 64){
              if(entities[id].isHit===false){
                entities[id].isHit=true;
                entities[id].hit = 1;
                entities[6].amount++;
                console.log(entities[6].amount);
              }
          }
      }
           
      if (renderers[id] && !renderers[id].isMoving) { // "uspiony" za krawedzią ekranu
        let d = 1000*Math.random();
        if (d < 10) { // czestotliwosc wypuszczania nowych wirusow = 10/1000 = 0.01 (czyli 1 raz na 100 tikow)
          entities[id].position = [(412-80)*Math.random(), 0]; // losowa pozycja x
          entities[id].hit = 0;
          entities[id].isHit = false;
          renderers[id].play(4000 + 4000*Math.random()); // losowy czas animacji (przelotu przez cały ekran) 4-8s
        }
      }
    }
     
  return entities;
};

const ShootAmmo = (entities, { touches }) => {

  if (renderers[7] && !renderers[7].isAnimating)
    renderers[7].play("idle");	
  
  //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
  //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
  //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
  //-- That said, it's probably worth considering performance implications in either case.
 
  touches.filter(t => t.type === "press").forEach(t => {
       
    let bul = entities[7];
    
    if (bul && bul.position) {
      let count = 0;
      bul.position[0]=entities[2].position[0];
      bul.position[1]=entities[2].position[1];
      // entities[7].position[0]=finger.position[0];
      // entities[7].position[1]=finger.position[1];
      entities[7].position[0]=entities[7].position[0]+2;
      entities[7].position[0]= entities[7].position[0]+2;

      console.log("position"+ entities[7].position[0]+" "+ entities[7].position[1]);
    }
  });
 
  return entities;
};

const MoveFighter = (entities, {touches}) => {
  if (renderers[2] && !renderers[2].isAnimating)
    renderers[2].play("idle");
    // console.log(renderers);
    // console.log(props);
    // console.log(currY);
  
  //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
  //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
  //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
  //-- That said, it's probably worth considering performance implications in either case.

  touches.filter(t => t.type === "press").forEach(t => {
       
    let finger = entities[7];
    
    if (finger && finger.position) {
      finger.position = [
        finger.position[0]= entities[2].position[1],
        finger.position[1]= entities[2].position[0]
      ];
      console.log("pagex: "+finger.position[0]);
      console.log("pagey: "+finger.position[1]);
      
      // console.log(t.delta.pageX);
      // console.log(t.delta.pageY);
      
      
    }
  });


    let finger = entities[2];
    if (finger && finger.position) {
      let diffX
      let diffY;
      Accelerometer.addListener(accelerometerData => {
        diffX=Math.round(Number(JSON.stringify(accelerometerData.x))*10);
        diffY=Math.round(Number(JSON.stringify(accelerometerData.y))*10);
        finger.position = [
          finger.position[0]=finger.position[0]- Math.round(Number(JSON.stringify(accelerometerData.x))*10),
          finger.position[1]=finger.position[1] + Math.round(Number(JSON.stringify(accelerometerData.y))*10),
        ];
        Accelerometer.removeAllListeners();
      });
      

      
      
    }

  return entities;
};
 
export { MoveFighter, VirusSpawner, ShootAmmo };