

class Colour{
	constructor(ri,gi,bi){
		this.r = ri;
		this.g = gi;
		this.b = bi;
	}

	fillWithThisColour(){
	fill(this.r,this.g,this.b);
	}

	changeColour(newR,newG,newB){
		this.r = newR;
		this.b = newB
		this.g= newG;

	}

	intensityColour(intensity){// from 0-100
		this.b = 0;
		if(isNaN(intensity)){
			this.r=0;
			this.g=0;
			println("ERR: colour intensity is not a number(colour has been set to black)");
		} else{
			if(intensity > 100){
				this.r =255;
				this.b=0
			} else if (intensity<0) {
				this.r=0;
				this.b=100;
			} else{
				this.r = 2.55 * intensity;
				this.g = 255 - 2.55 * intensity;
			}
		}

	}

}


class LoadingBubble{

	constructor(letter,r,g,b, sizei,x,y,offSet,amountOfOffSets){
		this.char = letter;
		this.fillColour = new Colour(r,g,b);
		this.size = sizei;
		this.drawSize = sizei;
		this.posX = x;
		this.posY = y;
		if(offSet%(amountOfOffSets*2)<amountOfOffSets){
			this.shinking = true;
			this.drawSize = sizei - (offSet%amountOfOffSets) * (sizei/(amountOfOffSets*2));
		} else {
			this.shinking = false;
			this.drawSize = 0.5 * sizei + (offSet%amountOfOffSets) * (sizei/(amountOfOffSets*2));
		}
	}

	animate(){
		if(this.shinking){
			this.drawSize -= 0.01 * this.size;
			if(this.drawSize < this.size*0.5){
				this.shinking=false;
			}
		} else {
			this.drawSize += 0.01 * this.size;
			if(this.drawSize > this.size){
				this.shinking=true;
			}
		}

		this.fillColour.fillWithThisColour();
		ellipse(this.posX,this.posY,this.drawSize,this.drawSize);
		fill(0);
		textSize(this.drawSize/2);
		textAlign(CENTER);
		//text(this.char,this.posX - this.drawSize*0.12,this.posY + this.drawSize*0.12);
		text(this.char,this.posX,this.posY + this.drawSize*0.12);

	}

	changePosition(xi,yi){
		this.posX = xi;
		this.posY = yi;
	}

	changeSize(sizei,offSet,amountOfOffSets){
		this.size = sizei;
		if(offSet%(amountOfOffSets*2)<amountOfOffSets){
			this.shinking = true;
			this.drawSize = sizei - (offSet%amountOfOffSets) * (sizei/(amountOfOffSets*2));
		} else {
			this.shinking = false;
			this.drawSize = 0.5 * sizei + (offSet%amountOfOffSets) * (sizei/(amountOfOffSets*2));
		}
	}

}


class LoadingText{
	constructor(text,r,g,b,size,x,y,numOfOffSet){
		this.offSet = numOfOffSet;
		this.vis = true;
		this.arr = [];
		this.arr = text.split('');
		//menuLableArr.forEach((currentValue) => menuItemsArr.push(currentValue) );
		this.bubbleArr = [];
		this.arr.forEach( (curr,index) => {
			this.bubbleArr.push( new LoadingBubble(curr,r,g,b,size,x + index*size,y,index,numOfOffSet) );
		});
		this.x = x;
		this.y = y;
	}

	showLoading(){
		if(this.vis){
			this.bubbleArr.forEach( (curr) =>{
				curr.animate();
			});
		}
	}

	setVis(bool){
		this.vis = bool;
	}

	changePosition(x,y){
		this.bubbleArr.forEach( (curr,index) => {
			curr.changePosition(x + index*curr.size,y);
		});
	}

	changeSize(size){
		this.bubbleArr.forEach( (curr,index) => {
			curr.changeSize(size,index,this.offSet);
		});
	}

}



let urlTestCall = 'https://my485.geotab.com/apiv1/GetVersion';
let url2 = 'https://my485.geotab.com/apiv1/Get?typeName=Device&credentials={%22database%22:%22TU20%22,%22userName%22:%22test@gmail.com%22,%22password%22:%22easyPass%22}';

//const BigQuery = require('@google-cloud/bigquery');

var api;


// Imports the Google Cloud client library
//const BigQuery = require('http');//'@google-cloud/bigquery'

