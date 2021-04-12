$(document).ready(function () {
  let acl = new Accelerometer({ frequency: 60 });

  acl.addEventListener("reading", () => {
    console.log("Acceleration along the X-axis " + acl.x);
    console.log("Acceleration along the Y-axis " + acl.y);
    console.log("Acceleration along the Z-axis " + acl.z);
    
    $("#ul_acc").empty();

    var li_X =
      '<li>\
            <div> Acceleration along the X-axis ' +
      acl.x +
      "\
            </div>\
        </li>";
    $("#ul_acc").append(li_X);

    var li_Y =
      '<li>\
        <div> Acceleration along the Y-axis ' +
      acl.y +
      "\
        </div>\
    </li>";
    $("#ul_acc").append(li_Y);

    var li_Z =
      '<li>\
            <div> Acceleration along the Z-axis ' +
      acl.z +
      "\
            </div>\
        </li>";
    $("#ul_acc").append(li_Z);
  });

  acl.start();
});
