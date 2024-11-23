import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { PatternGrid } from '@/components/PatternGrid';
import { PatternSettings } from '@/components/PatternSettings';
import { ColorPalette } from '@/components/ColorPalette';
import { MaterialCalculator } from '@/components/MaterialCalculator';
import { StitchGuide } from '@/components/StitchGuide';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  fillPattern: 'none' | 'parallel' | 'contour' | 'satin' | 'random';
  fillDensity: number;
  fillAngle: number;
  threadSpacing: number;
  threadDirection: number;
  threadLength: number;
  threadOverlap: number;
}

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(50);
  const [colors, setColors] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({
    showGrid: true,
    showSymbols: true,
    colorReduction: 'medium',
    orientation: 'auto',
    viewMode: 'normal',
    stitchDirection: 'horizontal',
    stitchType: 'simple',
    outlineType: 'none',
    stitchDensity: 'medium',
    textureStyle: 'smooth',
    threadIntensity: 1.0,
    threadPattern: 'straight',
    waveAmplitude: 5,
    waveFrequency: 1,
    fillPattern: 'parallel',
    fillDensity: 1.0,
    fillAngle: 0,
    threadSpacing: 1.0,
    threadDirection: 0,
    threadLength: 1.0,
    threadOverlap: 0.5,
  });

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSettingChange = (
    key: keyof Settings,
    value: Settings[keyof Settings]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorsDetected = (detectedColors: string[]) => {
    setColors(detectedColors);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Generador de Patrones de Bordado</h1>
          <p className="text-muted-foreground">
            Crea patrones de bordado personalizados a partir de tus imágenes
          </p>
        </header>

        {!image ? (
          <ImageUploader onImageUpload={handleImageUpload} className="max-w-xl mx-auto" />
        ) : (
          <Tabs defaultValue="pattern" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="pattern">Patrón</TabsTrigger>
              <TabsTrigger value="colors">Colores</TabsTrigger>
              <TabsTrigger value="materials">Materiales</TabsTrigger>
              <TabsTrigger value="guide">Guía</TabsTrigger>
            </TabsList>

            <div className="grid gap-6 items-start lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-6">
                <TabsContent value="pattern" className="space-y-6">
                  <Card className="p-4">
                    <PatternGrid
                      imageUrl={image}
                      gridSize={gridSize}
                      colors={colors}
                      onColorsDetected={handleColorsDetected}
                      settings={settings}
                    />
                  </Card>
                  <PatternSettings
                    settings={settings}
                    onSettingChange={handleSettingChange}
                  />
                </TabsContent>

                <TabsContent value="colors">
                  <ColorPalette colors={colors} />
                </TabsContent>

                <TabsContent value="materials">
                  <MaterialCalculator gridSize={gridSize} colors={colors} />
                </TabsContent>

                <TabsContent value="guide">
                  <StitchGuide />
                </TabsContent>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <ColorPalette colors={colors} />
                <MaterialCalculator gridSize={gridSize} colors={colors} />
              </div>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}
