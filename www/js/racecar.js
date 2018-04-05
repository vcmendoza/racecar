var app = {
  inicio: function() {
    MY_CAR = 150;
    OPENING = 50;

    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;


    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function() {

    function preload() {

      //game.stage.backgroundColor = '#777';
      game.load.image('pista', "../img/pista.jpg");
      game.load.image('my_car', '../img/my_car.svg');
      game.load.image('shock','../img/shock.png');
      game.load.spritesheet('car','../img/car.svg',50,50);
    }

    var car1;
    var car2;


    function create() {
      var fondo_wd = 159;
      var fondo_sc = game.width / fondo_wd;

      game.physics.startSystem(Phaser.Physics.ARCADE);
      fondo = game.add.tileSprite(0,0,game.width, game.height,'pista');
      fondo.tileScale.x = fondo_sc;


      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });

//    face_shock = game.add.sprite(game.world.centerX, game.world.centerY,'shock');
//    face_shock.anchor.setTo(0.5,0.5);


      car1 = game.add.sprite((game.width/3)-25, app.inicioY(),'car');
      car2 = game.add.sprite(game.width/3*2-25, app.inicioY(),'car');

      game.physics.arcade.enable([car1, car2]);


      car1.body.velocity.setTo(0,(Math.floor((Math.random() * 4) + 1)) * 100);
      car1.body.bounce.set(1);
    //  car1.body.collideWorldBounds = true;
      car1.body.onWorldBounds = new Phaser.Signal();

      car2.body.velocity.setTo(0,(Math.floor((Math.random() * 4) + 1)) * 100);
      car2.body.bounce.set(1);
    //  car2.body.collideWorldBounds = true;
      car2.body.onWorldBounds = new Phaser.Signal();


      //game.physics.startSystem(Phaser.Physics.ARCADE);
      my_car = game.add.sprite(app.inicioX(), app.inicioY(), 'my_car');
      game.physics.arcade.enable(my_car);
      my_car.body.collideWorldBounds = true;
      my_car.body.checkCollision.up = false;
      my_car.body.checkCollision.down = false;
      my_car.body.onWorldBounds = new Phaser.Signal();
      my_car.body.onWorldBounds.add(app.decrementaPuntuacion, this);

      //game.physics.arcade.overlap(my_car,[car1,car2], reiniciar,null,this);



    }

    function screenWrap (sprite) {

        if (sprite.x < 0)
        {
            sprite.x = game.width;
        }
        else if (sprite.x > game.width)
        {
            sprite.x = 0;
        }

        if (sprite.y < 0)
        {
            sprite.y = game.height;
        }
        else if (sprite.y > game.height)
        {
            sprite.y = 0;
          vel = (Math.floor((Math.random() * 4) + 2)) * 70;
      sprite.body.velocity.y = vel;
        }


    }

    function update() {

      my_car.body.velocity.y = (velocidadY * 200);
      my_car.body.velocity.x = (velocidadX * -200);

      if (my_car.alive) {app.incrementaPuntuacion(1);}

      game.physics.arcade.overlap(my_car,[car1,car2], app.reiniciar,null,this);
      screenWrap(car1);
      screenWrap(car2);


    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },


  decrementaPuntuacion: function() {
    puntuacion = puntuacion - 1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function() {
    puntuacion = puntuacion + 1;
    scoreText.text = puntuacion;
  },

  reiniciar: function() {

    puntuacion = Math.floor(puntuacion/2);
    scoreText.text = puntuacion;
 //   setTimeout(app.fadePauseScreen, 8000);


//    game.physics.arcade.enable(face_shock);

  //  game.time.events.add(4000,app.fadeFace, this);

  },

  fadeFace: function() {


    game.add.tween(face_shock).to( { alpha:0 }, 2000, Phaser.Easing.Linear.None, true);
  },

  fadePauseScreen: function() {


    //msj = game.add.text(10, alto/2, 'You crash', { font: '50px Arial', fill: '#fff' });
    game.pause = true;

  },

  inicioX: function() {
   return app.numeroAleatorioHasta(ancho - MY_CAR);
   // return game.ancho / 2;
  },

  inicioY: function() {
    return app.numeroAleatorioHasta(alto - MY_CAR);
    //return game.alto - (MY_CAR + 20);
  },

  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function() {

    function onError() {
      console.log('onError!');
    }

    function onSuccess(datosAceleracion) {
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 20 });
  },

  detectaAgitacion: function(datosAceleracion) {
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY) {
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function() {
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion) {
    velocidadX = datosAceleracion.x;
    velocidadY = datosAceleracion.y;
  }
};

if ('addEventListener'in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}
