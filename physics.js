
function Point(x,mass) {
  this.current  = x.slice(); // vec2
  this.previous = x.slice(); // vec2
  this.mass     = mass;      // mass at this point
  this.inverse_mass = 1./mass; // saves repeated divisions during simulation
  this.dt = 5e-3; // time step
  this.fext = vec2.fromValues(0.0,-9.81*mass); // external force (downwards force of gravity)
}

Point.prototype.move = function() {
 
   let twoCurr = this.current.slice();
   vec2.scale(twoCurr, twoCurr, 2);


   let m = Math.pow(this.dt, 2) * this.inverse_mass;
   //console.log(m);
   this.fext[0] = 0.7;//higher number = more wind!
   let mFext = this.fext.slice();
   vec2.scale(mFext, mFext, m);

   let next = vec2.create();
   vec2.sub(next, twoCurr, this.previous);
   vec2.add(next, next, mFext);
    
   this.previous = this.current;
   this.current = next;

}


function Constraint(p,q) {
  this.p = p; // a Point object above, which has coordinates this.p.current (a vec2)
  this.q = q; // a Point object above, which has coordinates this.q.current (a vec2)
  this.rest_length = vec2.distance( p.current , q.current ); // scalar rest length of the spring
}

Constraint.prototype.satisfy = function() {

  let l = vec2.distance(this.q.current, this.p.current);
  let delta = (l - this.rest_length) / l;

  let diff = vec2.create();
  vec2.sub(diff, this.q.current, this.p.current);
  let dx = vec2.create();
  vec2.scale(dx, diff, delta);

  let mt = (this.p.mass * this.q.mass) / (this.p.mass + this.q.mass);
  
  let x = mt * this.p.inverse_mass;
  let y = mt * this.q.inverse_mass;

  let dxp = vec2.create();
  vec2.scale(dxp, dx, x);

  let dxq = vec2.create();
  vec2.scale(dxq, dx, y);
  
  vec2.add(this.p.current, this.p.current, dxp );
  vec2.sub(this.q.current, this.q.current, dxq );
  
}

