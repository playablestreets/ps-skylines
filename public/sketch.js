let state = null;
let displayState = {
	currentOrientation: 'protrait',
	previousOrientation: 'portrait',
};
let isPressed = false;
let sharpieFont = null;

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


	
	//url handling
	let urlName = getUrlName();
	console.log('url name:', urlName);
	let foundIndex;
	if (urlName != '') {
		for (let index = 0; index < drawings.length; index++) {
			if (drawings[index].uid.toLowerCase() == urlName) {
				foundIndex = index;
				// console.log('loading ' + drawings[foundIndex].uid);
				//foundDrawing = drawings[foundIndex];
				break;
			}
		}
	}



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
	
	//if url is included swap position 2 in foreground layer with chosen item 
	if(foundIndex != null){
		print("adding drawing from url:");
		print(drawings[foundIndex]);
		tempDrawings.splice(3, 1, drawings[foundIndex]);
	}
	

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
	sharpieFont = loadFont('assets/PermanentMarker-Regular.ttf');
  textFont(sharpieFont);
  
  textAlign(CENTER, CENTER);

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
		// background(0, 0, 0);
		background(0, 0, 0);
	}

	drawBackgroundLayer();
	drawMidgroundLayer();
	// fill(0, 0, 0, 100);
	// rect(0, 0, width, height);
	fill(255);
	drawForegroundLayer();

	drawTouch();
}


let foregroundOffset = 0;
let foregroundTint = 0;
function drawForegroundLayer(){
	let image_size = height * 0.75;
	offset = foregroundOffset % image_size * 10;
	iOffset = parseInt(offset/image_size);

	// let centreTargetOffset = (parseInt(width/image_size));

	if(mouseIsPressed){
		let center = (((offset+width/2)/image_size))%1;

		// print(foregroundLayer[iOffset + centreTargetOffset].title);

		//if center < 0.5
			// increment foregroundOffset
		//if center > 0.5
			//decrement foregroundOffset
		if(center < 0.49 ){
			foregroundOffset += deltaTime * 0.08 * (0.5 - center);
		}else if (center > 0.51){
			foregroundOffset -= deltaTime * (0.08 * (center - 0.5));
		}

		if(foregroundTint < 255)
			foregroundTint += deltaTime * 1;
	}else{	
		foregroundOffset += deltaTime * 0.008;
		
		if(foregroundTint > 0)	
		foregroundTint -= deltaTime * 0.5;
		
	}
	
	push();
	// scale(1.5);
	
	translate(-(offset%image_size), 0);
	for(let i = 0; i < 5; i++  ){
		let adjustedI = (i + iOffset) % 5;
		
		if( typeof foregroundLayer[adjustedI] !== 'undefined'){
			
			//draw drawing
			tint(foregroundTint);
			if(foregroundLayer[adjustedI].drawing != null)
				image(foregroundLayer[adjustedI].drawing, i*image_size, height-image_size*0.95, image_size, image_size);
			//draw line
			noTint();
			if(foregroundLayer[adjustedI].line != null)
				image(foregroundLayer[adjustedI].line, i*image_size, height-image_size*0.95, image_size, image_size);
			
			//draw text
			
			if(foregroundLayer[adjustedI].title != null && mouseIsPressed){ 
				let thisString =  "\"" + foregroundLayer[adjustedI].title + "\"\n by " 
				+ foregroundLayer[adjustedI].author;
				if(foregroundLayer[adjustedI].age != null){
					thisString += ",\nage " + foregroundLayer[adjustedI].age;
				}
				// let thisString = " ";
				// text(thisString, i*image_size + image_size/2, 0, image_size * 2, height * 0.75);
				textSize(32);
				text(thisString, i*image_size + image_size/2, height/6);
				thisString =  "\"" + foregroundLayer[adjustedI].text + "\"" ;
				// textSize(24);
				// text(thisString, i*image_size + image_size/2, height - height/4);
			}
		}
	}
	pop();
}

//can optimize by making prerendered images
function drawMidgroundLayer(){
	push();
	let image_size = height * 0.4;
	// scale(1.5);
	offset = millis() * 0.003 % image_size * 10;
	iOffset = parseInt(offset/image_size);

	translate(-(offset%image_size), 0);
	for(let i = 0; i < 7; i++  ){
		let adjustedI = (i + iOffset) % 5;
		// console.log((i + iOffset) % 10);
		if( typeof midgroundLayer[adjustedI] !== 'undefined'){

			// translate(300, 0);
			tint(100, 0, 100);
			if(midgroundLayer[adjustedI].drawing != null)
			image(midgroundLayer[adjustedI].drawing, i*image_size, height-image_size*1.6, image_size, image_size);
			// tint(100, 0, 100);
			noTint();
			if(midgroundLayer[adjustedI].line != null)
			image(midgroundLayer[adjustedI].line, i*image_size, height-image_size*1.6, image_size, image_size);
			// image(item.drawing, i*300, 0);
		}
	}
	pop();
}

//can optimize by making prerendered images
function drawBackgroundLayer(){
	push();
	let image_size = height * 0.1;
	// scale(1.5);
	offset = millis() * 0.001 % image_size * 10;
	iOffset = parseInt(offset/image_size);

	translate(image_size,0);
	translate(-(offset%image_size), 0);
	for(let i = 0; i < 20; i++  ){
		let adjustedI = (i + iOffset) % 10;
		// console.log((i + iOffset) % 10);
		if( typeof backgroundLayer[adjustedI] !== 'undefined'){

			// translate(300, 0);
			tint(50, 0, 50);
			if(backgroundLayer[adjustedI].drawing != null)
			image(backgroundLayer[adjustedI].drawing, i*image_size, height-image_size*5.5, image_size, image_size);
			// tint(100, 0, 100);
			noTint();
			if(backgroundLayer[adjustedI].line != null)
			image(backgroundLayer[adjustedI].line, i*image_size, height-image_size*5.5, image_size, image_size);
			// image(item.drawing, i*300, 0);
		}
	}
	pop();

}

function drawTouch() {
	if (mouseX > 10 && mouseX < width - 10 && (mouseY > 10 && mouseY < height - 10)) {
		let ellipseWidth = mouseIsPressed ? 70 : 0;
		stroke(240, 100);
		strokeWeight(5);
		fill(200, 100);
		ellipse(mouseX, mouseY, ellipseWidth);
	}
}


//------------INTERACTION------------------------------------------------------------
//------------INTERACTION------------------------------------------------------------
//------------INTERACTION------------------------------------------------------------
///ONTOUCH
function go() {
	// if (Tone.context.state != 'running') {
		//console.log('starting tone.js');
    //Tone.start();
  // }
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