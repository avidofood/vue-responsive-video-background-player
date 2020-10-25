import playerProps from './playerProps';

const sourcesProperties = ['src', 'res', 'autoplay'];

const sourcesValidator = (value) => {
    if (!Array.isArray(value)) {
        return false;
    }

    if (value.length === 0) {
        return true;
    }

    return arrayContainsProps(value, sourcesProperties);
};

const arrayContainsProps = (array, arrayPropNames) => {
    if (arrayPropNames.length === 1) {
        return containsProp(array, arrayPropNames[0]);
    }

    return containsProp(array, arrayPropNames[0])
        * arrayContainsProps(array, arrayPropNames.slice(1));
};

const containsProp = (array, propName) => {
    for (let i = array.length - 1; i > -1; i -= 1) {
        const propObj = array[i];

        if (!isObject(propObj)) {
            return false;
        }

        if (exists(propObj, propName)) {
            return true;
        }
    }

    return false;
};

const isObject = (obj) => obj != null && obj.constructor.name === 'Object';

const exists = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export default {
    sources: {
        type: Array,
        default() {
            return [];
        },
        validator: sourcesValidator,
    },
    autoplay: {
        type: Boolean,
        default: true,
    },
    poster: {
        type: String,
        default: '',
    },
    overlay: {
        type: String,
        default: '',
    },
    ...playerProps,
};
