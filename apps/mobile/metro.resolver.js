const path = require('path');

module.exports = {
    resolveRequest: (context, moduleName, platform) => {
        // Resolver para módulos do React Native
        if (moduleName.startsWith('react-native/')) {
            const modulePath = moduleName.replace('react-native/', '');
            return {
                filePath: path.resolve(__dirname, `../node_modules/react-native/Libraries/${modulePath}`),
                type: 'sourceFile',
            };
        }

        // Resolver para módulos específicos que estão causando problemas
        const problematicModules = {
            '../Utilities/Platform': 'react-native/Libraries/Utilities/Platform',
            '../../Utilities/Platform': 'react-native/Libraries/Utilities/Platform',
        };

        if (problematicModules[moduleName]) {
            return {
                filePath: path.resolve(__dirname, `../node_modules/${problematicModules[moduleName]}`),
                type: 'sourceFile',
            };
        }

        // Deixar o Metro resolver normalmente
        return context.resolveRequest(context, moduleName, platform);
    },
}; 