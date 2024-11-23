import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PatternSettingsProps {
  settings: {
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
  };
  onSettingChange: (
    key: keyof PatternSettingsProps['settings'],
    value: any
  ) => void;
}

export function PatternSettings({ settings, onSettingChange }: PatternSettingsProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Configuración del Patrón</h3>
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="thread">Trazado</TabsTrigger>
          <TabsTrigger value="fill">Relleno</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Modo de Visualización</Label>
              <Select
                value={settings.viewMode}
                onValueChange={(value) => onSettingChange('viewMode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona modo de vista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="stitches">Punto de Cruz</SelectItem>
                  <SelectItem value="embroidery">Bordado Tradicional</SelectItem>
                  <SelectItem value="symbols">Símbolos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.viewMode === 'embroidery' && (
              <div className="space-y-2">
                <Label>Intensidad del Color</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.threadIntensity]}
                    min={0.2}
                    max={2}
                    step={0.1}
                    onValueChange={([value]) => onSettingChange('threadIntensity', value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {settings.threadIntensity.toFixed(1)}x
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="show-grid">Mostrar Cuadrícula</Label>
              <Switch
                id="show-grid"
                checked={settings.showGrid}
                onCheckedChange={(checked) => onSettingChange('showGrid', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Reducción de Colores</Label>
              <Select
                value={settings.colorReduction}
                onValueChange={(value) => onSettingChange('colorReduction', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona nivel de reducción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja (Más Detalle)</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta (Menos Colores)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thread">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Espaciado entre Hilos</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.threadSpacing]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) => onSettingChange('threadSpacing', value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {settings.threadSpacing.toFixed(1)}x
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dirección de los Hilos (grados)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.threadDirection]}
                  min={0}
                  max={360}
                  step={15}
                  onValueChange={([value]) => onSettingChange('threadDirection', value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {settings.threadDirection}°
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Longitud de Puntada</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.threadLength]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) => onSettingChange('threadLength', value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {settings.threadLength.toFixed(1)}x
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Solapamiento de Puntadas</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.threadOverlap]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => onSettingChange('threadOverlap', value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {settings.threadOverlap.toFixed(1)}x
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Patrón de Trazado</Label>
              <Select
                value={settings.threadPattern}
                onValueChange={(value) => onSettingChange('threadPattern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona patrón de trazado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Recto</SelectItem>
                  <SelectItem value="wave">Ondulado</SelectItem>
                  <SelectItem value="zigzag">Zigzag</SelectItem>
                  <SelectItem value="spiral">Espiral</SelectItem>
                  <SelectItem value="crosshatch">Entrelazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.threadPattern !== 'straight' && (
              <>
                <div className="space-y-2">
                  <Label>Amplitud de Onda</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.waveAmplitude]}
                      min={1}
                      max={10}
                      step={0.5}
                      onValueChange={([value]) => onSettingChange('waveAmplitude', value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {settings.waveAmplitude.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Frecuencia de Onda</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.waveFrequency]}
                      min={0.5}
                      max={5}
                      step={0.1}
                      onValueChange={([value]) => onSettingChange('waveFrequency', value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {settings.waveFrequency.toFixed(1)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="fill">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Relleno</Label>
              <Select
                value={settings.fillPattern}
                onValueChange={(value) => onSettingChange('fillPattern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo de relleno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin Relleno</SelectItem>
                  <SelectItem value="parallel">Líneas Paralelas</SelectItem>
                  <SelectItem value="contour">Contorno</SelectItem>
                  <SelectItem value="satin">Puntada Satén</SelectItem>
                  <SelectItem value="random">Aleatorio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.fillPattern !== 'none' && (
              <>
                <div className="space-y-2">
                  <Label>Densidad del Relleno</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[settings.fillDensity]}
                      min={0.2}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) => onSettingChange('fillDensity', value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {settings.fillDensity.toFixed(1)}x
                    </span>
                  </div>
                </div>

                {settings.fillPattern === 'parallel' && (
                  <div className="space-y-2">
                    <Label>Ángulo del Relleno</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[settings.fillAngle]}
                        min={0}
                        max={360}
                        step={15}
                        onValueChange={([value]) => onSettingChange('fillAngle', value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {settings.fillAngle}°
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dirección del Bordado</Label>
              <Select
                value={settings.stitchDirection}
                onValueChange={(value) => onSettingChange('stitchDirection', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona dirección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="diagonal">Diagonal</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Puntada</Label>
              <Select
                value={settings.stitchType}
                onValueChange={(value) => onSettingChange('stitchType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo de puntada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Puntada Simple</SelectItem>
                  <SelectItem value="split">Puntada Partida</SelectItem>
                  <SelectItem value="chain">Cadeneta</SelectItem>
                  <SelectItem value="satin">Puntada Satén</SelectItem>
                  <SelectItem value="french-knot">Nudo Francés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Densidad de Puntadas</Label>
              <Select
                value={settings.stitchDensity}
                onValueChange={(value) => onSettingChange('stitchDensity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona densidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Ligera</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="dense">Densa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}