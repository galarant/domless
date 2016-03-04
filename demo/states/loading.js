class LoadingState extends Phaser.State {

  preload() {
    this.ready = false;

    //show the preloader while assets are loading
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.preloader = this.add.sprite(this.game.world.centerX,
                                     this.game.world.centerY,
                                     "preloader");
    this.preloader.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.preloader);

    // ** LOAD DEMO-SPECIFIC ASSETS ** //

    // load demo image assets
    this.load.image("bg", "static/assets/demo/bg.png");
    this.load.image("ground", "static/assets/demo/ground.png");
    this.load.image("avatar", "static/assets/demo/avatar.png");

    // ** LOAD DOMLESS PACKAGE ASSETS ** //

    // load domless button image assets
    this.load.image("button_squircle", "static/assets/images/button/squircle.png");
    this.load.image("button_rectircle", "static/assets/images/button/rectircle.png");
    this.load.image("button_squircle_fill", "static/assets/images/button/squircle_fill.png");

    // load domless modal image assets
    this.load.image("modal_bg", "static/assets/images/modal/bg.png");

    // load domless fonts
    this.load.bitmapFont("proxima_nova",
      "static/assets/fonts/proxima_nova.png",
      "static/assets/fonts/proxima_nova.xml");
  }

  create() {
    this.preloader.cropEnabled = false;
  }

  update() {
    if(this.ready) {
      this.game.state.start("play");
    }
  }

  onLoadComplete() {
    this.ready = true;
  }

}

export default LoadingState;
