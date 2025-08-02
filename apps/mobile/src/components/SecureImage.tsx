import React from 'react';
import { Image, ImageProps } from 'react-native';
import { secureImageUrl } from '../util/imageUtils';

interface SecureImageProps extends Omit<ImageProps, 'source'> {
    source: { uri: string } | string;
    fallbackSource?: any;
}

/**
 * Componente de imagem que automaticamente converte URLs HTTP para HTTPS
 */
export const SecureImage: React.FC<SecureImageProps> = ({ source, ...props }) => {
    const secureSource = React.useMemo(() => {
        if (typeof source === 'string') {
            const secureUrl = secureImageUrl(source);
            return secureUrl ? { uri: secureUrl } : null;
        }

        if (typeof source === 'object' && source.uri) {
            const secureUrl = secureImageUrl(source.uri);
            return secureUrl ? { ...source, uri: secureUrl } : null;
        }

        return source;
    }, [source]);

    if (!secureSource) {
        return null;
    }

    return <Image source={secureSource} {...props} />;
}; 