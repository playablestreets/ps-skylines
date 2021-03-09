let state = null;
let displayState = {
	currentOrientation: 'protrait',
	previousOrientation: 'portrait',
};
let isPressed = false;

let foregroundLayer = [];
let midgroundLayer = [];
let backgroundLayer = [];

//------------------------------------------------------------------
//GET DYNAMIC DATA
//------------------------------------------------------------------
//CALL PRISMIC API
getFromApi("skylines_and_storylines", dataCallback); //returns to setKidstruments()

const drawings = [];
// let tempDrawings;

//SET DYNAMIC DATA FROM PRISMIC
function dataCallback(data) {
	console.log('received ', data.length, ' results' );
	console.log(data);
	const drawing = {
		uid: null,
		title: null,
		author: null,
		age: null,
		postcode: null,
		drawing_url: null,
		line_url: null,
		drawing: null,
		line: null,
		text: null
	}


	data.forEach((item) => {
		// console.log(item);
		let newDrawing = {...drawing};
		newDrawing.uid = item.uid;
		newDrawing.title = item.data.title[0].text;
		newDrawing.author = item.data.name[0].text;
		newDrawing.age = item.data.age;
		newDrawing.postcode = item.data.postcode;
		newDrawing.drawing_url = item.data.drawing_1.url;
		newDrawing.line_url = item.data.line_1.url;
		// drawing.text = item.data.description[0].text;

		drawings.push(newDrawing);
	});

	//do url handling here if required

	let tempDrawings = JSON.parse(JSON.stringify(drawings));
	// console.log(tempDrawings);
	//pad out array if fewer than 30 items (somewhat inefficient)
	while(tempDrawings.length < 30){
		console.log('too few items, duplicating some....');
		tempDrawings = tempDrawings.concat(tempDrawings, tempDrawings);
	}
	
	//trim down to 30 items
	tempDrawings.splice(30, tempDrawings.length);
	
	//shuffle array
	shuffle(tempDrawings, true);
	
	// //split shuffled array amongst fore, mid and backgrounds
	// console.log(tempDrawings);
	loadLayer(foregroundLayer, tempDrawings.slice(0, 10));
	loadLayer(midgroundLayer, tempDrawings.slice(10, 20));
	loadLayer(backgroundLayer, tempDrawings.slice(20, 30));
	
	
	setState('ready');
}

function loadLayer(layer, items){

	//load items into layers and load images
	items.forEach(item =>{
		// console.log(item);
		item.drawing = loadImage(item.drawing_url);
		item.line = loadImage(item.line_url);
		layer.push(item);
	});

	// console.log(layer);
	// for(let i in items){
		// console.log(i);
		// foreground.push(drawings[i%drawings.length]);
	// }
}




//------------SETUP------------------------------------------------------------
//------------SETUP------------------------------------------------------------
//------------SETUP------------------------------------------------------------
function setup() {
	setState('loading');

	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	setDisplayState();
	textSize(100);
	currentColor = color(255);


}


function setInfoText(text) {
	// document.getElementById('info').innerHTML = text;
}


function setState(newState) {
  if(newState != state){
    state = newState;
    if (state == 'loading') {
			setInfoText('loading...');
    }
		else if (state == 'ready') {
			setInfoText('READY!');
    }
	}
}

//------------UPDATE------------------------------------------------------------
//------------UPDATE------------------------------------------------------------
//------------UPDATE------------------------------------------------------------
function update() {
  // check orientation
  setDisplayState();


}

function setDisplayState() {
  displayState.previousOrientation = displayState.currentOrientation;

	if (windowWidth > windowHeight)
    displayState.currentOrientation = 'landscape';
  else
    displayState.currentOrientation = 'portrait';
}



//------------DRAW------------------------------------------------------------
//------------DRAW------------------------------------------------------------
//------------DRAW------------------------------------------------------------
function draw() {
	//run update
	update();

	//prepare canvas
	// clear();
	resizeCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);

	fill(255);
	stroke(0);

	if (state == 'loading') {
		//do something....
		background(255, 255, 0);
	}
	else  {
		background(0, 0, 0);
	}

	// drawBackground();
	// drawMidground();
	drawForegroundLayer();

	// drawTouch();
}

function drawForegroundLayer(){
	push();
	let image_size = width * 0.5;
	// scale(1.5);
	offset = millis() * 0.01 % image_size * 10;
	iOffset = parseInt(offset/image_size);

	translate(-(offset%image_size), 0);
	for(let i = 0; i < 5; i++  ){
		let adjustedI = (i + iOffset) % 5;
		// console.log((i + iOffset) % 10);
		if( typeof foregroundLayer[adjustedI] !== 'undefined'){

			// translate(300, 0);
			tint(255);
			if(foregroundLayer[adjustedI].drawing != null)
			image(foregroundLayer[adjustedI].drawing, i*image_size, height-image_size*0.8, image_size, image_size);
			noTint();
			if(foregroundLayer[adjustedI].line != null)
			image(foregroundLayer[adjustedI].line, i*image_size, height-image_size*0.8, image_size, image_size);
			// image(item.drawing, i*300, 0);
		}
	}
		pop();
}

function drawMidgroundLayer(){}
function drawBackgroundLayer(){}

// function drawTouch() {
// 	if (mouseX > 10 && mouseX < width - 10 && (mouseY > 10 && mouseY < height - 10)) {
// 		let ellipseWidth = mouseIsPressed ? 70 : 0;
// 		stroke(240, 100);
// 		strokeWeight(5);
// 		fill(200, 100);
// 		ellipse(mouseX, mouseY, ellipseWidth);
// 	}
// }


//------------INTERACTION------------------------------------------------------------
//------------INTERACTION------------------------------------------------------------
//------------INTERACTION------------------------------------------------------------
///ONTOUCH
function go() {
  if (Tone.context.state != 'running') {
    console.log('starting tone.js');
    Tone.start();
  }
	isPressed = true;
}

///ON RELEASE
function stop() {
  isPressed = false;
}

//fuse touches and mouse clicks
function mousePressed() {
	go();
}
function touchStarted() {
	go();
}
function mouseReleased() {
	stop();
}
function touchEnded() {
	stop();
}


// document.getElementById('button-next').onclick = loadNext;
// document.getElementById('button-prev').onclick = loadPrev;