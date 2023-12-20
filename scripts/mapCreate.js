function getJSONPoints(tablename) {
    let jsonResp;
    $.ajax({
        url: 'points.php',
        type: "POST",
        async: false,
        data: {tablename: tablename}, // JSON send
        success: function (response) {
                    jsonResp = response;
                }
    });
    
    var obj = JSON.parse(jsonResp);
    return obj;
}



function updatePoints(tablename) {
    let jsonResp;
    var cash = Number(document.getElementById('cash').checked);
    var services_pay = Number(document.getElementById('services_pay').checked);
    var credit_pay = Number(document.getElementById('credit_pay').checked);
    var transfer_money = Number(document.getElementById('transfer_money').checked);
    var currency_exchange = Number(document.getElementById('currency_exchange').checked);
    var debit_card = Number(document.getElementById('debit_card').checked);
    var credit_operations = Number(document.getElementById('credit_operations').checked);
    var account_operations = Number(document.getElementById('account_operations').checked);
    var mortgage_operations = Number(document.getElementById('mortgage_operations').checked);
    var personal_data = Number(document.getElementById('personal_data').checked);
    var disabled_people = Number(document.getElementById('disabled_people').checked);

    /* post JSON */ 
    $.ajax({
        url: 'filters.php', 
        type: 'POST',
        async: false,
        data: {
            tablename,
            cash,
            services_pay,
            credit_pay,
            transfer_money,
            currency_exchange,
            debit_card,
            credit_operations,
            account_operations,
            mortgage_operations,
            personal_data,
            disabled_people
        },                     
        success: function(data){
                    //console.log("UPDATE POINTS HERE\n\n" + data);
                    jsonResp = data;
                }
    });  

    var obj = JSON.parse(jsonResp);
    console.log(obj);
    return obj;
}



var offices = getJSONPoints('offices');
var atms = getJSONPoints('atms');

ymaps.ready(init);

function init() {
    window.myMap = null;
    window.MyIconContentLayout = null;
    window.clusterer = null;
    $('#update').click(function() {
        offices = updatePoints('offices');
        atms = updatePoints('atms');
        myMap.destroy();
        myMap = null;
        init();
    })

    myMap = new ymaps.Map('map', {
        center: [59.939864, 30.314566],
        zoom: 9
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
    });
    var getPointOfficeData = function (index) {
        return {
            // Данные на метке.
            hintContent: offices[index].salePointName,
            balloonContentBody: "Отделение банка " + offices[index].address,
            clusterCaption: "Отделение банка " + offices[index].address
        };
    }
    var getPointAtmData = function (index) {
        return {
            // Данные на метке.
            hintContent: "Банкомат",
            balloonContentBody: "Банкомат " + atms[index].address,
            clusterCaption: "Банкомат " + atms[index].address
        };
    }
    var getPointOfficeOptions = function () {
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
    }
    var getPointAtmOptions = function () {
        return {
            iconLayout: 'default#imageWithContent',
            iconImageHref: 'images/location-atm-filled.png',
            iconImageSize: [24, 24],
            iconImageOffset: [-12, -24],
            iconContentOffset: [15, 15],
            iconContentLayout: MyIconContentLayout
        };
    }
    var geoObjects = [];

    for (var i = 0, len = offices.length; i < len; i++) {
        geoObjects[i] = new ymaps.Placemark([offices[i].latitude, offices[i].longitude], getPointOfficeData(i), getPointOfficeOptions());
    }

    for (var i = offices.length, len = atms.length; i < (len + offices.length); i++) {
        geoObjects[i] = new ymaps.Placemark([atms[i-offices.length].latitude, atms[i-offices.length].longitude], getPointAtmData(i-offices.length), getPointAtmOptions());
    }

    clusterer.add(geoObjects);
    var nothing = myMap.geoObjects.add(clusterer);

    myMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true
    });

    // Добавление местоположения пользователя
    var location = ymaps.geolocation;
    location.get()
    .then(
        function(result) {
            // Получение местоположения пользователя.
            var userAddress = result.geoObjects.get(0).properties.get('text');
            // Пропишем полученный адрес в балуне.
            result.geoObjects.get(0).properties.set({
                balloonContentBody: 'Адрес: ' + userAddress
        });
            myMap.geoObjects.add(result.geoObjects);
        },
        function(err) {
            console.log('Ошибка: ' + err)
        }
    );

    navigator.geolocation.getCurrentPosition(function (position) {
        var result = ymaps.geoQuery(ymaps.geocode('Париж')).addToMap(myMap);
        // Дождемся ответа от сервера и получим объект, ближайший к точке.
        nothing.then(function () {
            var closestObject = result.getClosestTo([
                position.coords.latitude,
                position.coords.longitude
            ]);
            // Если ответ пуст, то ближайший объект не найдется.
            if (closestObject) {
                closestObject.balloon.open();
                console.log(closestObject.properties);
                var multiRoute = new ymaps.multiRouter.MultiRoute({   
                    // Точки маршрута. Точки могут быть заданы как координатами, так и адресом. 
                    referencePoints: [
                        [position.coords.latitude, position.coords.longitude],
                        [60, 30],
                    ]
                }, {
                      // Автоматически устанавливать границы карты так,
                      // чтобы маршрут был виден целиком.
                      boundsAutoApply: true
                });
                
                // Добавление маршрута на карту.
                myMap.geoObjects.add(multiRoute);
            }
        });
      });

    myMap.controls.remove('rulerControl');
    myMap.controls.remove('trafficControl');
    myMap.controls.remove('typeSelector');
    myMap.controls.remove('searchControl');

}