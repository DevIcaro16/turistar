import * as Yup from 'yup';

export interface TouristPoint {
    id: string;
    name: string;
    city: string;
    uf: string;
    driverId: string;
    image?: string;
    latitude?: string;
    longitude?: string;
}

export interface TouristPointFormData {
    name: string;
    city: string;
    uf: string;
    latitude?: string;
    longitude?: string;
}

export const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nome do local é obrigatório'),
    city: Yup.string().required('Cidade é obrigatório'),
    uf: Yup.string().required('Estado é obrigatório'),
    latitude: Yup.string().optional(),
    longitude: Yup.string().optional(),
});

export const initialFormValues: TouristPointFormData = {
    name: '',
    city: '',
    uf: '',
    latitude: '',
    longitude: '',
}; 