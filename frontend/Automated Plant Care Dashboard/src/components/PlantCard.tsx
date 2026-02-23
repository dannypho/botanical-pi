import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Droplets, Thermometer, Sun, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Plant {
  id: string;
  name: string;
  species: string;
  imageUrl: string;
  moistureLevel: number;
  temperature: number;
  lightLevel: number;
  lastWatered: string;
  status: 'healthy' | 'needs-attention' | 'critical';
  nextWatering: string;
}

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
}

export function PlantCard({ plant, onClick }: PlantCardProps) {
  const getStatusColor = (status: Plant['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'needs-attention':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  const getStatusText = (status: Plant['status']) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'needs-attention':
        return 'Needs Attention';
      case 'critical':
        return 'Critical';
    }
  };

  const getMoistureColor = (level: number) => {
    if (level >= 60) return 'bg-blue-500';
    if (level >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(plant.status)}>
            {getStatusText(plant.status)}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{plant.name}</span>
          {plant.status === 'critical' && (
            <AlertTriangle className="size-5 text-red-500" />
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{plant.species}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="size-4 text-blue-500" />
              <span>Moisture</span>
            </div>
            <span className="font-medium">{plant.moistureLevel}%</span>
          </div>
          <Progress 
            //value ={plant.moistureLevel} 
            //className="h-2"
            indicatorClassName={getMoistureColor(plant.moistureLevel)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="size-4 text-orange-500" />
            <div>
              <p className="text-muted-foreground">Temp</p>
              <p className="font-medium">{plant.temperature}°F</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-yellow-500" />
            <div>
              <p className="text-muted-foreground">Light</p>
              <p className="font-medium">{plant.lightLevel}%</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last watered:</span>
            <span className="font-medium">{plant.lastWatered}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Next watering:</span>
            <span className="font-medium">{plant.nextWatering}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
