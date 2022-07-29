$(document).ready(function () {
  $.getJSON(
    "http://localhost:3000/foodtype/fetch_all_foodtype",
    function (data) {
      if (data.status) {
        data.result.map((item) => {
          $("#foodtype").append(
            $("<option>").text(item.FoodTypename).val(item.FoodTypeid)
          );
        });
        $("#foodtype").formSelect();
      } else {
        alert("Server Error...");
      }
    }
  );
  $("#foodtype").change(function () {
    $.getJSON(
      "http://localhost:3000/foodtype/fetch_all_food",
      { FoodTypeid: $("#foodtype").val() },
      function (data) {
        //alert(JSON.stringify(data));
        if (data.status) {
          $("#food").empty();
          $("#food").append($("<option>").text("Choose your Food"));
          data.result.map((item) => {
            //alert(item.statename);
            $("#food").append(
              $("<option>").text(item.FoodName).val(item.Foodid)
            );
          });
          $("#food").formSelect();
        } else {
          alert("Server Error!");
        }
      }
    );
  });
});
