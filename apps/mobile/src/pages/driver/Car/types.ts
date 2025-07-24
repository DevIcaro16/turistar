import * as Yup from 'yup';

export interface Car {
    id: string;
    type: string;
    model: string;
    capacity: number;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CarFormData {
    type: string;
    model: string;
    capacity: string;
}

export const validationSchema = Yup.object().shape({
    type: Yup.string().required('Tipo de transporte é obrigatório'),
    model: Yup.string().required('Modelo é obrigatório'),
    capacity: Yup.string()
        .required('Capacidade é obrigatória')
        .max(1, 'Capacidade deve ser um valor entre 1 e 9')
        .matches(/^\d+$/, 'Capacidade deve ser um número')
});

export const initialFormValues: CarFormData = {
    type: '',
    model: '',
    capacity: '',
}; 