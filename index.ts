const colors = {
    transparent: 'transparent',
    current: 'currentColor',
    white: '#ffffff',
    black: '#000000',
    neutral: {
        DEFAULT: '#5E5E5E',
        '1': '#121212',
        '10': '#1B1B1B',
        '20': '#303030',
        '30': '#474747',
        '40': '#5E5E5E',
        '50': '#747474',
        '60': '#919191',
        '70': '#ABABAB',
        '80': '#C6C6C6',
        '90': '#E2E2E2',
        '95': '#F1F1F1',
        '99': '#F9F9F9',
    },
    healthcare: {
        DEFAULT: '#005B89',
        '10': '#021E2D',
        '20': '#04344D',
        '30': '#064B70',
        '40': '#005B89',
        '50': '#3A7B9E',
        '60': '#6497B3',
        '70': '#8AB1C5',
        '80': '#ADC8D6',
        '90': '#D7E4EC',
        '95': '#EBF2F5',
        '99': '#F7FAFB',
    },
    culture: {
        DEFAULT: '#C72B2A',
        '10': '#380C0C',
        '20': '#5F1414',
        '30': '#891D1D',
        '40': '#C72B2A',
        '50': '#CE4444',
        '60': '#DA7272',
        '70': '#E49797',
        '80': '#EDBABA',
        '90': '#F6DDDD',
        '95': '#FAEEEE',
        '99': '#FDF8F8',
    },
    education: {
        DEFAULT: '#00695C',
        '10': '#00201C',
        '20': '#003731',
        '30': '#005046',
        '40': '#00695C',
        '50': '#2A8478',
        '60': '#589C94',
        '70': '#81B5AE',
        '80': '#ABCDC9',
        '90': '#D5E6E4',
        '95': '#EAF2F1',
        '99': '#F6FAFA',
    },
    base: {
        DEFAULT: '#37474F',
        '10': '#161C20',
        '20': '#273238',
        '30': '#37474F',
        '40': '#536067',
        '50': '#6C787E',
        '60': '#899297',
        '70': '#A5ACB0',
        '80': '#C2C7CA',
        '90': '#E0E3E4',
        '95': '#F0F1F1',
        '99': '#F9F9FA',
    },
    error: {
        DEFAULT: '#EB0000',
        '10': '#410000',
        '20': '#690000',
        '30': '#930000',
        '40': '#C00000',
        '50': '#EB0000',
        '60': '#FF5353',
        '70': '#FF8888',
        '80': '#FFB3B3',
        '90': '#FFDADA',
        '95': '#FFECEC',
        '99': '#FFF8F8',
    },
    purple: {
        DEFAULT: '#9575CD',
        '10': '#22133C',
        '20': '#3A2168',
        '30': '#553097',
        '40': '#6F45BB',
        '50': '#8663C6',
        '60': '#9575CD',
        '70': '#B7A1DD',
        '80': '#D1C4E9',
        '90': '#E6DFF3',
        '95': '#F3EFF9',
        '99': '#FAF9FD',
    },
    brown: {
        DEFAULT: '#A48C83',
        '10': '#1F1A19',
        '20': '#372F2B',
        '30': '#514440',
        '40': '#6B5B55',
        '50': '#86716A',
        '60': '#A48C83',
        '70': '#BAA7A1',
        '80': '#D0C4BF',
        '90': '#E7E1DF',
        '95': '#F3F0EF',
        '99': '#FAF9F9',
    },
    cyan: {
        DEFAULT: '#1FBBD3',
        '10': '#051F23',
        '20': '#09363C',
        '30': '#0D4E58',
        '40': '#116875',
        '50': '#158192',
        '60': '#1A9FB3',
        '70': '#1FBBD3',
        '80': '#74D5E4',
        '90': '#BCEBF2',
        '95': '#DEF5F9',
        '99': '#F2FBFC',
    },
    green: {
        DEFAULT: '#43A447',
        '10': '#0D200E',
        '20': '#173718',
        '30': '#215023',
        '40': '#2C6B2E',
        '50': '#37873A',
        '60': '#43A447',
        '70': '#4FC254',
        '80': '#7ADC7E',
        '90': '#C0EEC2',
        '95': '#E0F7E1',
        '99': '#F3FCF3',
    },
    lime: {
        DEFAULT: '#CCDB49',
        '10': '#1B1D0A',
        '20': '#2F3311',
        '30': '#454A19',
        '40': '#5C6321',
        '50': '#737B29',
        '60': '#8D9732',
        '70': '#A7B33C',
        '80': '#CCDB49',
        '90': '#E0E991',
        '95': '#EFF4C6',
        '99': '#F9FBEA',
    },
    orange: {
        DEFAULT: '#FD5930',
        '10': '#32120A',
        '20': '#561E10',
        '30': '#7D2C18',
        '40': '#A63A1F',
        '50': '#CE4927',
        '60': '#FD5930',
        '70': '#FE8B6F',
        '80': '#FEB5A2',
        '90': '#FECCBF',
        '95': '#FFEDE8',
        '99': '#FFF8F6',
    },
    pink: {
        DEFAULT: '#EE6492',
        '10': '#390918',
        '20': '#600F29',
        '30': '#89163B',
        '40': '#B51D4E',
        '50': '#E02460',
        '60': '#EE6492',
        '70': '#F28CAD',
        '80': '#F7BBD0',
        '90': '#FBDAE5',
        '95': '#FDEDF2',
        '99': '#FEF8FA',
    },
    yellow: {
        DEFAULT: '#FFC107',
        '10': '#2B1708',
        '20': '#4C270E',
        '30': '#6D3912',
        '40': '#8D4E18',
        '50': '#AC641C',
        '60': '#CF7E1F',
        '70': '#EF9820',
        '80': '#FFC107',
        '90': '#FFDD84',
        '95': '#FFECB3',
        '99': '#FFF9E7',
    },
    blue: {
        DEFAULT: '#118ce6',
        '10': '#092848',
        '20': '#0d3f6d',
        '30': '#094a83',
        '40': '#05579f',
        '50': '#056dc4',
        '60': '#118ce6',
        '70': '#3ba7f5',
        '80': '#5db5f9',
        '90': '#bbdffc',
        '95': '#e0effe',
        '99': '#f0f7ff',
    },
};

const safelist = [
    {
        pattern: /!?(bg|text|fill|stroke|border)-(healthcare|culture|education|base|neutral|error|purple|brown|cyan|green|lime|orange|pink|yellow|blue|black|white)/,
    },
];

const defaultTailwindConfig = {
    darkMode: 'selector',
    content: [
        "./index.html",
        "./src/**/*.{html,js,ts,vue}",
        "./node_modules/vgr-design-system/**/*.vue",
    ],
    safelist,
    theme: {
        colors: colors,
        extend: {
            fontSize: {
                '2xs': '10px',
            }
        },
    },
    plugins: [
        ({ addVariant }: any) => {
            addVariant("starting", "@starting-style");
        },
    ],
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target: object, ...sources: object[]) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

const config = function(conf: object = {}) {
    return mergeDeep(defaultTailwindConfig, conf);
}

export {
    config
};