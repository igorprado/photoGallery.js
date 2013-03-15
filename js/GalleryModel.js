
function GalleryModel(id) {
    this._gallery_id = id;
    this._api_key = "da9ca8df6dd3e9be07fa4364c5ae1134";
    this._per_page = 12;
    this._featured = {};
    this._photos = [];
    this._page = {};

    this.photoFeatured = new Event(this);
    this.photosAdded = new Event(this);
    this.pageChanged = new Event(this);
  }

  GalleryModel.prototype = {
    init : function() {
      var httpRequest;
      var result = [];
      var _this = this;
      var url = "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + this._api_key + "&photoset_id=" + this._gallery_id + "&format=json&nojsoncallback=1";
      if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // IE
        try {
          httpRequest = new window.ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            httpRequest = new window.ActiveXObject("Microsoft.XMLHTTP");
          } catch (ex) {
            alert("Não foi possível conectar:\n" + ex.toString());
          }
        }
      }

      if (!httpRequest) {
        alert('Não foi possível criar instancia do objeto XMLHTTP');
        return false;
      }
      httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            result = JSON.parse(httpRequest.responseText);
            // Check if the result is ok
            if (result.stat === "fail") {
              alert(result.message);
              return false;
            } else if (result.stat === "ok") {
              _this.setPhotos(result); // After receive the correct JSON, set the photos
            }
          } else {
            alert('Ocorreu um erro durante a requisição.');
          }
        }
      };
      httpRequest.open('GET', url);
      httpRequest.send();
    },
    setPhotos : function(json) {
      var photos = json.photoset.photo;
      this._photos = photos;
      this._total = json.photoset.total;
      this.photosAdded.notify();
    },
    getPhotos : function() {
      return [].concat(this._photos);
    },
    setFeatured : function(index) {
      this._oldFeaturedIndex = this._featuredIndex;
      this._featured = this._photos[index];
      this._featuredIndex = index;
      this.photoFeatured.notify();
    },
    goToNext : function() {
      if (this._featuredIndex === this._total - 1) {
        return false;
      }
      this.setFeatured(this._featuredIndex + 1);
    },
    goToPrevious : function() {
      if (this._featuredIndex === 0) {
        return false;
      }
      this.setFeatured(this._featuredIndex - 1);
    },
    setPage : function(page) {
      this._page = page;
      this.pageChanged.notify();
    }
  };