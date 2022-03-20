//
const savePanel = document.getElementById("save-panel");
const result = document.getElementById("result");
const cancelar = document.getElementById("cancelar");
const guardar = document.getElementById("guardar");
//
const webcam = document.getElementById("webcam");
//
const pickScreen = document.getElementById("pick-screen");
const grabar = document.getElementById("grabar");
const preview = document.getElementById("preview");
const detener = document.getElementById("detener");
let getData = async () => [];

let captureStream;

pickScreen.addEventListener("click", async () => {
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
      },
      audio: true,
    });
    preview.srcObject = captureStream;
    // preview.muted = true;
    preview.addEventListener("loadedmetadata", () => {
      preview.play();
      preview.classList.remove("d-none");
      grabar.classList.remove("d-none");
      pickScreen.classList.add("d-none");
    });
  } catch (error) {
    console.error(error);
  }
});

detener.addEventListener("click", () => {
  preview.classList.add("d-none");
  detener.classList.add("d-none");
});
detener.addEventListener("click", async () => {
  let data = await getData();
  let recordedBlob = new Blob(data, { type: "video/webm" });
  result.src = URL.createObjectURL(recordedBlob);
  guardar.href = result.src;
  guardar.download = `${new Date().toISOString()}.webm`;
  savePanel.classList.remove("d-none");
  stop(captureStream);
});

function stop(stream) {
  stream.getTracks().forEach((track) => track.stop());
}

function startRecording(stream) {
  let recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  let data = [];

  recorder.ondataavailable = (event) => data.push(event.data);
  recorder.start();

  let stopped = new Promise((resolve, reject) => {
    recorder.onstop = resolve;
    recorder.onerror = (event) => reject(event.name);
  });

  async function getData() {
    if (recorder.state == "recording") {
      recorder.stop();
    }
    await stopped;
    return data;
  }

  return getData;
}

grabar.addEventListener("click", () => {
  getData = startRecording(captureStream);
});

// mostrar y esconder botones
grabar.addEventListener("click", () => {
  detener.classList.remove("d-none");
  grabar.classList.add("d-none");
});

cancelar.addEventListener("click", () => {
  savePanel.classList.add("d-none");
  pickScreen.classList.remove("d-none");
});

guardar.addEventListener("click", () => {
  savePanel.classList.add("d-none");
  pickScreen.classList.remove("d-none");
});
