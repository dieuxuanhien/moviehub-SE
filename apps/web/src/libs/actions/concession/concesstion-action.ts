import { ConcessionCategory, ServiceResult } from "@movie-hub/shared-types";
import api from "../../api/api-client";
import { ConcessionDto } from "../../types/concession.type";

export const findAllConcessions = async ( query : {
  cinemaId?: string,
  category?: ConcessionCategory,
  available?: boolean
}): Promise<ServiceResult<ConcessionDto[]>> => {
  try {
    console.log('[findAllConcessions] Input query:', JSON.stringify(query, null, 2));
    
    // Build params object, only include defined values
    const params: any = {};
    
    if (query.category) {
      params.category = query.category;
    }
    if (query.available !== undefined && query.available !== null) {
      params.available = query.available;
    }
    if (query.cinemaId) {
      params.cinemaId = query.cinemaId;
    }
    
    console.log('[findAllConcessions] Sending params:', JSON.stringify(params, null, 2));
    
    const response = await api.get('/concessions', { params });
    
    console.log('[findAllConcessions] Response data count:', response.data?.data?.length);
    console.log('[findAllConcessions] Response data:', response.data?.data?.slice(0, 3).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category
    })));
    
    return response.data;
  } catch (error) {
    console.error('[findAllConcessions] Error:', error);
    throw error;
  }
}


