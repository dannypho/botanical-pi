import { useEffect, useState } from "react";
import { getLatestReading, controlDevice } from "@/api/api";
import { PlantCard, Plant } from "./PlantCard";
import { AutomationControls } from "./AutomationControls";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Leaf, Droplets, Bell, X, Activity } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Mock plants
  const mockPlants: Plant[] = [
    {
      id: "mock_1",
      name: "Desert Rose",
      species: "Succulent",
      imageUrl:
        "https://images.unsplash.com/photo-1621512366232-0b7b78983782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      moistureLevel: 25,
      temperature: 75,
      lightLevel: 92,
      lastWatered: "5 days ago",
      status: "critical",
      nextWatering: "Today",
    },
    {
      id: "mock_2",
      name: "Snake Plant",
      species: "Sansevieria",
      imageUrl:
        "https://images.unsplash.com/photo-1668426231244-1827c29ef8e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      moistureLevel: 45,
      temperature: 70,
      lightLevel: 65,
      lastWatered: "3 days ago",
      status: "needs-attention",
      nextWatering: "Tomorrow",
    },
    {
      id: "mock_3",
      name: "Fiddle Leaf Fig",
      species: "Ficus Lyrata",
      imageUrl:
        "https://images.unsplash.com/photo-1673297352939-e308a901b5f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      moistureLevel: 68,
      temperature: 73,
      lightLevel: 78,
      lastWatered: "1 day ago",
      status: "healthy",
      nextWatering: "In 3 days",
    },
  ];

  // Fetch live Pi plant
  const fetchLivePlant = async () => {
    try {
      const data = await getLatestReading();
      const livePlant: Plant = {
        id: "plant_001",
        name: "Monstera Deliciosa",
        species: "Monstera",
        imageUrl:
          "https://images.unsplash.com/photo-1648528203163-8604bf696e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        moistureLevel: data.moisture,
        temperature: data.temperature,
        lightLevel: data.light,
        lastWatered: "unknown",
        status: data.water_detected ? "healthy" : "needs-attention",
        nextWatering: "unknown",
       // timestamp: data.timestamp,
      };
      setPlants([livePlant, ...mockPlants]);
    } catch (err) {
      console.error("Failed to fetch live plant:", err);
      // fallback: just use mock plants
      setPlants(mockPlants);
    }
  };

  useEffect(() => {
    fetchLivePlant();
    const interval = setInterval(fetchLivePlant, 5000);
    return () => clearInterval(interval);
  }, []);

  const healthyPlants = plants.filter((p) => p.status === "healthy").length;
  const criticalPlants = plants.filter((p) => p.status !== "healthy").length;
  const avgMoisture = plants.length
    ? Math.round(plants.reduce((sum, p) => sum + p.moistureLevel, 0) / plants.length)
    : 0;

  const handleControl = async (action: string) => {
    try {
      await controlDevice(action);
      alert(`Command "${action}" sent!`);
    } catch (err) {
      console.error(err);
      alert("Failed to send command");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Leaf className="size-8 text-green-600" />
                <Droplets className="size-4 text-blue-500 absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <h1 className="font-semibold">Botanical Pi</h1>
                <p className="text-xs text-muted-foreground">Automated Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                {criticalPlants > 0 && <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats & Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
              <Leaf className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plants.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Healthy Plants</CardTitle>
              <Activity className="size-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthyPlants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <Bell className="size-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalPlants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Moisture</CardTitle>
              <Droplets className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgMoisture}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onClick={() => setSelectedPlant(plant)}
            />
          ))}
        </div>
      </main>

      {/* Plant Modal */}
      <Dialog open={!!selectedPlant} onOpenChange={() => setSelectedPlant(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedPlant?.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setSelectedPlant(null)}>
                <X className="size-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              View detailed sensor data and automation controls for {selectedPlant?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedPlant && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    selectedPlant.status === "healthy"
                      ? "bg-green-500"
                      : selectedPlant.status === "needs-attention"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }
                >
                  {selectedPlant.status === "healthy"
                    ? "Healthy"
                    : selectedPlant.status === "needs-attention"
                    ? "Needs Attention"
                    : "Critical"}
                </Badge>
                <span className="text-sm text-muted-foreground">{selectedPlant.species}</span>
              </div>
              <AutomationControls
                plantName={selectedPlant.name}
                //onControl={handleControl}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}