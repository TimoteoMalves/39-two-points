import { Button } from "@heroui/button";
import React, { useRef, useEffect, useState, useCallback } from "react";

type CameraCaptureProps = {
  // Prop para definir o arquivo de imagem capturado (tipo File)
  setImageFile: (file: File | null) => void;
  // Nova prop para definir o o arquivo de vídeo gravado (tipo File)
  setVideoFile: (file: File | null) => void;
};

const CameraCapture = ({ setImageFile, setVideoFile }: CameraCaptureProps) => {
  // Referência para o elemento de vídeo onde o stream da câmera será exibido
  const videoRef = useRef<HTMLVideoElement>(null);
  // Referência para o elemento canvas usado para capturar frames de imagem
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Estado para controlar se a gravação de vídeo está ativa
  const [isRecording, setIsRecording] = useState(false);
  // Ref para armazenar a instância do MediaRecorder para persistência entre renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // Ref para armazenar os chunks de dados do vídeo durante a gravação
  // Usamos um ref para evitar que o useEffect seja acionado a cada chunk adicionado
  const recordedChunksRef = useRef<Blob[]>([]);
  // Estado para controlar a câmera ativa: 'user' (frontal) ou 'environment' (traseira)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  // Estado para saber se há mais de uma câmera disponível (frontal e traseira)
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  // Ref para o stream da câmera para persistência entre renders
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // useEffect principal para configurar a câmera e o MediaRecorder
  useEffect(() => {
    const setupCameraAndRecorder = async () => {
      // Limpa erros anteriores
      setError(null);

      // Para qualquer stream existente e MediaRecorder antes de iniciar um novo
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null; // Limpa a referência ao stream antigo
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null; // Limpa a referência ao recorder antigo

      try {
        // Configura as constraints para a câmera (frontal ou traseira)
        const constraints: MediaStreamConstraints = {
          video: { facingMode: facingMode },
          audio: true, // Pedimos acesso ao áudio para gravação de vídeo
        };

        // Solicita acesso à câmera e microfone
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        mediaStreamRef.current = stream; // Armazena o stream no ref

        if (videoRef.current) {
          // Atribui o stream da câmera ao elemento de vídeo
          videoRef.current.srcObject = stream;
        }

        // Detecta se há múltiplas câmeras para exibir o botão de troca
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setHasMultipleCameras(videoInputDevices.length > 1);

        // Configura o MediaRecorder
        const options = { mimeType: "video/webm; codecs=vp8,opus" };
        let recorder: MediaRecorder;
        try {
          // Tenta criar o recorder com o codec preferido
          recorder = new MediaRecorder(stream, options);
        } catch (recorderErr) {
          // Fallback para outro codec se o preferido não for suportado
          console.warn(
            "Codec 'vp8,opus' não suportado, tentando 'vp8'.",
            recorderErr
          );
          try {
            recorder = new MediaRecorder(stream, {
              mimeType: "video/webm; codecs=vp8",
            });
          } catch (fallbackErr) {
            console.error("Nenhum codec WebM suportado.", fallbackErr);
            setError(
              "Nenhum formato de gravação de vídeo suportado no seu navegador."
            );
            return;
          }
        }
        mediaRecorderRef.current = recorder; // Armazena o recorder no ref

        // Evento disparado quando dados de mídia estão disponíveis
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            // Adiciona o chunk ao ref mutável, não dispara re-render
            recordedChunksRef.current.push(event.data);
          }
        };

        // Evento disparado quando a gravação é parada
        recorder.onstop = () => {
          // Processa os chunks coletados no ref
          if (recordedChunksRef.current.length > 0) {
            // Cria um Blob a partir dos chunks gravados
            const videoBlob = new Blob(recordedChunksRef.current, {
              type: recorder.mimeType,
            });
            // Cria um objeto File a partir do Blob do vídeo
            const videoFile = new File(
              [videoBlob],
              `captured-video-${Date.now()}.webm`,
              {
                type: recorder.mimeType,
                lastModified: Date.now(),
              }
            );
            // Passa o objeto File para a função setVideoFile
            setVideoFile(videoFile);
            // Limpa os chunks após a gravação
            recordedChunksRef.current = [];
          } else {
            console.warn("Gravação parada, mas nenhum dado foi capturado.");
            setVideoFile(null);
          }
          setIsRecording(false); // Garante que o estado de gravação seja falso
        };
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
        setError(
          "Não foi possível acessar a câmera. Por favor, verifique as permissões de vídeo e áudio."
        );
      }
    };

    setupCameraAndRecorder();

    // Função de limpeza: interrompe todos os tracks de mídia e o recorder
    // quando o componente é desmontado ou o useEffect é re-executado (e.g., troca de câmera)
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    };
  }, [facingMode, setVideoFile]); // Dependências: re-executa ao trocar a câmera ou se setVideoFile mudar

  // Função para alternar entre as câmeras frontal e traseira
  const toggleCamera = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }, []);

  // Função para capturar uma imagem estática
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        setError("Não foi possível obter o contexto 2D do canvas.");
        return;
      }

      // Define as dimensões do canvas para corresponder às dimensões do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Desenha o frame atual do vídeo no canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Converte o conteúdo do canvas para um Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Cria um objeto File a partir do Blob
            const file = new File([blob], `captured-image-${Date.now()}.jpeg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            // Passa o objeto File para a função setImageFile
            setImageFile(file);
          } else {
            console.error("Falha ao criar Blob da imagem.");
            setImageFile(null);
          }
        },
        "image/jpeg",
        0.95
      ); // Especifica o tipo MIME e qualidade JPEG
    }
  }, [setImageFile]);

  // Função para iniciar a gravação de vídeo
  const startRecording = useCallback(() => {
    // Acessa o mediaRecorder através do seu ref
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      recordedChunksRef.current = []; // Limpa os chunks anteriores antes de iniciar nova gravação
      mediaRecorderRef.current.start(); // Inicia a gravação
      setIsRecording(true);
      setVideoFile(null); // Limpa o vídeo anterior ao iniciar uma nova gravação
    }
  }, [setVideoFile]);

  // Função para parar a gravação de vídeo
  const stopRecording = useCallback(() => {
    // Acessa o mediaRecorder através do seu ref
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // Para a gravação
    }
  }, []); // Não precisa de mediaRecorderRef nas dependências, pois acessa .current

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg font-inter">
      <h1 className="text-2xl font-extrabold text-center mb-6 text-gray-800">
        Captura de Mídia
      </h1>
      {error && (
        <p className="text-red-600 text-center mb-4 p-3 bg-red-100 rounded-md border border-red-300">
          {error}
        </p>
      )}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-4 border-gray-300 shadow-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-xl"
        ></video>
        {isRecording && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full flex items-center shadow-lg">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            Gravando...
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <Button
          onPress={captureImage}
          isDisabled={!videoRef.current || error !== null || isRecording}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Capturar Imagem
        </Button>

        {!isRecording ? (
          <Button
            onPress={startRecording}
            // Verifica se mediaRecorderRef.current existe e está inativo
            isDisabled={
              !mediaRecorderRef.current || error !== null || isRecording
            }
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Iniciar Gravação
          </Button>
        ) : (
          <Button
            onPress={stopRecording}
            // Verifica se mediaRecorderRef.current existe e está gravando
            isDisabled={
              !mediaRecorderRef.current || error !== null || !isRecording
            }
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Parar Gravação
          </Button>
        )}
      </div>
      {hasMultipleCameras && (
        <div className="flex justify-center mt-4">
          <Button
            onPress={toggleCamera}
            isDisabled={isRecording || error !== null}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Trocar Câmera ({facingMode === "user" ? "Frontal" : "Traseira"})
          </Button>
        </div>
      )}

      {/* Canvas oculto usado para a captura de imagem - display:none o mantém invisível */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default CameraCapture;