/*
“Copyright 2017, Geotab Inc., made available pursuant to the Geotab Free Data License Terms. See data.geotab.com for more information.”
*/

var enterButton;
var longInput;
var latInput;
var sizeDropDown;


//UI varibles
const marginSpaceing = 10;
const itemHeight = 20;
const subIn = 50;
var menuAmount = 0;
var variation = 0;//y mod
var clickAt= 0;//used for circle
var clicked = false;//used for the circle

var tempLableRef;//use for temperary reference storage
//meun items
var menuOpen = true;
var menuItemsArr = [];
var menuLableArr = [];
var inputCountry;
var inputCity;
var checkBoxsInfo = [];
var inputLimit;

var menuCir;
var menuCirLock;
var menuCirLockLoc;

//information veiw
var oldSuperWindow;
var topCornerConst;
var topCorner;//Vector
var windowMargin = 50;
var infoWindowButtonSize = 70;
var buttonMap;
var buttonGraphs;

//varibles for graph info screen
var currentGraphDict = {};
var orderedGraphValues = [];
var orderedGraphKeys = [];
var highestValue;
var loading = true;

//Varibles for multi menu
var whichMenu = 0;//0=map, 1=graph

//second menu
var secondMenuItems = [];
var menuSizes = []; //0=map.x , 1=map.y, 2=graph.x, 3 =graph.y
var graphMargin = 10;
var geoLocationInput;

var loadingGraph = new LoadingText("Loading. Please Wait",0,150,200,100,200,250,6);
var loadingMapInput = new LoadingText("Loading",0,150,200,100,200,250,3);
var loadingStateInput = new LoadingText("States",0,150,200,100,200,250,3);
var loadingCityInput = new LoadingText("Cities",0,150,200,100,200,250,3);
//asdfkokaslj
var boolOnceCal = true;

var mapDiv;

var leafMap;

function setup() {



	createCanvas(windowWidth, windowHeight);
	oldSuperWindow = createVector(windowWidth,windowHeight);
	menuCir = createVector(150,25,30);
	menuCirLock = createVector(0,0,0);
	menuCirLockLoc = createVector(0,0);
	topCorner = createVector(0,0);
	topCornerConst = createVector(windowMargin + 285  ,windowMargin);


	mapDiv = createDiv();
	mapDiv.id("newMap");
	mapDiv.size(2000,1000);
	mapDiv.position(100,100);

	leafMap = L.map('newMap', {
	    center: [51.505, -0.09],
	    zoom: 13
	});

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoiY2FsdmlubSIsImEiOiJjamw3N2M0MTUwNG1tM3BxaDlwMXVmZWs1In0.r-UQLHAmkU89vj05prMkdQ'
	}).addTo(leafMap);


	//Set up menu bar
	menuLableArr.push( createMenuItem("Serch By...","default","div") );
	inputCountry = itemWithLable("Country","default","select",0,0,true,"Country",60);
	menuLableArr.push(tempLableRef);
	//inputCountry = createMenuItemCustomPos("Country","default","select",subIn,0,true);
	inputCountry.changed(pickedState);
	inputCity = itemWithLable("City","default","select",0,0,false,"City",60);
	menuLableArr.push(tempLableRef);
	//inputCity = createMenuItemCustomPos("City","default","select",subIn,0,false);
	inputCity.changed(pickedCity);
	menuLableArr.push(createMenuItem("Advanced","default","div") );
	inputLimit = inputWithLable(20, 50 ,subIn,0,true,"Limit", 50);
	menuLableArr.push(tempLableRef);

	menuLableArr.forEach((currentValue) => menuItemsArr.push(currentValue) );
	menuItemsArr.push(inputCountry);
	menuItemsArr.push(inputCity);
	checkBoxsInfo.forEach((currentValue) => menuItemsArr.push(currentValue) );
	menuItemsArr.push(inputLimit);

	menuSizes.push(270);// x value
	menuSizes.push( menuAmount*itemHeight + marginSpaceing*menuAmount + marginSpaceing + variation+20 ); //y val
	//end of menu bar
	menuAmount=0;
	variation=0;

	//graphMenu
	geoLocationInput = inputWithLable("dpxpwn7", 50 ,0,0,true,"Location", 60);
	secondMenuItems.push(geoLocationInput);
	secondMenuItems.push(tempLableRef);
	var tempHolder = createMenuItem("Enter","default", "button");
	tempHolder.mousePressed(buttonPressedGetNewGraphData);
	secondMenuItems.push( tempHolder );


	secondMenuItems.forEach(item => item.hide() );

	menuSizes.push(270);
	menuSizes.push(menuAmount*itemHeight + marginSpaceing*menuAmount + marginSpaceing + variation+20);



	buttonMap = itemCreator("Map",topCornerConst.x  ,topCornerConst.y - itemHeight, infoWindowButtonSize,"button");
	buttonMap.mousePressed(buttonMapPressed);
	buttonGraphs = itemCreator("Graphs",topCornerConst.x+infoWindowButtonSize,topCornerConst.y - itemHeight, infoWindowButtonSize,"button");
	buttonGraphs.mousePressed(buttonGraphPressed);

	moveMenu(menuCir.x-120,menuCir.y+25);//move to the circle


	//temperaty set up data for graphMenu

	//recalibrateGraph();
}



