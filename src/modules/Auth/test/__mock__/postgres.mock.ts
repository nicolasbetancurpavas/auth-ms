export const dbOk = {
    one: async (): Promise<Record<string, string>> => {
        return { resultado: 'OK' };
    },
    query: async (): Promise<unknown> => {
        return { resultado: 'OK' };
    },
    oneOrNone: async (_query: string, params: any): Promise<any> => {
        if (params.idPeticion === 1277) return true;
        if (params.idPeticion === 1277888889) return false;
        if (params.codigo_checkpoint === 10743)
            return 'No se encontro el id checkpoint 10743 para obtener la parametrizacion';
        if (params.idPeticion === 1277888889) return 'No se encontro la peticion 1277888889';
        return { holi: 'hi' };
    },
    none: async (): Promise<Record<string, unknown>> => {
        return {};
    },
};

export const dbError = {
    one: async (query: string, params: unknown[]): Promise<Record<string, string>> => {
        const check = params.includes('73940027576');
        if (query !== 'SELECT frs()' && !check) throw new Error(`Error de BD`);
        if (check) {
            throw {
                code: 'P0001',
                message: `Raise Exception Motherfucker!`,
                query,
            };
        }
        return { frs: '1234' };
    },
    query: async (query: string, params: unknown[]): Promise<unknown[]> => {
        if (params.includes('73940027576')) {
            throw {
                code: 'P0001',
                message: `Raise Exception Motherfucker!`,
                query,
            };
        }
        return [];
    },
    oneOrNone: async (): Promise<Record<string, unknown>> => {
        return { holi: 'hi' };
    },
    none: async (): Promise<Record<string, unknown>> => {
        return {};
    },
};
