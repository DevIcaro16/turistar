import * as Yup from 'yup';

export interface ProfileFormData {
    email: string;
    name: string;
    phone: string;
    transport_type: string;
}

export const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email Inválido!").required("Email é Obrigatório!"),
    name: Yup.string().required('Nome é obrigatório'),
    phone: Yup.string().required('Telefone é obrigatório'),
    transport_type: Yup.string().required('Tipo de transporte é obrigatório'),
});

export const initialFormValues: ProfileFormData = {
    email: '',
    name: '',
    phone: '',
    transport_type: '',
}; 