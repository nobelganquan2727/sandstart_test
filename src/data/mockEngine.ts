import dayjs from "dayjs";

export type MachineStatus = "online" | "offline" | "error" | "maintenance";
export type ConnectionType = "4G" | "5G" | "WiFi";

export interface MachineData {
  id: string;
  name: string;
  location: string;
  osVersion: string;
  hardwareModel: string;
  supplySource: string;
  connectionType: ConnectionType;
  status: MachineStatus;
  ip: string;
  
  // Metrics
  inventoryLevel: number; // 0-100%
  internalTemperature: number; // Celsius
  cashBoxStatus: number; // 0-100% capacity
  signalStrength: number; // 0-100%
  uptime: number; // hours
  totalDispenses: number;
  totalRevenue: number;
  lastMaintained: string;
  
  // Custom alerts if any
  alerts: string[];
}

const LOCATIONS = ["North America", "Europe", "Asia-Pacific", "South America", "Middle East"];
const OS_VERSIONS = ["v2.1.0", "v2.2.4", "v3.0.1", "v3.1.5"];
const HARDWARE_MODELS = ["VendMax-100", "VendMax-200", "CoolFrost-V1", "SnackPro-X"];
const SUPPLY_SOURCES = ["Sysco", "Nestle Direct", "LocalDistributor-A", "LocalDistributor-B"];
const CONNECTION_TYPES: ConnectionType[] = ["4G", "5G", "WiFi"];

const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateInitialData = (count: number = 200): MachineData[] => {
  const machines: MachineData[] = [];
  
  for (let i = 0; i < count; i++) {
    const isError = Math.random() > 0.95;
    const isOffline = Math.random() > 0.98;
    const isMaintenance = Math.random() > 0.97;
    
    let status: MachineStatus = "online";
    const alerts: string[] = [];
    
    if (isOffline) {
      status = "offline";
    } else if (isMaintenance) {
      status = "maintenance";
    } else if (isError) {
      status = "error";
      const possibleAlerts = ["Temp High", "Out of Stock", "Coin Jam", "Network Failure"];
      alerts.push(randomChoice(possibleAlerts));
    }

    const inventoryLevel = randomInt(10, 100);
    if (inventoryLevel < 15 && status === "online") {
      alerts.push("Low Stock");
    }
    
    machines.push({
      id: `MAC-${10000 + i}`,
      name: `VM-${randomChoice(LOCATIONS).substring(0, 2).toUpperCase()}-${randomInt(100, 999)}`,
      location: randomChoice(LOCATIONS),
      osVersion: randomChoice(OS_VERSIONS),
      hardwareModel: randomChoice(HARDWARE_MODELS),
      supplySource: randomChoice(SUPPLY_SOURCES),
      connectionType: randomChoice(CONNECTION_TYPES),
      status,
      ip: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      
      inventoryLevel,
      internalTemperature: randomInt(2, 10), // Mostly cold drinks
      cashBoxStatus: randomInt(0, 100),
      signalStrength: randomInt(30, 100),
      uptime: randomInt(24, 720), // 1 day to 30 days
      totalDispenses: randomInt(1000, 50000),
      totalRevenue: randomInt(1500, 75000),
      lastMaintained: dayjs().subtract(randomInt(1, 60), 'day').toISOString(),
      alerts
    });
  }
  
  return machines;
};

// Simulated History Data (KPI Time Series over last 30 days)
export interface HistoricalData {
  date: string;
  revenue: number;
  activeMachines: number;
  criticalAlerts: number;
  stockHealth: number; // Average inventory level globally
}

export const generateHistoricalData = (): HistoricalData[] => {
  const data: HistoricalData[] = [];
  let baseRevenue = 50000;
  let baseActive = 185;
  
  for (let i = 29; i >= 0; i--) {
    const dateStr = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    data.push({
      date: dateStr,
      revenue: baseRevenue + randomInt(-2000, 5000),
      activeMachines: baseActive + randomInt(-5, 10),
      criticalAlerts: randomInt(2, 15),
      stockHealth: randomInt(65, 95)
    });
  }
  return data;
};
