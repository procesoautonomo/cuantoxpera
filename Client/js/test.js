$(document).ready(function () {
  let acl = new Accelerometer({ frequency: 60 });

  acl.addEventListener("reading", () => {
    console.log("Acceleration along the X-axis " + acl.x);
    console.log("Acceleration along the Y-axis " + acl.y);
    console.log("Acceleration along the Z-axis " + acl.z);
    
    $("#ul_personas").empty();

    var li_X =
      '<li class="flex items-center justify-between bg-orange-primary text-sm text-white sm:text-base placeholder-gray-500 pl-1 pr-4 rounded-lg border-2 border-white w-full py-2 focus:outline-none mb-3">\
            <div> Acceleration along the X-axis ' +
      acl.x +
      "\
            </div>\
        </li>";
    $("#ul_personas").append(li_X);

    var li_Y =
      '<li class="flex items-center justify-between bg-orange-primary text-sm text-white sm:text-base placeholder-gray-500 pl-1 pr-4 rounded-lg border-2 border-white w-full py-2 focus:outline-none mb-3">\
        <div> Acceleration along the X-axis ' +
      acl.y +
      "\
        </div>\
    </li>";
    $("#ul_personas").append(li_Y);

    var li_Z =
      '<li class="flex items-center justify-between bg-orange-primary text-sm text-white sm:text-base placeholder-gray-500 pl-1 pr-4 rounded-lg border-2 border-white w-full py-2 focus:outline-none mb-3">\
            <div> Acceleration along the X-axis ' +
      acl.z +
      "\
            </div>\
        </li>";
    $("#ul_personas").append(li_Z);

    $("#panel_personas").show();
  });

  acl.start();
});
