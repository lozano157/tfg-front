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
    }
};

export default BackServices;