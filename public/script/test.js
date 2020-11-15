const video = document.querySelector('#video');
const screen = document.querySelector('.recommend');

// 더미데이터
const data = {
  sad: `
  <h1 class="title">기분이 우울하신가요?</h1>
  <p>아래의 것들이 도움이 될거에요.</p>
  <ul>
      <li><a href="https://m.blog.naver.com/PostView.nhn?blogId=ellegarden_v&logNo=10158448473&proxyReferer=https:%2F%2Fwww.google.com%2F">기분 전환 방법</a></li>
      <li><a href="https://youtu.be/6wJepYuiznU">추천 음악</a></li>
  </ul>`,
  neutral: `
    <h1>그저 그렇군요.</h1>
  `,
  surprised: `
    <h1>놀라셨어요?</h1>
    <p>물을 마시면서 진정합시다.</p>
  `,
  happy: `
    <h1>기분 좋은 일이 있으시군요?</h1>
    <p>아래의 것들이 도움이 될거에요.</p>
    <ul>
      <li><a href="https://youtu.be/F9Ex1ESEWN4">추천 음악 1</a></li>
      <li><a href="https://youtu.be/jwPH69NoBP8">추천 음악 2</a></li>
    </ul>
  `,
  angry: `
    <h1>화가 나셨나요?</h1>
    <p>진정하세요, 아래의 것들이 도움이 될거에요.</p>
    <ul>
      <li><a href="https://steptohealth.co.kr/6-easy-kills-to-calm-anger/">화 다스리기</a></li>
      <li><a href="https://youtu.be/6atvmgoKKNQ">추천 음악</a></li>
    </ul>
  `,
}

// 모델 로딩 대기
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

// 모델 로딩 완료시 호출
function startVideo() {
  navigator.getUserMedia (
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  );
}

// 비디오 실행시 호출
function videoPlayHandler() {
  const canvas = faceapi.createCanvasFromMedia(video); // 캔버스 생성
  document.body.append(canvas);
  const displaySize = {
    width: video.width, height: video.height
  };
  faceapi.matchDimensions(canvas, displaySize);

  // 화면이 렌더링되고 2초 후 웹캠 스캔 실행
  setTimeout(async () => {
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions(); // 측정 옵션 선택

    // 예외 처리
    try {
      const result =  await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions(); // 표정 인식 결과
      setExpression(result.expressions); // 결과 값을 전달하며 함수 호출
    } catch (error) {
      alert('표정 스캔이 불가능합니다. 다시 시도하세요!');
      location.href = location.href;
    }

    const resizedDetections = faceapi.resizeResults(detections, displaySize); // 측정된 결과
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections); // 얼굴 탐지 가면 그리기
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // 경계선 그리기
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // 표정 인식 결과 그리기
  }, [2000]);
}

function setExpression(expression) {
  const key = Object.keys(expression); // 표정 타입이 담긴 배열 생성
  const value = Object.values(expression);
  const max = Math.max.apply(null, value), exp = key.find(i => expression[i] === max); // 최대값을 가진 표정 타입 탐색

  screen.innerHTML = data[exp]; // 스크린 렌더링
}

(() => video.addEventListener('play', videoPlayHandler))(); // video 이벤트 리스너 추가
