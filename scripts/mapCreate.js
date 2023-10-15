import data from "./data/offices.json" assert {type: "json"}

console.log(data)

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
                href: 'images/cluster-big.png',
                size: [40, 40],
                offset: [-20, -20]
            },
            {
                href: 'images/cluster.png',
                size: [60, 60],
                offset: [-30, -30]
            }],
        // Эта опция отвечает за размеры кластеров.
        // В данном случае для кластеров, содержащих до 10 элементов,
        // будет показываться маленькая иконка. Для остальных - большая.
        clusterNumbers: [10],
        clusterIconContentLayout: MyIconContentLayout
    }),
    getPointData = function (index) {
        return {
            // Данные на метке.
            hintContent: data[index].salePointName,
            balloonContentBody: data[index].address,
            clusterCaption: 'метка <strong>' + index + '</strong>'
        };
    },
    getPointOptions = function () {
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
    geoObjects = [];

    for (var i = 0, len = data.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark([data[i].latitude, data[i].longitude], getPointData(i), getPointOptions());
    }

    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);

    myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
    });
});