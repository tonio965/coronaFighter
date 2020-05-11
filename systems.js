import { Accelerometer } from 'expo-sensors';

const VirusSpawner = (entities, { touches, time }) => { //to tez sie tak nazwyalo
  

  for (var key in entities)  //petla idaca po kazdym bylo juz
    if (entities[key].type == 'v') { // wirusy to te bylo <- petla przechodzi po kazdym wirusie z entity

      let id = entities[key].id; //pobiera id
      
      if (renderers[id] && renderers[id].isMoving) { //sprawdza czy sie rusza 

        let x = entities[id].position[0]+40; //jezeli tak to przypisuje x oraz y 
        let y = 684*renderers[id]._animatedValue+40;

        
        if (Math.abs(entities[2].position[0]+64 - x) < 64 && // ze statkiem zderzenie bo entity 2  zatem pozmieniajcie kolejnosc i nazwy w calym if
            Math.abs(entities[2].position[1]+64 - y) < 64){
              if(entities[id].isHit===false){ //jezeli staek jest blisko wirusa o kilka px to zalizza ze sie rozjebal
                entities[id].isHit=true; //wiec zaznaczam ishit na true
                entities[id].hit = 1;
                entities[6].amount++; //dodaje punkty 
                // console.log(entities[6].amount);
                entities[8].amount--;//odejmuje 1 zycia
              }
          }
          if(renderers[7] && renderers[7].isMoving){  //na tej samej zasadzie co ze statkiem (jak bedzie zmieniany  obrazek pocisku i wielkosc to zmienic wartosci liczb w ifach)
            let xBul = entities[7].position[1]+40;
            let yBul = 684*renderers[7]._animatedValue+40;
            // if(-30 < Math.abs(x- xBul) && 30 > Math.abs(x- xBul)){
            //   console.log(" x hit"+ Math.abs(x- xBul));

            // }

            if (-30 < Math.abs(x- xBul) && 30 > Math.abs(x- xBul) && //z bulletem zderzenie
            Math.abs(yBul - y) < 30){
              if(entities[id].isHit===false){
                entities[id].isHit=true;
                entities[id].hit = 1;
                entities[6].amount++;

              }
          }
          }
      }
           
      if (renderers[id] && !renderers[id].isMoving) { // ten blok kodu gotowy byl i respi virusy 
        let d = 1000*Math.random();
        if (d < 10) { 
          entities[id].position = [(412-80)*Math.random(), 0];
          entities[id].hit = 0;
          entities[id].isHit = false;
          renderers[id].play(4000 + 4000*Math.random()); 
        }
      }
    }
     
  return entities;
};

const ShootAmmo = (entities, { touches }) => {  //to moj kontroller calkowicie zbudowany od nowa


 
  touches.filter(t => t.type === "press").forEach(t => { //to mozna zostawic bo jest to po prsotu wykrywanie dotyku na ekranie
       
    let finger = entities[7]; // w app.js jest lista entities i zawiera ona elementy gry 7 element to pocisk (mozecie pozmieniac kolejnosc typy i nazwy) i sam dodalem go
    
    if (finger && finger.position) {  //tutaj ustalam pozycje kliku w sumie mozna pozmieniac nazwy 
      finger.position = [
        finger.position[0]= entities[2].position[1],
        finger.position[1]= entities[2].position[0]
      ];
      renderers[7].play();  // ta tabela robi się automatico dla wszyskich entities - jak w entityies jest 7 elemtnem pocisk jego renderem jest Bullet z renderers.js i to wlasnie wywoluje jego metode play()
    }
  });
 
  return entities; //zwracam zmieniona tablice entities co 16ms 
};

const MoveFighter = (entities, {touches}) => { //metoda moveFighter juz istnieala wiec mozna zostawic nazwe
    let finger = entities[2]; //to jest statek, pobieram z listy jego pozycje itp
    if (finger && finger.position) {
      let diffX
      let diffY;
      Accelerometer.addListener(accelerometerData => { //implementuje akcelerometr tak samo jak w poprzednim zadaniu
        diffX=Math.round(Number(JSON.stringify(accelerometerData.x))*10); //czemu nazwalem to diffX juz nie pamietam mozna zmainic 
        diffY=Math.round(Number(JSON.stringify(accelerometerData.y))*10);
        finger.position = [
          finger.position[0]=finger.position[0]- Math.round(Number(JSON.stringify(accelerometerData.x))*10), //tu nie ma rocket science, pozmieniajcie nazwy tylko 
          finger.position[1]=finger.position[1] + Math.round(Number(JSON.stringify(accelerometerData.y))*10),
        ];
        Accelerometer.removeAllListeners(); //wywalam to bo wpadalo w jakas nieskonczona petle i sie nie animowalo nic wiec na nowo z kazda klatka odpalam listernera
      });
      

      
      
    }

  return entities;
};
 
export { MoveFighter, VirusSpawner, ShootAmmo }; //eksportuje kotrolery