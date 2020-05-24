export interface Settings {
    grading: {
        great: {
            color: string,
            text: string
        },
        good: {
            color: string,
            text: string
        },
        meh: {
            color: string,
            text: string
        },
        bad: {
            color: string,
            text: string
        },
        awful: {
            color: string,
            text: string
        }
    };

    firstDayOfWeek: number;
    showActivities: boolean;
    darkMode: boolean;

    addons: {
        existentialDread: {
            enabled: boolean,
            flipIcons: boolean,
        }
        ageTimer: {
            enabled: boolean,
            birthday?: string
        }
    };
}
