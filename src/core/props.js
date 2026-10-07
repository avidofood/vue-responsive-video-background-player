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
    // A button that pauses and plays the video (WCAG 2.2.2)
    pauseButton: {
        type: Boolean,
        default: false,
    },
    pauseLabel: {
        type: String,
        default: 'Pause background video',
    },
    playLabel: {
        type: String,
        default: 'Play background video',
    },
    // With prefers-reduced-motion: reduce, only the poster shows
    respectReducedMotion: {
        type: Boolean,
        default: false,
    },
    // Pauses the video while it is off screen or the page is in the background
    pauseWhenHidden: {
        type: Boolean,
        default: false,
    },
    // Loads the video when the section comes near the viewport
    lazy: {
        type: Boolean,
        default: false,
    },
    ...playerProps,
};
