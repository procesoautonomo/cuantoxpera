$(document).ready(function () {
  let acl = new Accelerometer({ frequency: 60 });

  acl.addEventListener("reading", () => {
    console.log("Acceleration along the X-axis " + acl.x);
    console.log("Acceleration along the Y-axis " + acl.y);
    console.log("Acceleration along the Z-axis " + acl.z);

    $("#ul_acc").empty();

    var li_X = "<li>\
            <div> Acceleration along the X-axis " + map(Math.abs(acl.x.toPrecision(2)),0,9.9,0,255) + "\
            </div>\
        </li>";
    $("#ul_acc").append(li_X);

    var li_Y = "<li>\
        <div> Acceleration along the Y-axis " + map(Math.abs(acl.y.toPrecision(2)),0,9.9,0,255) + "\
        </div>\
    </li>";
    $("#ul_acc").append(li_Y);

    var li_Z = "<li>\
            <div> Acceleration along the Z-axis " + map(Math.abs(acl.z.toPrecision(2)),0,9.9,0,255) + "\
            </div>\
        </li>";
    $("#ul_acc").append(li_Z);
  });

  acl.start();
});

function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
}
