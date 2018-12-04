<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>testing</title>

	<!-- leaftlet stuff cgdgfdg-->
	<link rel="stylesheet" href="/leaflet/leaflet.css" />
	<script src="/leaflet/leaflet.js"></script>

	<script src="libraries/p5.js"></script>
	<script src="libraries/p5.dom.js"></script>
	<script src="libraries/p5.sound.js"></script>
	<script src="sketch.js"></script>
	<script src="libraries/api.js"></script>

	<link rel="stylesheet" href="/jquery/jquery-ui-1.12.1/jquery-ui.min.css" type="text/css">
	<script src="/jquery/jquery-3.3.1.min.js"></script>
  <script src="/jquery/jquery-ui-1.12.1/jquery-ui.min.js"></script>







	<!--<script src ="node_modules/request/request.js"></script>

	<Script type="text/javascript" scr= "require.js" data-main="config"> </script>
	-->


	<script language="javascript">

  function getLocationDetails(locationString, runAfterDown){
    $.post("http://localhost/test/index.php",//normal website:http://nucraft.net/webservice.php
    {Mode:"Get_LocationDetails", Geohash: locationString},
    function(json){
      if (json.Status == 0) {
        console.log("errer at json status0");
        console.log(json.ErrorMessage);
      } else {
        if (typeof json.locationInfo != "undefined") {
          //var returnIdlingAreasArr = [];
          //var html = '';
          console.log("Raw hourly:" + json.locationInfo.HourlyDistribution)
          var hourlyDisData = json.locationInfo.HourlyDistribution;
          runAfterDown(hourlyDisData);
          //$("#result-div").html(html);
        }
      }
    },'json');
  }

  function Get_IdlingAreas(inputState, inputCity, limit, runAfter){
  			$.post("http://localhost/test/index.php",//normal website:http://nucraft.net/webservice.php
  			{Mode:"Get_IdlingAreas", State: inputState, City: inputCity, Limit:limit },
  			function(json){
  				if (json.Status == 0) {
  					//$("#result-div").html(json.ErrorMessage);
  					//console.log("errer at json status0");
  					//console.log(json.ErrorMessage);
  				} else {
  					if (typeof json.IdlingAreas != "undefined") {
  						var returnIdlingAreasArr = [];
  						//var html = '';
  						for (var i = 0; i < json.IdlingAreas.length; i++) {
  							returnIdlingAreasArr.push(json.IdlingAreas[i]);
  							//var row = json.IdlingAreas[i];
  							//html += '<div>' + row.City + ', ' + row.State + ' (' + row.AverageIdleTime+ ') ' + row.Geohash + '</div>';
  						}
							runAfter(returnIdlingAreasArr);
  						//$("#result-div").html(html);
  					}
  				}
  			},'json');
  			//return returnIdlingAreasArr;
  		}


			function GetIdlingAreasStates (runAfter)
			{
				$.post("http://localhost/test/index.php",//normal website:http://nucraft.net/webservice.php
				{ Mode: "Get_IdlingAreas_States" },
				function(json) {
					if (json.Status == 0) {
						console.log("ERR:" +json.ErrorMessage);
					} else {
						if (typeof json.States != "undefined") {
							var returnArr = [];
							for (var i = 0; i < json.States.length; i++) {
								returnArr.push(json.States[i]);
							}
							runAfter(returnArr);
						}
					}
				}, 'json');
			}

			function GetIdlingAreasCities (state,runAfter)
			{
				$.post("http://localhost/test/index.php",//normal website:http://nucraft.net/webservice.php
				{ Mode: "Get_IdlingAreas_Cities", State: state },
				function(json) {
					if (json.Status == 0) {
					console.log("ERR:" +json.ErrorMessage);
					} else {
						if (typeof json.Cities != "undefined") {
							var returnArr = [];
							for (var i = 0; i < json.Cities.length; i++) {
								returnArr.push(json.Cities[i]);
							}
							runAfter(returnArr);
						}
					}
				}, 'json');
			}

	</script>

	<style>
		body {
			margin:0;
			padding:0;
			overflow: hidden;
		}
		canvas {
			margin:auto;
		}
	</style>
</head>
<body>
</body>
</html>
