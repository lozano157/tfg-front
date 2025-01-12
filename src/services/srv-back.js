import axiosBack from "@/utils/axios-back";
import urls from "@/urls/urls-back";

const BackServices = {
    async fGetMarkers(payload) {
        return axiosBack
            .post(urls.GET_MARKERS, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los markers", error);
                return error;
            });
    },

    /***FAVORITOS -----------------------------------------------------*/
    async fAddFavourite(payload, maxRetries = 3) {
        let retries = 0;
    
        while (retries < maxRetries) {
            try {
                const response = await axiosBack.post(urls.ADD_FAVOURITE, payload);
                return response.data; // Si tiene éxito, se devuelve el resultado
            } catch (error) {
                console.log(`Error al añadir a favoritos (Intento ${retries + 1} de ${maxRetries})`, error);
    
                retries += 1;
    
                // Si se alcanzan los intentos máximos, lanzamos el error
                if (retries === maxRetries) {
                    throw new Error("Se alcanzó el número máximo de reintentos");
                }
            }
        }
    },
    async fDeleteFavourite(payload) {
        return axiosBack
            .post(urls.DELETE_FAVOURITE, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al borrar de favoritos", error);
                return error;
            });
    }
    /*** ACABA FAVORITOS ------------------------------------------------*/

};

export default BackServices;