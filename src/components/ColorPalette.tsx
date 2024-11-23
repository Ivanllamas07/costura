import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ColorPaletteProps {
  colors: string[];
}

const DMC_COLORS = {
  'rgb(255,255,255)': { code: 'B5200', name: 'Blanco Nieve' },
  'rgb(0,0,0)': { code: '310', name: 'Negro' },
  'rgb(237,27,36)': { code: '666', name: 'Rojo Brillante' },
  // Añadir más colores DMC según necesites
};

export function ColorPalette({ colors }: ColorPaletteProps) {
  const { toast } = useToast();

  const getDMC = (color: string) => {
    return DMC_COLORS[color] || {
      code: `DMC-${Math.floor(Math.random() * 1000)}`,
      name: `Color Personalizado`
    };
  };

  const downloadColorList = () => {
    const colorList = colors.map((color, index) => {
      const dmc = getDMC(color);
      return `${index + 1}. ${dmc.code} - ${dmc.name} (${color})`;
    }).join('\n');

    const blob = new Blob([colorList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-colores-dmc.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Lista descargada",
      description: "La lista de colores se ha descargado correctamente"
    });
  };

  const copyColor = (color: string, dmcCode: string) => {
    navigator.clipboard.writeText(`${dmcCode} - ${color}`);
    toast({
      title: "Color copiado",
      description: "El código del color se ha copiado al portapapeles"
    });
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Colores de Hilo ({colors.length})</h3>
        <Button variant="outline" size="sm" onClick={downloadColorList}>
          <Download className="w-4 h-4 mr-2" />
          Descargar Lista
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {colors.map((color, index) => {
          const dmc = getDMC(color);
          return (
            <div
              key={color}
              className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2"
            >
              <div
                className="w-6 h-6 rounded-full border shadow-sm"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <Badge variant="secondary" className="text-xs mb-1">
                  {dmc.code}
                </Badge>
                <p className="text-xs text-muted-foreground truncate">
                  {dmc.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyColor(color, dmc.code)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}