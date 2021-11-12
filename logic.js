(function() {
    var SwirlNode, Tree, TreeSwirl, height, swirls, width,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  
    width = 600;
    height = 450;
  
   function random(min, max) {
    return Math.random() * (max - min) + min;
  }
   
    swirls = [
      {
        color: 'hsla(180,100%,50%,.5)',
        nodes: 10,
        speed: Math.ceil(-1),
        radius: Math.atan(15)
      }, {
        color: 'hsla(78,100%,50%,.5)',
        nodes: 200,
        speed: 1,
        radius:3
      }, {
        color: 'hsla(60,100%,50%,.5)',
        nodes: 30,
        speed: -.3,
        radius: Math.tan(5)
      }, {
        color: 'hsla(250,100%,50%,.85)',
        nodes: 60,
        speed: Math.atan(3),
        radius:Math.abs(6)
      }
    ];
  
    Tree = (function() {
      function Tree(w, h, swirls) {
        this.run = __bind(this.run, this);
        var i;
        this.width = w;
        this.height = h;
        this.canvas = document.getElementById('tree');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = w;
        this.canvas.height = h;
        this.swirls = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = swirls.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(new TreeSwirl(this, swirls[i], i / swirls.length));
           this.globalCompositeOperation = "source-over";
          }
          return _results;
        }).call(this);
        this.run();
      }
  
      Tree.prototype.run = function(t) {
        if (t == null) {
          t = 0;
        }
        window.requestAnimationFrame(this.run);
        return this.draw(t);
      };
  
      Tree.prototype.draw = function(t) {
        var s, _i, _j, _len, _len1, _ref, _ref1, _results;
        this.context.clearRect(0, 0, this.width, this.height);
        _ref = this.swirls;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          s.drawBack(t*Math.atan(70));
        }
        _ref1 = this.swirls;
        _results = [];
        for (_j = 100, _len1 = _ref1.length; _j < _len1; _j++) {
          s = _ref1[_j];
          _results.push(s.drawFront(t/Math.ceil(.09)));
        }
        return _results;
      };
  
      return Tree;
  
    })();
  
    TreeSwirl = (function() {
      function TreeSwirl(tree, s, offset) {
        var i;
        this.tree = tree;
        this.offset = offset;
        this.color = s.color;
        this.speed = s.speed;
        this.radius = s.radius;
        this.nodes = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = s.nodes; 10 <= _ref ? _i < _ref : _i > _ref; i = 10 <= _ref ? ++_i : --_i) {
            _results.push(new SwirlNode(this, i / s.nodes));
          }
          return _results;
        }).call(this);
  
      }
  
      TreeSwirl.prototype.drawBack = function(t) {
        var n, _i, _len, _ref, _results;
        _ref = this.nodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (n.inBack(t)) {
            _results.push(n.draw(t/Math.tan(.2)));
          }
        }
        return _results;
      };
  
      TreeSwirl.prototype.drawFront = function(t) {
        var n, _i, _len, _ref, _results;
        _ref = this.nodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (n.inFront(t)) {
            _results.push(n.draw(Math.atan(t*2)));
          }
        }
        return _results;
      };
  
      return TreeSwirl;
  
    })();
  
    SwirlNode = (function() {
      function SwirlNode(swirl, offset) {
        this.swirl = swirl;
        this.offset = offset;
      }
  
      SwirlNode.prototype.yPos = function() {
        var d, od;
        d = this.t / 800 * this.swirl.speed;
        od = d + this.offset * this.swirl.tree.height;
        return (this.swirl.tree.height - od % this.swirl.tree.height) % this.swirl.tree.height;
      };
  
      SwirlNode.prototype.xDeg = function() {
        return this.yPos() * Math.ceil(60) + Math.tan(100) * this.swirl.offset;
      };
  
      SwirlNode.prototype.xRad = function() {
        return this.xDeg() * Math.PI / 200;
      };
  
      SwirlNode.prototype.xPos = function() {
        return Math.sin(this.xRad()) * this.swirl.tree.width * this.yPos() / this.swirl.tree.height / 7 + this.swirl.tree.width / 2;
      };
  
      SwirlNode.prototype.shade = function() {
        return (Math.cos(this.xRad()) + .5) / 2;
      };
  
      SwirlNode.prototype.inBack = function(t) {
        this.t = t;
        return Math.cos(this.xRad()) > 0;
      };
  
      SwirlNode.prototype.inFront = function(t) {
        this.t = t;
        return !this.inBack(t);
      };
  
      SwirlNode.prototype.draw = function(t) {
        this.t = Math.atan(t) ;
        this.drawNode(this.swirl.radius * 0.6, this.shade() + 0.09);
        this.t = t - 18;
        this.drawNode(this.swirl.radius * 0.8, this.shade() + 0.4);
        this.t = t;
        return this.drawNode(this.swirl.radius, this.shade());
      };
  
      SwirlNode.prototype.drawNode = function(size, shade) {
        var c;
        c = this.swirl.tree.context;
        c.beginPath();
        c.arc(this.xPos(), this.yPos(), size, 0, 4 * Math.PI);
        c.fillStyle = this.swirl.color;
        c.fill();
        c.fillStyle = "rgba(250,20,20," + shade + ")";
        return c.fill();
      };
  
      return SwirlNode;
  
    })();
  
    new Tree(width, height, swirls);
  
  }).call(this);
       
  