function initStates(){
	GetIdlingAreasStates( returnedStates =>{
		returnedStates.forEach((curr) =>{
			inputCountry.option(curr);
		});
		inputCountry.size(170,20);
		loadingMapInput.setVis(false);
		loadingStateInput.setVis(false);
	});

}

function pickedState(){
	loadingMapInput.setVis(true);
	loadingCityInput.setVis(true);
	var removeAll = inputCity.elt;
	var removing = true;
	while(removing){
			if(typeof(removeAll[0]) !=  'undefined'){
				removeAll[0].remove();
			} else{
				removing = false;
			}
	}

	var state = inputCountry.value();
	if(state !=null){
		intitCities(state);
	}
}

function intitCities(stateIn){
	GetIdlingAreasCities(stateIn, returnedCities =>{
		returnedCities.forEach((curr) =>{
			inputCity.option(curr);
		});
		inputCity.size(170,20);
		loadingMapInput.setVis(false);
		loadingCityInput.setVis(false);
	});
}

function pickedCity(){
	if(inputCity.value() != null){
		placeMarkers(inputCountry.value(),inputCity.value() );
	}
}

function placeMarkers(state,city){
	Get_IdlingAreas(state,city, inputLimit.value(), returnLocations =>{
		var adding = true;
		var index = 0;
		while(adding){
				if(typeof(returnLocations[index]) !=  'undefined'){
					var temp = L.marker([returnLocations[index].Latitude, returnLocations[index].Longitude], {
						geolocationMarker : returnLocations[index].Geohash
					}).addTo(leafMap);
					//var draggable = new L.Draggable(temp);
					//draggable.enable();
					temp.on('click', eventData =>{
						graphWithMarkerData(eventData.target.options.geolocationMarker);
					});
				} else{
					adding = false;
				}
				index++;
		}
	});

}

function graphWithMarkerData(geohash){
 geoLocationInput.elt.value = geohash;
 buttonGraphPressed();
 buttonPressedGetNewGraphData();
}

function buttonPressedGetNewGraphData(){
		loadingGraph.setVis(true);
		clearGraph();
		getLocationDetails(geoLocationInput.value(), hourlyDisData =>{
			recalibrateGraph(hourlyDisData );
		});


}


function buttonMapPressed(){

	whichMenu=0;
	if(menuOpen){
		menuItemsArr.forEach(item => item.show() );
	}
	secondMenuItems.forEach(item => item.hide() );
	mapDiv.show();
}

function buttonGraphPressed(){
	whichMenu=1;
	menuItemsArr.forEach(item => item.hide() );
	if(menuOpen){
		secondMenuItems.forEach(item => item.show() );
	}
	mapDiv.hide();
}
//input, button, div, checkbox, select, slider, p, radio

function currentMenuVisable(vis){
	var current;
	if(whichMenu==0){
		current = menuItemsArr;
	} else if(whichMenu ==1){
		current = secondMenuItems;
	}

	if(vis){
		current.forEach(item=>item.show());
	} else {
		current.forEach(item=>item.hide());
	}


}

function moveMenu(x,y){
	var moveBackAmountX = menuLableArr[0].x;
	var moveBackAmountY = menuLableArr[0].y;

	menuItemsArr.forEach( currVal => {
		var thisX =currVal.x;
		var thisY = currVal.y;
		currVal.position(thisX + x - moveBackAmountX, thisY + y - moveBackAmountY);
	});

	secondMenuItems.forEach( currVal => {
		var thisX =currVal.x;
		var thisY = currVal.y;
		currVal.position(thisX + x - moveBackAmountX, thisY + y - moveBackAmountY);
	});

}

