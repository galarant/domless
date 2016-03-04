class BootState extends Phaser.State {

  preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.trackParentInterval = 500;
    this.load.image("preloader", "static/assets/demo/preloader.png");
  }

  create() {
    this.game.state.start("loading");
  }

}

export default BootState;
