import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconService {
    public icons = [
        {
            group: 'Sport',
            icons: [
                'barbell-outline',
                'fitness-outline',
                'walk-outline',
                'bicycle-outline',
                'football-outline',
                'basketball-outline',
                'baseball-outline',
                'tennisball-outline',
                'american-football-outline',
                'help-buoy-outline',
            ]
        },
        {
            group: 'Activities & Travel',
            icons: [
                'bed-outline',
                'compass-outline',
                'map-outline',
                'airplane-outline',
                'car-outline',
                'train-outline',
                'bus-outline',
                'boat-outline',
                'basket-outline',
                'shirt-outline',
                'beer-outline',
                'cafe-outline',
                'fast-food-outline',
                'ice-cream-outline',
                'pizza-outline',
                'nutrition-outline',
                'bonfire-outline',
                'book-outline',
                'color-palette-outline',
                'create-outline',
                'camera-outline',
                'images-outline',
                'chatbubbles-outline',
                'desktop-outline',
                'phone-portrait-outline',
                'film-outline',
                'headset-outline',
                'musical-note-outline',
                'mic-outline',
                'journal-outline',
                'game-controller-outline',
                'moon-outline',
                'paw-outline',
                'planet-outline',
                'code-slash-outline',
                'bandage-outline',
                'archive-outline',
            ]
        },
        {
            group: 'People & Business',
            icons: [
                'people-outline',
                'person-outline',
                'man-outline',
                'woman-outline',
                'home-outline',
                'business-outline',
                'school-outline',
                'briefcase-outline',
                'medkit-outline',
                'bar-chart-outline',
                'calculator-outline',
                'calendar-outline',
                'call-outline',
                'card-outline',
                'cash-outline',
                'cart-outline',
                'bulb-outline',
                'mail-outline',
                'hand-left-outline',
                'cog-outline',
                'construct-outline',
                'copy-outline',
                'happy-outline',
                'heart-outline',
            ]
        },
        {
            group: 'Symbols',
            icons: [
                'add-outline',
                'close-outline',
                'alarm-outline',
                'alert-outline',
                'information-circle-outline',
                'arrow-back-outline',
                'arrow-down-outline',
                'arrow-forward-outline',
                'arrow-up-outline',
                'code-outline',
                'at-outline',
                'attach-outline',
                'bluetooth-outline',
                'checkmark-outline',
                'exit-outline',
                'flag-outline',
                'trophy-outline',
                'settings-outline',
                'star-outline',
                'star-half-outline',
                'star-sharp',
                'logo-no-smoking',
                'logo-euro',
                'trash-outline',
            ]
        },
        {
            group: 'Logos',
            icons: [
                'logo-amazon',
                'logo-apple-appstore',
                'logo-google-playstore',
                'logo-android',
                'logo-apple',
                'logo-google',
                'logo-chrome',
                'logo-facebook',
                'logo-twitter',
                'logo-bitcoin',
                'logo-dropbox',
                'logo-github',
                'logo-reddit',
                'logo-steam',
                'logo-youtube',
                'logo-whatsapp',
                'logo-snapchat'
            ]
        }

    ];

    public conditionIcons = [
                'star',
                'star-half',
                'star-outline',
    ];

    public mountainIcons: {group: string, icons: string[]}[] = [
        {
            group: 'Greek Gods',
            icons: ['gods/hermes',
            'gods/caduceus', 
            'gods/metis',
            'gods/phoebe',
            //https://www.behance.net/gallery/59801849/Plutus-Logo?tracking_source=search_projects_recommended%7Cplutus
            'gods/plutus',
            'gods/zeus',
            'gods/ares',
        ]
        },
        {
            group: 'Finance',
            icons: [
                'finance/kubera_i',
                'finance/kubera_ii',
                'finance/kubera_iii',
                'finance/kubera_iv',
                'finance/kubera_v',
                'finance/liberalitas_i',
                'finance/liberalitas_ii',
                'finance/moneta_i',
                'finance/moneta_ii',
                'finance/moneta_iii',
                'finance/vesta',
            ]
        },
        {
            group: 'Sports',
            icons: ['sport/arm_i', 'sport/arm_ii', 'sport/arm_iii', 'sport/arm_iv', 'sport/arm_v', 'sport/arm_vi', 'sport/arm_vii',
                    'sport/forearm_i','sport/forearm_ii','sport/forearm_iii','sport/forearm_iv','sport/forearm_v','sport/forearm_vi','sport/forearm_vii',
                    'sport/shoulder_i', 'sport/shoulder_ii', 'sport/shoulder_iii', 'sport/shoulder_iv', 'sport/shoulder_v', 'sport/shoulder_vi', 'sport/shoulder_vii',
                    'sport/chest_i', 'sport/chest_ii', 'sport/chest_iii', 'sport/chest_iv', 'sport/chest_v', 'sport/chest_vi', 'sport/chest_vii',
                    // 'abs_i', 'abs_ii', 'abs_iii', 'abs_iv', 'abs_v', 'abs_vi', 'abs_vii',
                    // 'back_i', 'back_ii', 'back_iii', 'back_iv', 'back_v',
                    'sport/quad_i', 'sport/quad_ii', 'sport/quad_iii', 'sport/quad_iv', 'sport/quad_v', 'sport/quad_vi', 'sport/quad_vii',
                    'sport/calf_i', 'sport/calf_ii', 'sport/calf_iii', 'sport/calf_iv', 'sport/calf_v', 'sport/calf_vi', 'sport/calf_vii',
                    //<a href="https://icon-library.net/icon/healthy-eating-icon-20.html">Healthy Eating Icon #87012</a>
                    'sport/eating_i','sport/eating_ii','sport/eating_iii','sport/eating_iv',
                    'sport/smoking_i','sport/smoking_ii','sport/smoking_iii','sport/smoking_iv',

                ]
        },
        {
            group: 'Travel',
            icons: []
        },
        {
            group: 'Languages',
            icons: []
        },
        {
            group: 'Work & Studies',
            icons: []
        },
        {
            group: 'Love & Relationships',
            icons: []
        },
    ]


    constructor() {}

    getIconsList(): {group: string, icons: string[]}[] {
        return this.icons;
    }

    getConditionIcons(): string[] {
        return this.conditionIcons;
    }

    getMountainIcons(): {group: string, icons: string[]}[] {
        return this.mountainIcons;
    }

}
