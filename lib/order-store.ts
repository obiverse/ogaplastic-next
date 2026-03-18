/**
 * OGA PLASTIC — Client-side order persistence via IndexedDB.
 * Zero dependencies. Works offline. Survives browser restart.
 */

export interface SavedOrder {
  ref: string;
  timestamp: number;
  productType: "tank" | "bin" | "custom";
  productName: string;
  volume: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  deliveryState: string;
  deliveryZone: string;
  deliveryEstimate: string;
  branding: boolean;
  total: string;
  // Encoded config for reorder
  orderHash: string;
}

const DB_NAME = "oga-plastic";
const STORE_NAME = "orders";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "ref" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveOrder(order: SavedOrder): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(order);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback: localStorage
    try {
      const orders = JSON.parse(localStorage.getItem("oga-orders") || "[]");
      orders.unshift(order);
      localStorage.setItem("oga-orders", JSON.stringify(orders.slice(0, 50)));
    } catch { /* silent */ }
  }
}

export async function getOrders(): Promise<SavedOrder[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const orders = (req.result as SavedOrder[]).sort(
          (a, b) => b.timestamp - a.timestamp
        );
        resolve(orders);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback: localStorage
    try {
      return JSON.parse(localStorage.getItem("oga-orders") || "[]");
    } catch {
      return [];
    }
  }
}

export async function getOrderCount(): Promise<number> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      return JSON.parse(localStorage.getItem("oga-orders") || "[]").length;
    } catch {
      return 0;
    }
  }
}
