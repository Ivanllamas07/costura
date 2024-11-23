import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STITCHES = [
  {
    id: 'cruz',
    name: 'Punto de Cruz',
    description: 'El punto básico que forma una X. Ideal para patrones pixelados.',
    steps: [
      'Sube la aguja en A, baja en B (primera diagonal ／)',
      'Sube en C, baja en D (segunda diagonal ＼)',
      'Mantén consistente la dirección de las puntadas'
    ],
    tips: 'Completa primero todas las diagonales en una dirección, luego regresa haciendo las diagonales opuestas.'
  },
  {
    id: 'medio',
    name: 'Medio Punto',
    description: 'Media X, útil para efectos de sombreado.',
    steps: [
      'Sube la aguja en A, baja en B (una diagonal)',
      'Repite el proceso manteniendo la misma dirección'
    ],
    tips: 'Ideal para crear efectos de profundidad y textura.'
  },
  {
    id: 'relleno',
    name: 'Punto de Relleno',
    description: 'Puntadas verticales para rellenar áreas grandes.',
    steps: [
      'Trabaja en filas de arriba a abajo',
      'Mantén la tensión uniforme',
      'Alinea las puntadas cuidadosamente'
    ],
    tips: 'Excelente para fondos y áreas grandes de un solo color.'
  }
];

export function StitchGuide() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Guía de Puntadas</h3>
      <Tabs defaultValue="cruz">
        <TabsList className="grid grid-cols-3 mb-4">
          {STITCHES.map((stitch) => (
            <TabsTrigger key={stitch.id} value={stitch.id}>
              {stitch.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {STITCHES.map((stitch) => (
          <TabsContent key={stitch.id} value={stitch.id}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{stitch.description}</p>
              <div>
                <h4 className="font-medium mb-2">Pasos:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {stitch.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <p className="text-sm font-medium">Consejo:</p>
                <p className="text-sm text-gray-600">{stitch.tips}</p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}