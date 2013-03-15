// Helper functions to manipulate the CSS Class
function hasClass(el, elClass) {
  if (el.className.indexOf(elClass) > 0) {
    return true;
  }
  return false;
}

function addClass(el, elClass) {
  if (el.className.indexOf(elClass) === -1) {
    el.className += " " + elClass;
  }
}

function removeClass(el, elClass) {
  if (el.className.indexOf(elClass) > 0) {
    var re = new RegExp(elClass, "i");
    el.className = el.className.replace(re, "");
    el.className.trim();
  }
}

function Event(sender) {
  this._sender = sender;
  this._listeners = [];
}

Event.prototype = {
  attach : function (listener) {
      this._listeners.push(listener);
  },
  notify : function (args) {
      var index;

      for (index = 0; index < this._listeners.length; index += 1) {
          this._listeners[index](this._sender, args);
      }
  }
};