function inputWithLable(strName,sizei,x,y,marginOn,labelName,spaceBet){
	if(!marginOn){ variation-= marginSpaceing}
	variation+=y;
	var x = marginSpaceing + x;
	var y = menuAmount*itemHeight + marginSpaceing*menuAmount + marginSpaceing + y + variation;
	menuAmount++;
	var obj = itemCreator(strName,x +spaceBet,y,sizei,"input");

	//create tempLable
	tempLableRef = itemCreator(labelName,x,y,"default","div");
	return obj;
}

function itemWithLable(strName,sizei,id,x,y,marginOn,labelName,spaceBet){
	if(!marginOn){ variation-= marginSpaceing}
	variation+=y;
	var x = marginSpaceing + x;
	var y = menuAmount*itemHeight + marginSpaceing*menuAmount + marginSpaceing + y + variation;
	menuAmount++;
	var obj = itemCreator(strName,x +spaceBet,y,sizei,id);

	//create tempLable
	tempLableRef = itemCreator(labelName,x,y,"default","div");
	return obj;
}

function itemNumID(name){
	if(name == "input"){//0
		return 0;
	} else if(name == "button"){//1
		return 1;
	}else if(name == "div"){//2
		return 2;
	}else if(name == "checkbox"){//3
		return 3;
	}else if(name == "select"){
		return 4;
	}else if(name == "slider"){
		return 5;
	} else {
		console.log("ID Failure");
		return -1;
	}
}

function createMenuItemCustomPos(strName,sizei,id,x,y,marginOn){
	if(!marginOn){ variation-= marginSpaceing}
	variation+=y;
	var x = marginSpaceing + x;
	var y = menuAmount*itemHeight + marginSpaceing*menuAmount + marginSpaceing + y + variation;
	menuAmount++;
	var obj =itemCreator(strName,x,y,sizei,id);
	return obj;

}

function createMenuItem(strName,sizei,id){
	var x = marginSpaceing;
	var y = menuAmount*itemHeight + marginSpaceing*menuAmount + marginSpaceing + variation;
	menuAmount++;
	var obj = itemCreator(strName,x,y,sizei,id);
	return obj;

}

function itemCreator(strName,xLoc,yLoc,sizei,id){
	var obj;
	var idUse;

	if(isNaN(id) ){//true equals using string id system
		idUse = itemNumID(id);
	} else {//faslse means using number id system
		idUse = id;
	}

	switch (idUse) {
		case 0:
			obj = createInput(strName);
			break;
		case 1:
			obj = createButton(strName);
			break;
		case 2:
			obj = createDiv(strName);
			break;
		case 3:
			obj = createCheckbox(strName);
			break;
		case 4:
			obj = createSelect(strName);
			break;
		default:
			console.log("Created item error; Unrecgonized id:" + idUse );
	}
	obj.position(xLoc,yLoc);
	if(!isNaN(sizei)){
		obj.size(sizei);
	}
	return obj;
}

function entered(){
	//check if correct input
	var size = -1;
	var long = -1;
	var lat =-1;

	if(!sizeDropDown.value()){
		console.log("size is not selected");
	} else  size = sizeDropDown.value()
	//Longitude
	if(isNaN(longInput.value()) ){
		console.log("Longitude is not a number");
	} else long = longInput.value()

	//Latitude
	if(isNaN(latInput.value()) ){
		console.log("Latitude is not a number");
	} else lat = latInput.value()


	if(size!=-1 && long!=-1 && lat!=-1 ){
		//start search
		console.log("get data");
		//getData(size,long,lat);
	}


}

function forEachDict(obj, fn) { Object.keys(obj).forEach(key => fn(key, obj[key])); }

