function GalleryController(model, view) {
  this._model = model;
  this._view = view;

  var _this = this;

  this._view.nextButtonClicked.attach(function(){
    _this.goToNext();
  });

  this._view.previousButtonClicked.attach(function(){
    _this.goToPrevious();
  });

  this._view.thumbClicked.attach(function(sender, args){
    _this.loadPhoto(args.index);
  });

  this._view.pageClicked.attach(function(sender, args){
    _this.setPage(args.page);
  });
}

GalleryController.prototype = {
  goToNext : function() {
    this._model.goToNext();
  },
  goToPrevious : function() {
    this._model.goToPrevious();
  },
  loadPhoto : function(photo) {
    this._model.setFeatured(photo);
  },
  setPage : function(page) {
    this._model.setPage(page);
  }
};