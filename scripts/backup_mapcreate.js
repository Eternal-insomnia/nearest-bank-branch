import data from "./data/offices.json" assert {type: "json"}

console.log(data)

ymaps.ready(function () {
    //const json = '{"salePointName": "ДО «Солнечногорский» Филиала № 7701 Банка ВТБ (ПАО)", "address": "141506, Московская область, г. Солнечногорск, ул. Красная, д. 60", "status": "открытая","openHours": [{"days": "пн", "hours": "09:00-18:00"},{"days": "вт", "hours": "09:00-18:00"},{"days": "ср", "hours": "09:00-18:00"},{"days": "чт", "hours": "09:00-18:00"},{"days": "пт", "hours": "09:00-17:00"},{"days": "сб", "hours": "выходной"},{"days": "вс", "hours": "выходной"}], "rko": "есть РКО", "openHoursIndividual": [{"days": "пн", "hours": "09:00-20:00"},{"days": "вт", "hours": "09:00-20:00"},{"days": "ср", "hours": "09:00-20:00"},{"days": "чт", "hours": "09:00-20:00"},{"days": "пт", "hours": "09:00-20:00"},{"days": "сб", "hours": "10:00-17:00"},{"days": "вс", "hours": "выходной"}], "officeType": "Да (Зона Привилегия)", "salePointFormat": "Универсальный", "suoAvailability": "Y", "hasRamp": "N", "latitude": 56.184479, "longitude": 36.984314, "metroStation": null, "distance": 62105, "kep": true, "myBranch": false}';

    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),

        // Создаём макет содержимого.
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Значок отделения',
            balloonContent: 'Отделение ул.'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/location-toggled.png',
            // Размеры метки.
            iconImageSize: [48, 48],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-24, -48]
        }),

        myPlacemarkWithContent = new ymaps.Placemark([data[0].latitude, data[0].longitude], {
            hintContent: data[0].salePointName,
            balloonContent: data[0].address,
            //iconContent: '12'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#imageWithContent',
            // Своё изображение иконки метки.
            iconImageHref: 'images/location-toggled.png',
            // Размеры метки.
            iconImageSize: [48, 48],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-24, -48],
            // Смещение слоя с содержимым относительно слоя с картинкой.
            iconContentOffset: [15, 15],
            // Макет содержимого.
            iconContentLayout: MyIconContentLayout
        });

    myMap.geoObjects
        .add(myPlacemark)
        .add(myPlacemarkWithContent);
});