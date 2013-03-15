function GalleryView(model, elements) {

  this._model = model;
  this._elements = elements;

  this.nextButtonClicked = new Event(this);
  this.previousButtonClicked = new Event(this);
  this.thumbClicked = new Event(this);
  this.pageClicked = new Event(this);

  var _this = this;

  // attach model listeners
  this._model.photosAdded.attach(function() {
      _this.createList();
  });
  this._model.photoFeatured.attach(function() {
      _this.setFeatured();
  });

  this._model.pageChanged.attach(function() {
      _this.setPage();
  });

  // Define the containers
  var featuredContainer = this._elements.featuredContainer;

  this._thumbs = document.createElement("ul");
  this._thumbs.className = "thumbnails";

  // Create the navigation buttons between photos
  var controller = document.createElement("div");
  controller.id = "controller";
  var nextPhoto = document.createElement("div");
  nextPhoto.id = "nextPhoto";
  nextPhoto.innerHTML = "<a href=\"javascript:;\"><span></span></a>";
  var previousPhoto = document.createElement("div");
  previousPhoto.id = "previousPhoto";
  previousPhoto.innerHTML = "<a href=\"javascript:;\"><span></span></a>";
  controller.appendChild(previousPhoto);
  controller.appendChild(nextPhoto);

  nextPhoto.onclick = function() {
    _this.nextButtonClicked.notify();
  };

  previousPhoto.onclick = function() {
    _this.previousButtonClicked.notify();
  };

  // Create the container for the featured photo
  var featuredImgContainer = document.createElement("div");
  featuredImgContainer.className = "featuredImgContainer";
  var holder = document.createElement("div");
  holder.id = "holder";
  holder.appendChild(controller);
  featuredImgContainer.appendChild(holder);

  var photoTitle = document.createElement("h1");
  photoTitle.id = "photoTitle";

  // Create the paragraph that will hold the photo counter: Foto i de n
  var featuredCount = document.createElement("p");
  featuredCount.className = "counter";
  featuredCount.id = "featuredCount";

  featuredContainer.appendChild(featuredCount);
  featuredContainer.appendChild(photoTitle);
  featuredContainer.appendChild(featuredImgContainer);

}

GalleryView.prototype = {
  createList : function(){
    var _this = this;
    var photos = this._model.getPhotos();
    for (var i = 0, len = this._model._total; i < len; i++) {
      var format = "q";
      var photo = photos[i];
      var li = document.createElement("li");
      li.className = "span1";
      if (i < this._model._per_page) addClass(li, "show");
      li._index = i;
      li.innerHTML = "<a class=\"thumbnail\" href=\"javascript:;\" title=\"" + photo.title + "\"><img src=\"http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_"+ format +".jpg\" /></a>";
      this._thumbs.appendChild(li);
      li.onclick = function() {
        _this.thumbClicked.notify({ index : this._index});
      };
    }
    this._elements.thumbsContainer.appendChild(this._thumbs);
    this._model.setFeatured(0);
    if (this._model._total > this._model._per_page) this.createPages();
  },
  createPages : function() {
    var pagesContainer = document.createElement("ul");
    pagesContainer.className = "pages";
    var pages = (this._model._total % this._model._per_page) > 0 ? Math.floor(this._model._total / this._model._per_page) + 1 : this._model._total / this._model._per_page;
    var _this = this;
    for (var i = 1; i <= pages; i++) {
      var li = document.createElement("li");
      li.innerHTML = "<a class=\"page\" href=\"javascript:;\" title=\"Página " + i + "\">" + i + "</a>";
      li.i = i;
      li.onclick = function() {
        _this.pageClicked.notify({ page : this });
      };
      pagesContainer.appendChild(li);
    }
    this._model.setPage(pagesContainer.firstChild);
    this._elements.thumbsContainer.appendChild(pagesContainer);
  },
  setPage : function() {
    var page = this._model._page;
    var activeClass = "active";
    // Checks if the user is selecting on a new page
    if (!hasClass(page, activeClass)) {
      var pages = page.parentNode.childNodes;
      for (var i = 0, len = pages.length; i < len; i++) {
        removeClass(pages[i], activeClass);
      }
      addClass(page, activeClass);
      // Load the correspondent thumbs of the page
      var pageIndex = page.firstChild.innerHTML;
      for (var j = 0; j < this._model._total; j++) {
        var el = this._thumbs.childNodes[j];
        removeClass(el, "show");
        if (j < pageIndex * this._model._per_page && j >= (pageIndex * this._model._per_page) - this._model._per_page) {
          addClass(el, "show");
        }
      }
    }
  },
  setFeatured : function() {
    var oldFeaturedIndex = this._model._oldFeaturedIndex;
    var featuredIndex = this._model._featuredIndex;
    var featured = this._model._photos[featuredIndex];
    var format = "z";
    featuredCount.innerHTML = "Foto <span class=\"badge\">" + (featuredIndex + 1) + "</span> de <span class=\"badge\">" + this._model._total + "</span>";
    photoTitle.innerHTML = featured.title ? featured.title : "Sem título";

    var newImg = document.createElement("img");
    newImg.className = "img-polaroid";
    newImg.src = "http://farm" + featured.farm + ".staticflickr.com/" + featured.server + "/" + featured.id + "_" + featured.secret + "_"+ format +".jpg";

    var actualImg = holder.getElementsByTagName("img")[0];
    if (actualImg) {
      holder.removeChild(actualImg);
    }
    holder.appendChild(newImg);

    var activeClass = "active";

    // Clear the active class of the previous thumb clicked and set the new one
    var thumbs = this._thumbs.childNodes;
    if (typeof oldFeaturedIndex != "undefined") removeClass(thumbs[oldFeaturedIndex].firstChild, activeClass);
    addClass(thumbs[featuredIndex].firstChild, activeClass);


    // Set the nav controllers style to disabled if it's the first or last photo
    previousPhoto.firstChild.className = "";
    nextPhoto.firstChild.className = "";

    if (featuredIndex === 0) {
      previousPhoto.firstChild.className = "disabled";
    }
    if (featuredIndex == this._model._total - 1) {
      nextPhoto.firstChild.className = "disabled";
    }
  }
};