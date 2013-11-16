var method, toRad, _i, _len, _ref;

toRad = function(p_angle) {
  return (p_angle - 90) * Math.PI / 180;
};

_ref = ["drawArc", "drawRoundRect", "drawSlice"];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  method = _ref[_i];
  if (PIXI.Graphics.prototype[method] != null) {
    console.warn("PixiJS already has an " + method + " method defined. It's recommended that you update your code to use the official implementation.");
  }
}

PIXI.Graphics.prototype.drawArc = function(p_x, p_y, p_radius, p_startAngle, p_endAngle) {
  var anglePerSegment, index, segments, totalAngle, x, y, _j;

  totalAngle = p_endAngle - p_startAngle;
  segments = Math.ceil(Math.abs(Math.sqrt(1 - Math.pow(1 - Math.min(p_radius / 60, 1), 2)) * totalAngle * p_radius * 0.01));
  anglePerSegment = totalAngle / segments;
  for (index = _j = 1; 1 <= segments ? _j <= segments : _j >= segments; index = 1 <= segments ? ++_j : --_j) {
    x = p_x + Math.cos(toRad(p_startAngle + (anglePerSegment * index))) * p_radius;
    y = p_y + Math.sin(toRad(p_startAngle + (anglePerSegment * index))) * p_radius;
    this.lineTo(x, y);
  }
  return this;
};

PIXI.Graphics.prototype.drawRoundRect = function(p_x, p_y, p_wdith, p_height, p_radius) {
  var bottom, bottomArcY, left, leftArcX, right, rightArcX, top, topArcY;

  if (p_wdith < p_radius / 2) {
    p_radius = p_width / 2;
  }
  if (p_height < p_radius / 2) {
    p_radius = p_height / 2;
  }
  top = p_y;
  bottom = top + p_height;
  left = p_x;
  right = left + p_wdith;
  rightArcX = right - p_radius;
  leftArcX = left + p_radius;
  topArcY = top + p_radius;
  bottomArcY = bottom - p_radius;
  this.moveTo(leftArcX, top);
  this.lineTo(rightArcX, top);
  this.drawArc(rightArcX, topArcY, p_radius, 0, 90);
  this.lineTo(right, bottomArcY);
  this.drawArc(rightArcX, bottomArcY, p_radius, 90, 180);
  this.lineTo(leftArcX, bottom);
  this.drawArc(leftArcX, bottomArcY, p_radius, 180, 270);
  this.lineTo(left, topArcY);
  this.drawArc(leftArcX, topArcY, p_radius, 270, 360);
  return this;
};

PIXI.Graphics.prototype.drawSlice = function(p_x, p_y, p_startAngle, p_endAngle, p_innerRadius, p_outerRadius) {
  var initialX, initialY;

  initialX = p_x + Math.cos(toRad(p_startAngle)) * p_outerRadius;
  initialY = p_y + Math.sin(toRad(p_startAngle)) * p_outerRadius;
  this.moveTo(initialX, initialY);
  this.drawArc(p_x, p_y, p_outerRadius, p_startAngle, p_endAngle);
  this.lineTo(p_x + Math.cos(toRad(p_endAngle)) * p_innerRadius, p_y + Math.sin(toRad(p_endAngle)) * p_innerRadius);
  this.drawArc(p_x, p_y, p_innerRadius, p_endAngle, p_startAngle);
  this.lineTo(initialX, initialY);
  return this;
};