function draw() {
	background(20,40,80);


	infoWindowDraw();

  menuMovement();

	//resize window if there is a change in size

	if(windowWidth != oldSuperWindow.x || windowHeight != oldSuperWindow.y){

		oldSuperWindow.x = windowWidth;
		oldSuperWindow.y = windowHeight;
		resizeCanvas(windowWidth, windowHeight);
		//change position of things
		mapDiv.position(topCorner.x,topCorner.y);
	 	mapDiv.size(windowWidth - topCorner.x - windowMargin, windowHeight - topCorner.y - windowMargin);
		buttonMap.position(topCorner.x,topCorner.y - itemHeight);
		buttonGraphs.position(topCorner.x+infoWindowButtonSize,topCorner.y - itemHeight);
		loadingGraph.changeSize((windowWidth -topCorner.x - windowMargin)/ loadingGraph.bubbleArr.length );
		loadingGraph.changePosition(topCorner.x+(loadingGraph.bubbleArr[0].size/2),topCorner.y + (windowHeight - topCorner.y - windowMargin)/3);
	}

	if(boolOnceCal){
		boolOnceCal = false;
		mapDiv.position(topCorner.x,topCorner.y);
	 	mapDiv.size(windowWidth - topCorner.x - windowMargin, windowHeight - topCorner.y - windowMargin);
		buttonMap.position(topCorner.x,topCorner.y - itemHeight);
		buttonGraphs.position(topCorner.x+infoWindowButtonSize,topCorner.y - itemHeight);
		loadingGraph.setVis(false);
		loadingGraph.changeSize((windowWidth -topCorner.x - windowMargin)/ loadingGraph.bubbleArr.length );
		loadingGraph.changePosition(topCorner.x+(loadingGraph.bubbleArr[0].size/2),topCorner.y + (windowHeight - topCorner.y - windowMargin)/3);
		initStates();
		loadingMapInput.setVis(true);
		loadingMapInput.changeSize((topCorner.x-(loadingMapInput.bubbleArr[0].size/2))/loadingMapInput.bubbleArr.length);
		loadingMapInput.changePosition((loadingMapInput.bubbleArr[0].size/2),100 + menuItemsArr.length * itemHeight);

		loadingStateInput.setVis(true);
		loadingStateInput.changeSize((topCorner.x-(loadingStateInput.bubbleArr[0].size/2))/loadingStateInput.bubbleArr.length);
		loadingStateInput.changePosition((loadingStateInput.bubbleArr[0].size/2),100 + menuItemsArr.length * itemHeight + (loadingMapInput.bubbleArr[0].size) );//add the height of the top loading

		loadingCityInput.setVis(false);
		loadingCityInput.changeSize((topCorner.x-(loadingCityInput.bubbleArr[0].size/2))/loadingCityInput.bubbleArr.length);
		loadingCityInput.changePosition((loadingCityInput.bubbleArr[0].size/2),100 + menuItemsArr.length * itemHeight + (loadingMapInput.bubbleArr[0].size) );//add the height of the top loading


	}

}

function infoWindowDraw(){
	fill(200);
	if(menuOpen && pow(150-menuCir.x,4) + abs(pow(50-menuCir.y,3)) < pow(50,4) ){
		topCorner.x = topCornerConst.x;
		topCorner.y = topCornerConst.y;
	} else {
		topCorner.x = topCornerConst.x- 285;
	}

	rect(topCorner.x,topCorner.y, windowWidth -topCorner.x - windowMargin, windowHeight - topCorner.y - windowMargin);
	if(whichMenu == 0){
		 //draw map stuff
		 loadingMapInput.showLoading();
		 loadingStateInput.showLoading();
		 loadingCityInput.showLoading();
	} else if(whichMenu==1){

		//draw graph stuff
		loadingGraph.showLoading();
		textAlign(CENTER);
		textSize(35);
		fill(0);
		text("Hourly Distribution", topCorner.x + ( windowWidth -topCorner.x - windowMargin)/2, 100);
		var scale = 1.0 / (highestValue*1.1);

		for(var columeIndex = 0; columeIndex < orderedGraphValues.length; columeIndex++){
			var startX = topCorner.x + graphMargin*4;
			var custumShiftX = ( (windowWidth - topCorner.x - windowMargin - graphMargin*5)/orderedGraphValues.length * columeIndex) ;
			var startY = windowHeight - windowMargin - graphMargin*6;
			var barWidth = (windowWidth - topCorner.x - windowMargin)/orderedGraphValues.length - 2;//the 2 to take in account for the stroke width
			var barHeight = (windowHeight - topCorner.y - windowMargin - graphMargin*7 ) *(scale * orderedGraphValues[columeIndex]);

			if(barHeight>15){//fasncy drawing - if the draw window is neg the the arc drawing will throw errors - make a check for this in the future
				stroke(75,0,0);
				strokeWeight(3);
				fill(255,100,100);
				rect( startX + custumShiftX , startY- barHeight, barWidth , barHeight , 15);
				fill(75,0,0);
				rect( startX + custumShiftX , startY, barWidth , -10);
				noStroke();
				fill(255,100,100);
				rect( startX + custumShiftX+2 , startY , barWidth-3 , -12);
			} else {
				stroke(75,0,0);
				strokeWeight(3);
				fill(255,100,100);
				rect( startX + custumShiftX , startY- barHeight, barWidth , barHeight);
			}
			noStroke();
			fill(75,0,0);
			textSize(15);
			text(orderedGraphKeys[columeIndex], startX + custumShiftX + barWidth/2, startY + graphMargin*2);
		}

	}

	textAlign(LEFT);
	fill(255);
	textSize(15);
	text("Copyright 2017, Geotab Inc., made available pursuant to the Geotab Free Data License Terms. See data.geotab.com for more information.", 0, windowHeight-10);
}

