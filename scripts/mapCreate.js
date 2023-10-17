import offices from "./data/offices.json" assert {type: "json"}
import atms from "./data/atms.json" assert {type: "json"}

console.log(atms)

ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 9
    }, {
        searchControlProvider: 'yandex#search'
    }), 
    // Создаём макет содержимого.
    MyIconContentLayout = ymaps.templateLayoutFactory.createClass( 
        '<div style="color: #FFFFFF; font-family: VTB Group; font-weight: 700;">$[properties.geoObjects.length]</div>'
    ),

    clusterer = new ymaps.Clusterer({
        // Зададим массив, описывающий иконки кластеров разного размера.
        clusterIcons: [
            {
                href: 'images/cluster.png',
                size: [40, 40],
                offset: [-20, -20]
            },
            {
                href: 'images/cluster-big.png',
                size: [60, 60],
                offset: [-30, -30]
            }],
        // Эта опция отвечает за размеры кластеров.
        // В данном случае для кластеров, содержащих до 10 элементов,
        // будет показываться маленькая иконка. Для остальных - большая.
        clusterNumbers: [10],
        clusterIconContentLayout: MyIconContentLayout
    }),
    getPointOfficeData = function (index) {
        return {
            // Данные на метке.
            hintContent: offices[index].salePointName,
            balloonContentBody: "Отделение банка " + offices[index].address,
            clusterCaption: "Отделение банка " + offices[index].address
        };
    },
    getPointAtmData = function (index) {
        return {
            // Данные на метке.
            hintContent: "Банкомат",
            balloonContentBody: "Банкомат " + atms[index].address,
            clusterCaption: "Банкомат " + atms[index].address
        };
    },
    getPointOfficeOptions = function () {
        return {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#imageWithContent',
            // Своё изображение иконки метки.
            iconImageHref: 'images/location-office-filled.png',
            // Размеры метки.
            iconImageSize: [24, 24],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-12, -24],
            // Смещение слоя с содержимым относительно слоя с картинкой.
            iconContentOffset: [15, 15],
            // Макет содержимого.
            iconContentLayout: MyIconContentLayout
        };
    },
    getPointAtmOptions = function () {
        return {
            iconLayout: 'default#imageWithContent',
            iconImageHref: 'images/location-atm-filled.png',
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -24],
            iconContentOffset: [15, 15],
            iconContentLayout: MyIconContentLayout
        };
    },
    geoObjects = [];

    for (var i = 0, len = offices.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark([offices[i].latitude, offices[i].longitude], getPointOfficeData(i), getPointOfficeOptions());
    }

    for (var i = offices.length, len = atms.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark([atms[i].latitude, atms[i].longitude], getPointAtmData(i), getPointAtmOptions());
    }

    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);

    myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
    });
});