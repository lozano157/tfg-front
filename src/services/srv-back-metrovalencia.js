import axiosBack from "@/utils/axios-back";
import urls from "@/urls/urls-back-metrovalencia";

const BackEmtServices = {
    async fGetParadaById(payload) {
        return axiosBack
            .post(urls.GET_PARADA_BY_ID, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los markers", error);
                return error;
            });
    },
    async fGetHorariosParada(payload) {
        return axiosBack
            .post(urls.GET_HORARIOS_PARADA, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los horarios de la parada", error);
                return error;
            });
    }
};


export default BackEmtServices;