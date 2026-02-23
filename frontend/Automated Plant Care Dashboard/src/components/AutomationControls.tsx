import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import {
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Activity,
  Calendar,
  Settings,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface AutomationControlsProps {
  plantName: string;
}

export function AutomationControls({ plantName }: AutomationControlsProps) {
  // Mock sensor data over time
  const moistureData = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 42 },
    { time: '08:00', value: 38 },
    { time: '12:00', value: 35 },
    { time: '16:00', value: 68 },
    { time: '20:00', value: 65 },
    { time: '24:00', value: 62 }
  ];

  const temperatureData = [
    { time: '00:00', temp: 68, humidity: 55 },
    { time: '04:00', temp: 66, humidity: 58 },
    { time: '08:00', temp: 70, humidity: 52 },
    { time: '12:00', temp: 75, humidity: 48 },
    { time: '16:00', temp: 77, humidity: 45 },
    { time: '20:00', temp: 72, humidity: 50 },
    { time: '24:00', temp: 69, humidity: 54 }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Sensor Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="size-4 text-blue-500" />
              Soil Moisture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground mt-1">Optimal range</p>
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <Activity className="size-3" />
              <span>+5% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="size-4 text-orange-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72°F</div>
            <p className="text-xs text-muted-foreground mt-1">Comfortable</p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="size-3" />
              <span>Stable</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sun className="size-4 text-yellow-500" />
              Light Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground mt-1">Bright indirect</p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="size-3" />
              <span>8.5 hours today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wind className="size-4 text-cyan-500" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54%</div>
            <p className="text-xs text-muted-foreground mt-1">Good level</p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="size-3" />
              <span>Normal range</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moisture Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture History (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={moistureData}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="url(#colorMoisture)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <AlertCircle className="size-4 text-blue-500" />
            <span>Automated watering triggered at 16:00</span>
          </div>
        </CardContent>
      </Card>

      {/* Temperature & Humidity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature & Humidity (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                strokeWidth={2}
                name="Temperature"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Humidity"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Automation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-water">Automatic Watering</Label>
              <p className="text-sm text-muted-foreground">
                Water when moisture drops below threshold
              </p>
            </div>
            <Switch id="auto-water" defaultChecked />
          </div>

          <div className="space-y-3">
            <Label>Moisture Threshold</Label>
            <div className="flex items-center gap-4">
              <Slider
                defaultValue={[30]}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12">30%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Trigger watering when moisture falls below this level
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="light-adjust">Smart Light Adjustment</Label>
              <p className="text-sm text-muted-foreground">
                Adjust grow lights based on natural light
              </p>
            </div>
            <Switch id="light-adjust" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="alerts">Low Moisture Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when attention needed
              </p>
            </div>
            <Switch id="alerts" defaultChecked />
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Droplets className="size-4 mr-2" />
              Water Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Watering Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            Watering Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Last Watered</p>
                <p className="text-sm text-muted-foreground">Feb 7, 2026 at 4:00 PM</p>
              </div>
              <Badge variant="secondary">2 days ago</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium">Next Scheduled Watering</p>
                <p className="text-sm text-muted-foreground">Feb 11, 2026 at 8:00 AM</p>
              </div>
              <Badge className="bg-green-600">In 2 days</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Average Frequency</p>
                <p className="text-sm text-muted-foreground">Based on last 30 days</p>
              </div>
              <Badge variant="secondary">Every 4 days</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
