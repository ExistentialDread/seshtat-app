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
            icons: ['hermes',
            'caduceus', 
            'metis',
            'phoebe',
            //https://www.behance.net/gallery/59801849/Plutus-Logo?tracking_source=search_projects_recommended%7Cplutus
            'plutus']
        },
        {
            group: 'Finance',
            icons: [
                'kubera_i',
                'kubera_ii',
                'kubera_iii',
                'kubera_iv',
                'kubera_v',
                'liberalitas_i',
                'liberalitas_ii',
                'moneta_i',
                'moneta_ii',
                'moneta_iii',
                'vesta',
            ]
        },
        {
            group: 'Sports',
            icons: []
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
