import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  showGrid: boolean;
  showSymbols: boolean;
  colorReduction: 'low' | 'medium' | 'high';
  orientation: 'auto' | 'portrait' | 'landscape';
  viewMode: 'normal' | 'stitches' | 'symbols' | 'embroidery';
  stitchDirection: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
  stitchType: 'simple' | 'split' | 'chain' | 'satin' | 'french-knot';
  outlineType: 'none' | 'running' | 'backstitch' | 'stem';
  stitchDensity: 'light' | 'medium' | 'dense';
  textureStyle: 'smooth' | 'seed' | 'long-short' | 'fishbone';
  threadIntensity: number;
  threadPattern: 'straight' | 'wave' | 'zigzag' | 'spiral' | 'crosshatch';
  waveAmplitude: number;
  waveFrequency: number;
  threadSpacing: number;
}

interface PatternGridProps {
  imageUrl: string;
  gridSize: number;
  colors: string[];
  onColorsDetected: (colors: string[]) => void;
  settings: Settings;
}

export function PatternGrid({
  imageUrl,
  gridSize,
  colors,
  onColorsDetected,
  settings,
}: PatternGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  /**
   * Ajusta el color multiplicando cada componente RGB por el factor proporcionado.
   * @param r Rojo
   * @param g Verde
   * @param b Azul
   * @param factor Factor de ajuste (menos de 1 para oscurecer)
   * @returns String de color en formato RGBA
   */
  const adjustColor = (
    r: number,
    g: number,
    b: number,
    factor: number = 0.8 // Factor ajustado para oscurecimiento más pronunciado
  ): string => {
    return `rgba(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(
      b * factor
    )}, ${factor})`;
  };

  /**
   * Obtiene el color promedio de una celda específica de la imagen.
   * @param imageData Datos de la imagen
   * @param startX Coordenada X inicial de la celda
   * @param startY Coordenada Y inicial de la celda
   * @param cellWidth Ancho de la celda
   * @param cellHeight Alto de la celda
   * @param width Ancho total de la imagen
   * @returns Objeto con componentes RGB y promedio de alfa
   */
  const getAverageColor = (
    imageData: ImageData,
    startX: number,
    startY: number,
    cellWidth: number,
    cellHeight: number,
    width: number
  ): { r: number; g: number; b: number; a: number } => {
    let r = 0,
      g = 0,
      b = 0,
      a = 0;
    let count = 0;

    for (let y = startY; y < startY + cellHeight && y < imageData.height; y++) {
      for (let x = startX; x < startX + cellWidth && x < width; x++) {
        const index = (y * width + x) * 4;
        r += imageData.data[index];
        g += imageData.data[index + 1];
        b += imageData.data[index + 2];
        a += imageData.data[index + 3];
        count++;
      }
    }

    return {
      r: r / count,
      g: g / count,
      b: b / count,
      a: a / count,
    };
  };

  /**
   * Dibuja un patrón de hilo según las configuraciones.
   * @param ctx Contexto del canvas
   * @param x Coordenada X
   * @param y Coordenada Y
   * @param length Longitud del hilo
   * @param angle Ángulo de la dirección del hilo
   * @param color Color del hilo
   * @param threadPattern Patrón del hilo
   * @param prominence Prominencia del color
   */
  const drawThreadPattern = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    length: number,
    angle: number,
    color: string,
    threadPattern: string,
    prominence: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1 + prominence * 1.5; // Línea más gruesa según prominencia
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();

    switch (threadPattern) {
      case 'straight':
        ctx.moveTo(-length / 2, 0);
        ctx.lineTo(length / 2, 0);
        break;

      case 'wave':
        const waveAmplitude = settings.waveAmplitude * prominence;
        const waveFrequency = settings.waveFrequency;
        const waveSteps = 20;
        const waveStepSize = length / waveSteps;
        for (let i = 0; i <= waveSteps; i++) {
          const xPos = -length / 2 + i * waveStepSize;
          const yPos = Math.sin((i / waveSteps) * waveFrequency * Math.PI * 2) * waveAmplitude;
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        }
        break;

      case 'zigzag':
        const zigzagAmplitude = settings.waveAmplitude * prominence;
        const zigzagSteps = 20;
        const zigzagStepSize = length / zigzagSteps;
        for (let i = 0; i <= zigzagSteps; i++) {
          const xPos = -length / 2 + i * zigzagStepSize;
          const yPos = i % 2 === 0 ? -zigzagAmplitude : zigzagAmplitude;
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        }
        break;

      case 'spiral':
        const spiralTurns = settings.waveFrequency;
        const spiralRadius = settings.waveAmplitude * prominence;
        for (let i = 0; i <= spiralTurns * 100; i++) {
          const theta = (i / 100) * Math.PI * 2;
          const r = (spiralRadius / (spiralTurns * 100)) * i;
          const xPos = r * Math.cos(theta);
          const yPos = r * Math.sin(theta);
          if (i === 0) {
            ctx.moveTo(xPos, yPos);
          } else {
            ctx.lineTo(xPos, yPos);
          }
        }
        break;

      case 'crosshatch':
        const crosshatchSpacing = length / 10;
        for (let i = -length / 2; i <= length / 2; i += crosshatchSpacing) {
          ctx.moveTo(i, -length / 2);
          ctx.lineTo(i, length / 2);
        }
        for (let i = -length / 2; i <= length / 2; i += crosshatchSpacing) {
          ctx.moveTo(-length / 2, i);
          ctx.lineTo(length / 2, i);
        }
        break;

      default:
        ctx.moveTo(-length / 2, 0);
        ctx.lineTo(length / 2, 0);
        break;
    }

    ctx.stroke();
    ctx.restore();
  };

  /**
   * Dibuja múltiples hilos gruesos y oscuros en una posición específica.
   * @param ctx Contexto del canvas
   * @param x Coordenada X
   * @param y Coordenada Y
   * @param length Longitud del hilo
   * @param angle Ángulo de la dirección del hilo
   * @param color Color original del hilo
   * @param threadPattern Patrón del hilo
   * @param prominence Prominencia del color
   */
  const drawThreads = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    length: number,
    angle: number,
    color: string,
    threadPattern: string,
    prominence: number
  ) => {
    const numberOfThreads = 5; // Número de hilos por celda
    const threadSpacing = 1; // Espaciado entre hilos

    for (let i = 0; i < numberOfThreads; i++) {
      const offsetX = (Math.random() - 0.5) * threadSpacing;
      const offsetY = (Math.random() - 0.5) * threadSpacing;
      const randomAngle = angle + (Math.random() - 0.5) * 0.2; // Variación aleatoria en el ángulo
      drawThreadPattern(
        ctx,
        x + offsetX,
        y + offsetY,
        length,
        randomAngle,
        color,
        threadPattern,
        prominence
      );
    }
  };

  /**
   * Dibuja las direcciones de los hilos sobre la imagen.
   * @param ctx Contexto del canvas
   * @param width Ancho de la imagen
   * @param height Alto de la imagen
   * @param settings Configuraciones del patrón
   * @param baseImageData Datos de la imagen base
   */
  const drawThreadDirections = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    settings: Settings,
    baseImageData: ImageData
  ) => {
    const { stitchDirection, threadSpacing } = settings;
    const spacing = threadSpacing * 10;

    const angles: { [key: string]: number } = {
      horizontal: 0,
      vertical: Math.PI / 2,
      diagonal: Math.PI / 4,
      radial: 0, // Radial se maneja por separado
    };

    if (stitchDirection === 'radial') {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.hypot(centerX, centerY);

      for (let r = spacing; r <= maxRadius; r += spacing) {
        const circumference = 2 * Math.PI * r;
        const numThreads = Math.max(8, Math.floor(circumference / spacing));

        for (let i = 0; i < numThreads; i++) {
          const angleRad = (i / numThreads) * 2 * Math.PI;
          const x = centerX + r * Math.cos(angleRad);
          const y = centerY + r * Math.sin(angleRad);

          const { r: red, g, b, a } = getAverageColor(
            baseImageData,
            Math.floor(x),
            Math.floor(y),
            1,
            1,
            width
          );

          if (a < 128) continue; // Saltar píxeles con baja opacidad

          const color = adjustColor(red, g, b, 0.8); // Más oscuro

          drawThreads(
            ctx,
            x,
            y,
            spacing * 2,
            angleRad,
            color,
            settings.threadPattern,
            0.7 // Prominencia ajustada para mayor visibilidad
          );
        }
      }
    } else {
      const angle = angles[stitchDirection];

      for (let yPos = 0; yPos <= height; yPos += spacing) {
        for (let xPos = 0; xPos <= width; xPos += spacing) {
          const { r: red, g, b, a } = getAverageColor(
            baseImageData,
            Math.floor(xPos),
            Math.floor(yPos),
            1,
            1,
            width
          );

          if (a < 128) continue; // Saltar píxeles con baja opacidad

          const color = adjustColor(red, g, b, 0.8); // Más oscuro

          drawThreads(
            ctx,
            xPos,
            yPos,
            spacing * 2,
            angle + (Math.random() - 0.5) * 0.2, // Variación aleatoria en el ángulo
            color,
            settings.threadPattern,
            0.7 // Prominencia ajustada para mayor visibilidad
          );
        }
      }
    }
  };

  /**
   * Renderiza el canvas con la imagen y los hilos de bordado.
   */
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Configuración del canvas sin escalado
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    canvas.style.width = `${originalImage.width}px`;
    canvas.style.height = `${originalImage.height}px`;

    ctx.clearRect(0, 0, originalImage.width, originalImage.height);

    // Dibujamos la imagen original
    ctx.drawImage(originalImage, 0, 0);

    // Obtenemos los datos de imagen para usar en getAverageColor
    const baseImageData = ctx.getImageData(0, 0, originalImage.width, originalImage.height);

    if (settings.viewMode === 'embroidery') {
      const cellSize = Math.max(
        2,
        Math.min(originalImage.width, originalImage.height) / (gridSize * 2.5)
      );

      for (let y = 0; y < originalImage.height; y += cellSize) {
        for (let x = 0; x < originalImage.width; x += cellSize) {
          const avgColor = getAverageColor(baseImageData, x, y, cellSize, cellSize, originalImage.width);

          if (avgColor.a < 128) continue; // Saltar áreas con baja opacidad

          const luminance =
            (0.299 * avgColor.r + 0.587 * avgColor.g + 0.114 * avgColor.b) / 255;
          const maxColor = Math.max(avgColor.r, avgColor.g, avgColor.b);
          const minColor = Math.min(avgColor.r, avgColor.g, avgColor.b);
          const saturation = maxColor === 0 ? 0 : (maxColor - minColor) / maxColor;

          const prominence =
            Math.pow(saturation, 0.3) * (1 - Math.abs(luminance - 0.5)) * 1.5;

          if (prominence > 0.1) {
            // Dibuja 4-5 hilos por celda
            const numberOfThreads = 5;
            const threadSpacing = 1; // Espaciado entre hilos

            for (let i = 0; i < numberOfThreads; i++) {
              const offsetX = (Math.random() - 0.5) * threadSpacing;
              const offsetY = (Math.random() - 0.5) * threadSpacing;
              const xOffset = x + cellSize / 2 + offsetX;
              const yOffset = y + cellSize / 2 + offsetY;

              // Determina el ángulo según la dirección de puntada
              let angle = 0;
              switch (settings.stitchDirection) {
                case 'horizontal':
                  angle = 0;
                  break;
                case 'vertical':
                  angle = Math.PI / 2;
                  break;
                case 'diagonal':
                  angle = Math.PI / 4;
                  break;
                case 'radial':
                  // Radial se maneja por separado en drawThreadDirections
                  angle = 0;
                  break;
                default:
                  angle = 0;
              }

              // Para radial, el ángulo se calcula en drawThreadDirections
              if (settings.stitchDirection !== 'radial') {
                drawThreadPattern(
                  ctx,
                  xOffset,
                  yOffset,
                  cellSize,
                  angle + (Math.random() - 0.5) * 0.2, // Variación aleatoria en el ángulo
                  adjustColor(avgColor.r, avgColor.g, avgColor.b, 0.8),
                  settings.threadPattern,
                  prominence
                );
              }
            }
          }
        }
      }
    }

    // Añadimos las direcciones de hilo con efecto de textura y evitando áreas transparentes
    drawThreadDirections(
      ctx,
      originalImage.width,
      originalImage.height,
      settings,
      baseImageData
    );

    // Detectamos y notificamos los colores
    const finalImageData = ctx.getImageData(0, 0, originalImage.width, originalImage.height);
    const colorSet = new Set<string>();
    for (let i = 0; i < finalImageData.data.length; i += 4) {
      const a = finalImageData.data[i + 3];
      if (a < 128) continue; // Saltar píxeles con baja opacidad
      const color = `rgb(${finalImageData.data[i]},${finalImageData.data[i + 1]},${finalImageData.data[i + 2]})`;
      colorSet.add(color);
    }
    onColorsDetected(Array.from(colorSet).slice(0, 32));
  };

  /**
   * Carga la imagen y maneja posibles errores.
   */
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = 'Anonymous'; // Para evitar problemas de CORS si es necesario
    img.onload = () => {
      setOriginalImage(img);
    };
    img.onerror = () => {
      toast({
        title: 'Error al cargar la imagen',
        description: 'No se pudo cargar la imagen proporcionada.',
        variant: 'destructive',
      });
    };
  }, [imageUrl, toast]);

  /**
   * Renderiza el canvas cada vez que cambia la imagen original, las configuraciones o el tamaño de la cuadrícula.
   */
  useEffect(() => {
    if (originalImage) {
      renderCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImage, settings, gridSize]);

  /**
   * Maneja la descarga del patrón generado.
   */
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'patron-bordado.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Patrón PNG descargado',
        description: 'El patrón en formato PNG se ha descargado correctamente.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error al descargar PNG',
        description: 'No se pudo descargar el patrón en formato PNG.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Genera un archivo DST con los datos del patrón.
   * @param patternData Datos de las puntadas
   * @returns Uint8Array representando el contenido del archivo DST
   */
  const generateDstFile = (patternData: Uint8Array): Uint8Array => {
    // Crear un header de 512 bytes
    const header = new Uint8Array(512);
    // Añadir un identificador ficticio en el header
    const id = 'EMB1';
    for (let i = 0; i < id.length; i++) {
      header[i] = id.charCodeAt(i);
    }

    // Combina header y patternData
    const dst = new Uint8Array(header.length + patternData.length);
    dst.set(header, 0);
    dst.set(patternData, header.length);

    return dst;
  };

  /**
   * Descarga un archivo DST.
   * @param content Contenido binario del archivo DST
   * @param filename Nombre del archivo a descargar
   */
  const downloadDstFile = (content: Uint8Array, filename: string) => {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Convierte los hilos dibujados en el canvas a un arreglo de bytes DST.
   * @param ctx Contexto del canvas
   * @param imageData Datos de la imagen del canvas
   * @returns Uint8Array representando el contenido DST
   */
  const mapCanvasToDst = (ctx: CanvasRenderingContext2D, imageData: ImageData): Uint8Array => {
    // Implementar una lógica para convertir los hilos dibujados en el canvas a bytes DST
    // Esto es una simplificación extrema y no representará un archivo DST válido

    // Ejemplo simple: crear una serie de movimientos lineales
    let dstBytes: number[] = [];

    // Inicio de la secuencia de puntadas
    // Esto debería seguir la especificación DST para comandos de puntada
    // Aquí solo añadimos movimientos de ejemplo

    for (let y = 0; y < imageData.height; y += 50) {
      for (let x = 0; x < imageData.width; x += 50) {
        // Movimiento de salto (simulado)
        dstBytes.push(0x00, 0x00, 0x00); // Placeholder para salto

        // Movimiento de puntada normal
        dstBytes.push(x & 0xFF, y & 0xFF, 0x02); // Puntada normal
      }
    }

    // Comando de fin de patrón
    dstBytes.push(0x00, 0x00, 0x01); // Puntada de fin

    return new Uint8Array(dstBytes);
  };

  /**
   * Maneja la descarga del patrón generado en formato DST.
   */
  const handleDownloadDstDetailed = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener el contexto del canvas.',
        variant: 'destructive',
      });
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convertir el patrón del canvas a bytes DST
    const dstContent = mapCanvasToDst(ctx, imageData);

    // Generar el archivo DST con el header
    const fullDst = generateDstFile(dstContent);

    // Descargar el archivo DST
    downloadDstFile(fullDst, 'patron-bordado.dst');

    toast({
      title: 'Archivo DST descargado',
      description: 'El archivo DST se ha descargado correctamente.',
      variant: 'default',
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar PNG
          </Button>
          <Button onClick={handleDownloadDstDetailed}>
            <Download className="h-4 w-4 mr-2" />
            Descargar DST
          </Button>
        </div>
      </div>

      <div className="overflow-auto border rounded-lg">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Zoom:</span>
        <Slider
          value={[zoom]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={([value]) => setZoom(value)}
          className="w-32"
        />
        <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
      </div>
    </Card>
  );
}
