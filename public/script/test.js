const video = document.querySelector('#video');
const title = document.querySelector('.title');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia (
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  );
}

function videoPlayHandler () {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = {
    width: video.width, height: video.height
  };

  faceapi.matchDimensions(canvas, displaySize);
  setTimeout(async () => {
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    
    const result =  await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    console.log(result);
    setExpression(result.expressions);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, [1000]);
}

function setExpression(expression) {
  const { neutral, happy, sad, angry, surprised } = expression;
  title.textContent = returnExp(neutral, happy, sad, angry, surprised);
}

function returnExp(neutral, happy, sad, angry, surprised) {
  const std = 0.8;

  if (neutral > std) return 'neutral';
  if (happy > std) return 'happy';
  if (sad > std) return 'sad';
  if (angry > std) return 'angry'; 
  if (surprised > std) return 'surprised';
}

(() => video.addEventListener('play', videoPlayHandler))();
