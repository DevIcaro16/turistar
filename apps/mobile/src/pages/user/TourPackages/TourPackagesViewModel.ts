import { useEffect, useRef, useState } from 'react';
import api from '../../../util/api/api';
import { TourPackageData, CarType, PendingReservation } from './types';

export function formatDateTime(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hour = String(d.getHours() + 3).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minute}`;
}

export const CAR_TYPES: CarType[] = [
    { value: 'BUGGY', label: 'Buggy' },
    { value: 'LANCHA', label: 'Lancha' },
    { value: 'FOUR_BY_FOUR', label: '4X4' },
];

export function useTourPackagesViewModel() {
    const [tourPackages, setTourPackages] = useState<TourPackageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [origin, setOrigin] = useState('');
    const [destiny, setDestiny] = useState('');
    const [carType, setCarType] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [reservingId, setReservingId] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<{ [id: string]: string }>({});
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingReservation, setPendingReservation] = useState<PendingReservation | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<TourPackageData | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const fetchTourPackages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/TourPackage');
            console.log(response);
            setTourPackages(response.data.tourPackages || response.data || []);
        } catch (error) {
            setTourPackages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTourPackages();

        intervalRef.current = setInterval(fetchTourPackages, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleReserve = (tourPackage: TourPackageData) => {
        setSelectedPackage(tourPackage);
        setDetailModalVisible(true);
    };

    const handleAdvance = () => {
        if (!selectedPackage) return;
        const quantity = parseInt(quantities[selectedPackage.id] || '1', 10);
        if (!quantity || quantity < 1) {
            showAlert('Informe uma quantidade válida de reservas.', 'error');
            return;
        }
        if (quantity > selectedPackage.vacancies) {
            showAlert('Quantidade de reservas maior que o número de vagas disponíveis.', 'error');
            return;
        }
        setPendingReservation({ pkg: selectedPackage, quantity });
        setDetailModalVisible(false);
        setConfirmModalVisible(true);
    };

    const handleConfirmReservation = async () => {
        if (!pendingReservation) return;

        setReservingId(pendingReservation.pkg.id);
        try {
            const response = await api.post('/reservation', {
                tourPackageId: pendingReservation.pkg.id,
                vacancies_reserved: pendingReservation.quantity,
            });

            showAlert('Reserva realizada com sucesso!');
            setConfirmModalVisible(false);
            setPendingReservation(null);
            setSelectedPackage(null);
            setQuantities({});
            fetchTourPackages();
        } catch (error: any) {
            showAlert(error.response?.data?.message || 'Erro ao realizar reserva', 'error');
        } finally {
            setReservingId(null);
        }
    };

    const filteredPackages = tourPackages.filter(pkg => {
        const matchesOrigin = !origin || pkg.origin_local.toLowerCase().includes(origin.toLowerCase());
        const matchesDestiny = !destiny || pkg.destiny_local.toLowerCase().includes(destiny.toLowerCase());
        const matchesCarType = !carType || pkg.car.type === carType;
        return matchesOrigin && matchesDestiny && matchesCarType;
    });

    return {
        tourPackages: filteredPackages,
        loading,
        origin,
        destiny,
        carType,
        alertVisible,
        alertMessage,
        alertType,
        reservingId,
        quantities,
        confirmModalVisible,
        pendingReservation,
        detailModalVisible,
        selectedPackage,
        showAlert,
        fetchTourPackages,
        handleReserve,
        handleAdvance,
        handleConfirmReservation,
        setOrigin,
        setDestiny,
        setCarType,
        setQuantities,
        setAlertVisible,
        setConfirmModalVisible,
        setDetailModalVisible,
    };
} 