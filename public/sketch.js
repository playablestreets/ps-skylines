let state = null;
let displayState = {
	currentOrientation: 'protrait',
	previousOrientation: 'portrait',
};
let isPressed = false;



//------------------------------------------------------------------
//GET DYNAMIC DATA
//------------------------------------------------------------------
//CALL PRISMIC API
getFromApi("sounds_exquisite", dataCallback); //returns to setKidstruments()

//SET DYNAMIC DATA FROM PRISMIC
function dataCallback(data) {
	console.log('received ', data.length, ' results' );
	// console.log(data);
	data.forEach((item) => {
		// console.log(item);
	});

	setState('ready');
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
	document.getElementById('info').innerHTML = text;
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
		background(255, 0, 0);
	}
	else  {
		background(0, 255, 0);
	}

	drawTouch();
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