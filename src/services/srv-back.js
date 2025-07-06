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
    async fGetFavouriteMarkers(payload) {
        return axiosBack
            .post(urls.GET_FAVOURITE_MARKERS, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los markers", error);
                return error;
            });
    },
    async fGetParadasEmt(payload) {
        return axiosBack
            .post(urls.GET_PARADAS_EMT, payload)
            .then((response) => {   
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener las paradas EMT", error);
                return error;
            });
    },
    async fGetParadasFgv(payload) {
        return axiosBack
            .post(urls.GET_PARADAS_FGV, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener las paradas FGV", error);
                return error;
            });
    },
    async fGetParadasValenbisi(payload) {
        return axiosBack
            .post(urls.GET_PARADAS_VALENBISI, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener las paradas Valenbisi", error);
                return error;
            });
    },

    /***FAVORITOS -----------------------------------------------------*/
    async fGetFavourites(payload) {
        return axiosBack
            .post(urls.GET_FAVOURITES, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los favoritos", error);
                throw error;
            });
    },
    async fAddFavourite(payload, maxRetries = 3) {
        return axiosBack
            .post(urls.ADD_FAVOURITE, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al añadir a favoritos", error);
                if (maxRetries > 0) {
                    return this.fAddFavourite(payload, maxRetries - 1);
                }
                return error;
            });
    },
    async fGetIsFavourite(payload) {
        return axiosBack
            .post(urls.IS_FAVOURITE, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los favoritos", error);
                return error;
            });
    },
    async fDeleteFavourite(payload) {
        return axiosBack
            .post(urls.DELETE_FAVOURITE, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al añadir a favoritos", error);
                if (maxRetries > 0) {
                    return this.fAddFavourite(payload, maxRetries - 1);
                }
                return error;
            });
    },
    /*** ACABA FAVORITOS ------------------------------------------------*/

    /********* AVISOS USUARIOS *************/
    async fGetAlerts(payload) {
        return axiosBack
            .post(urls.GET_ALERTS, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los avisos", error);
                return error;
            });
    },
    async fSaveAlert(payload) {
        return axiosBack
            .post(urls.SAVE_ALERT, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al añadir el aviso", error);
                return error;
            });
    },
    async fDeleteAlert(payload) {
        return axiosBack
            .post(urls.DELETE_ALERT, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al eliminar el aviso", error);
                return error;
            });
    },
    async fGetAvisosByUser(payload) {
        return axiosBack
            .post(urls.GET_AVISOS_BY_USER, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los avisos", error);
                return error;
            });
    },

    /********* ACABA AVISOS USUARIOS *************/
    /********* OTRAS FUNCIONES *************/
    async fGetAlertsMail(payload) {
        return axiosBack
            .post(urls.GET_ALERTS_MAIL, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los avisos", error);
                return error;
            });
    },
    async fGetAllAlertsMail(payload) {
        return axiosBack
            .post(urls.GET_ALERTS_MAIL_BY_USER, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al obtener los avisos", error);
                return error;
            });
    },
    async fSaveAlertMail(payload) {
        return axiosBack
            .post(urls.SAVE_ALERT_MAIL, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al añadir el aviso", error);
                return error;
            });
    },
    async fDeleteAlertMail(payload) {
        return axiosBack
            .post(urls.DELETE_ALERT_MAIL, payload)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.log("Error al eliminar el aviso", error);
                return error;
            });
    },

};

export default BackServices;