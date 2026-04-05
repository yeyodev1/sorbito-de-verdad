import httpBase from './httpBase';

export interface ShippingZone {
  _id: string;
  name: string;
  description?: string;
  price: number;
  countries: string[];
  estimatedDays: string;
  mapsUrl?: string;
  isActive: boolean;
}

type ShippingZonePayload = Omit<ShippingZone, '_id'>;

export const shippingZoneService = {
  async getZones(): Promise<ShippingZone[]> {
    const { data } = await httpBase.get('/shipping-zones');
    const result = data?.data || data;
    return Array.isArray(result) ? result : (result?.zones || []);
  },

  async createZone(payload: Partial<ShippingZonePayload>): Promise<ShippingZone> {
    const { data } = await httpBase.post('/shipping-zones', payload);
    return data?.data || data;
  },

  async updateZone(id: string, payload: Partial<ShippingZonePayload>): Promise<ShippingZone> {
    const { data } = await httpBase.put(`/shipping-zones/${id}`, payload);
    return data?.data || data;
  },

  async deleteZone(id: string): Promise<void> {
    await httpBase.delete(`/shipping-zones/${id}`);
  },
};
