import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface MaterialCalculatorProps {
  gridSize: number;
  colors: string[];
}

export function MaterialCalculator({ gridSize, colors }: MaterialCalculatorProps) {
  // Cálculos aproximados basados en el tamaño del patrón
  const telaSize = {
    width: Math.ceil(gridSize * 0.25), // cm
    height: Math.ceil(gridSize * 0.25), // cm
  };

  // Cálculo más detallado del hilo necesario
  const calcularHiloPorColor = (color: string, index: number) => {
    // Simulación de cálculo basado en la densidad del color
    const densidad = (index + 1) / colors.length; // 0-1
    const puntadasEstimadas = Math.ceil((gridSize * gridSize) * densidad);
    const longitudPorPuntada = 15; // cm por puntada
    const longitudTotal = puntadasEstimadas * longitudPorPuntada;
    
    return {
      madejas: Math.ceil(longitudTotal / 800), // Una madeja tiene aprox. 800cm
      metros: Math.ceil(longitudTotal / 100), // Convertir a metros
      puntadas: puntadasEstimadas
    };
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Materiales Necesarios</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Tela Base</h4>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Tela de Lino/Aida</TableCell>
                <TableCell>
                  {telaSize.width + 20}cm x {telaSize.height + 20}cm
                  <Badge variant="secondary" className="ml-2">
                    Incluye margen
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div>
          <h4 className="font-medium mb-2">Hilos por Color</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Madejas</TableHead>
                <TableHead>Metros</TableHead>
                <TableHead>Puntadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colors.map((color, index) => {
                const { madejas, metros, puntadas } = calcularHiloPorColor(color, index);
                return (
                  <TableRow key={color}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                        <span>Color {index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>{madejas}</TableCell>
                    <TableCell>{metros}m</TableCell>
                    <TableCell>~{puntadas}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div>
          <h4 className="font-medium mb-2">Herramientas</h4>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Agujas de Bordar</TableCell>
                <TableCell>2-3 unidades (Nº 3-9)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Aro de Bordado</TableCell>
                <TableCell>{telaSize.width > 20 ? "30cm" : "20cm"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tijeras</TableCell>
                <TableCell>De punta fina</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Enhebrador</TableCell>
                <TableCell>1 unidad</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}