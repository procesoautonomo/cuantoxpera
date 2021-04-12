$(document).ready(function () {
  let acl = new Accelerometer({ frequency: 60 });

  acl.addEventListener("reading", () => {
    console.log("Acceleration along the X-axis " + acl.x);
    console.log("Acceleration along the Y-axis " + acl.y);
    console.log("Acceleration along the Z-axis " + acl.z);

    var x = Math.round(map(Math.abs(acl.x.toPrecision(2)), 0, 10, 0, 255));
    var y = Math.round(map(Math.abs(acl.y.toPrecision(2)), 0, 10, 0, 255));
    var z = Math.round(map(Math.abs(acl.z.toPrecision(2)), 0, 10, 0, 255));

    var li_X = "<li>\
            <div> Acceleration along the X-axis " + x + "\
            </div>\
        </li>";
    
    var li_Y = "<li>\
        <div> Acceleration along the Y-axis " + y + "\
        </div>\
    </li>";

    var li_Z = "<li>\
            <div> Acceleration along the Z-axis " + z + "\
            </div>\
        </li>";

    $("#ul_acc").empty();
    $("#ul_acc").append(li_X);
    $("#ul_acc").append(li_Y);
    $("#ul_acc").append(li_Z);

    var thergb = "rgb(" + x + "," + y + "," + z + ")";
    $("#ul_acc").css( "background-color", thergb );
    
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
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}