function clearGraph(){
	highestValue = 0;
	orderedGraphValues.length = 0;
	orderedGraphKeys.lenght =0;
}

function recalibrateGraph(rawInput){
	loadingGraph.setVis(false);
	highestValue = 0;
	orderedGraphValues.length = 0;
	orderedGraphKeys.lenght =0;
	var objectInput = JSON.parse(rawInput) ;
	forEachDict(objectInput, (key, val) => {
		if(parseInt(key)<10){
			if(val > highestValue){
				highestValue = val;
			}
			orderedGraphValues.push(val);
			orderedGraphKeys.push(key);
		}
	});
	forEachDict(objectInput, (key, val) => {
		if(parseInt(key)>=10){
			if(val > highestValue){
				highestValue = val;
			}
			orderedGraphValues.push(val);
			orderedGraphKeys.push(key);
		}
	});
}

function menuMovement(){
	noStroke();
	fill(255);
	if(sq(mouseX-menuCir.x) + sq(mouseY-menuCir.y) < sq(menuCir.z/2)  && mouseIsPressed){
		if(menuCirLock.z == 0){
			menuCirLock.x = mouseX - menuCir.x;
			menuCirLock.y = mouseY - menuCir.y;
			menuCirLock.z =1;
			menuCirLockLoc.x = mouseX;
			menuCirLockLoc.y = mouseY;
		}
		menuCir.x = mouseX - menuCirLock.x;
		menuCir.y = mouseY - menuCirLock.y;
		moveMenu(menuCir.x-120,menuCir.y+25);

	} else if(menuCirLock.z == 1 && mouseIsPressed){
		menuCir.x = mouseX - menuCirLock.x;
		menuCir.y = mouseY - menuCirLock.y;
		moveMenu(menuCir.x-120,menuCir.y+25);
	} else {
			if(menuCirLock.z==1 && mouseX-menuCirLockLoc.x == 0 && mouseY-menuCirLockLoc.y == 0){
				if(clicked){//double click
					clicked = false;
					menuCir.x=150;
					menuCir.y=25;
					moveMenu(menuCir.x-120,menuCir.y+25);//move to main location
					menuOpen=true;
					currentMenuVisable(true);
				} else {//start single click
					clicked=true;
					clickAt= millis();
				}//end of click-double clikc if else
		}
		menuCirLock.z =0;
	}

	//wait after a click is detected for a second clikc
	if(clicked && millis() - clickAt > 200){
		clicked = false;
		menuOpen=!menuOpen;
		if(menuOpen){
			currentMenuVisable(true);
		} else {
			currentMenuVisable(false);
		}
	}


	//ellipse(menuCir.x,menuCir.y,menuCir.z,menuCir.z);
	for(var i = menuCir.z; i>0;i--){
		fill(255 - 105 * (i/(menuCir.z-1)) );
		ellipse(menuCir.x,menuCir.y,i* (i/(menuCir.z-1)) ,i * (i/(menuCir.z-1)) );
	}
	fill(150);
	if(menuOpen){
		if(whichMenu == 0){
			rect(menuCir.x-135,menuCir.y, menuSizes[0] , menuSizes[1]  , 20);
		} else if(whichMenu==1){
			rect(menuCir.x-135,menuCir.y, menuSizes[2] , menuSizes[3]  , 20);
		}
	}

}




function println(varible){
	console.log(varible);
}
