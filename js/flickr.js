/*jslint browser:true */
/*global alert*/
(function (){
  // Verify the form if any value was submitted and starts the application
  var form = document.getElementById("form");
  form.onsubmit = function() {
    var gallery_id = document.getElementById("gallery_id").value;
    if (gallery_id !== "") {
      var gallery = new GalleryModel(gallery_id);
      gallery.init();
      view = new GalleryView(gallery, {
        thumbsContainer : document.getElementById("thumbsContainer"),
        featuredContainer : document.getElementById("featuredContainer")
      });
      controller = new GalleryController(gallery, view);
    } else {
      alert("Insira o ID de um álbum!");
    }
    return false; // Avoid the submit (refreh)
  };
})();