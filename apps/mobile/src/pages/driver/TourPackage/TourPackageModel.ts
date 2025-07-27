import * as Yup from 'yup';

export interface TourPackageData {
    id: string;
    title: string;
    image?: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string | Date;
    startDate?: Date;
    endDate?: Date;
    isRunning: boolean;
    isFinalised: boolean;
    price: number;
    seatsAvailable: number;
    vacancies?: number;
    type: string;
    carId: string;
    touristPointId: string;
}

export interface TourPackageFormData {
    title: string;
    origin_local: string;
    destiny_local: string;
    date_tour: string;
    time_tour: string;
    price: string;
    seatsAvailable: string;
    type: string;
    carId: string;
    touristPointId: string;
}

export const validationSchema = Yup.object().shape({
    title: Yup.string().required('Título é obrigatório'),
    origin_local: Yup.string().required('Origem é obrigatória'),
    destiny_local: Yup.string().required('Destino é obrigatório'),
    date_tour: Yup.string()
        .required('Data do passeio é obrigatória')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data inválida')
        .test('valid-date', 'Data inválida', value => {
            if (!value) return false;
            const [day, month, year] = value.split('/');
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            const currentYear = new Date().getFullYear();
            return (
                date.getFullYear() === Number(year) &&
                date.getMonth() === Number(month) - 1 &&
                date.getDate() === Number(day) &&
                Number(year) >= currentYear &&
                Number(year) <= 2100
            );
        })
        .test('not-in-past', 'A data não pode ser anterior a hoje', value => {
            if (!value) return false;
            const [day, month, year] = value.split('/');
            const inputDate = new Date(Number(year), Number(month) - 1, Number(day));
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return inputDate >= today;
        }),
    time_tour: Yup.string()
        .required('Horário é obrigatório')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido'),
    price: Yup.number().typeError('Preço deve ser um número').required('Preço é obrigatório'),
    seatsAvailable: Yup.number().typeError('Vagas disponíveis deve ser um número').required('Vagas disponíveis é obrigatório').max(99, 'Número de vagas acima do comum.'),
    type: Yup.string().required('Tipo é obrigatório'),
    carId: Yup.string().required('Selecione um carro'),
    touristPointId: Yup.string().required('Selecione um ponto turístico'),
});

export const initialFormValues: TourPackageFormData = {
    title: '',
    origin_local: '',
    destiny_local: '',
    date_tour: '',
    time_tour: '',
    price: '',
    seatsAvailable: '',
    type: '',
    carId: '',
    touristPointId: '',
}; 