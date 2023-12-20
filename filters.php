<?php

    if($_SERVER['REQUEST_METHOD'] == 'POST') {

        $tablename = $_POST['tablename'];
        $sqlRequestAtm = "";
        $sqlRequestOffice = "";
        $countatm = 0;
        $countoff = 0;

        $noAtm = 0;

        if ($_POST['cash'] == 1) { 
            $sqlRequestAtm .= "cash=1 ";
            $sqlRequestOffice .= "cash=1 ";
            $countatm++;
            $countoff++;
        }
        if ($_POST['services_pay'] == 1) { 
            $sqlRequestAtm .= "services_pay=1 ";
            $sqlRequestOffice .= "services_pay=1 ";
            $countatm++;
            $countoff++;
        }
        if ($_POST['credit_pay'] == 1) { 
            $sqlRequestAtm .= "credit_pay=1 ";
            $sqlRequestOffice .= "credit_pay=1 ";
            $countatm++;
            $countoff++;
        }
        if ($_POST['transfer_money'] == 1) { 
            $sqlRequestAtm .= "transfer_money=1 ";
            $sqlRequestOffice .= "transfer_money=1 "; 
            $countatm++;
            $countoff++;
        }
        if ($_POST['currency_exchange'] == 1) { 
            $sqlRequestOffice .= "currency_exchange=1 ";  
            $countoff++;
        }
        if ($_POST['debit_card'] == 1) { 
            $sqlRequestOffice .= "debit_card=1 "; 
            $countoff++;
        }
        if ($_POST['credit_operations'] == 1) { 
            $sqlRequestOffice .= "credit_operations=1 ";  
            $countoff++;
        }
        if ($_POST['account_operations'] == 1) { 
            $sqlRequestOffice .= "account_operations=1 ";  
            $countoff++;
        }
        if ($_POST['mortgage_operations'] == 1) { 
            $sqlRequestOffice .= "mortgage_operations=1 "; 
            $countoff++;
        }
        if ($_POST['personal_data'] == 1) { 
            $sqlRequestOffice .= "personal_data=1 ";  
        }
        if ($_POST['disabled_people'] == 1) { 
            $sqlRequestOffice .= "disabled_people=1 ";  
            $countoff++;
        }

        if (($countatm == 0) and (strcmp($tablename, "atms") == 0) and ($countoff == 0)) { 
            $sqlRequestAtm = "SELECT * FROM atms"; 
        } else if (($countatm == 0) and (strcmp($tablename, "atms") == 0) and ($countoff != 0)) {
            $noAtm = 1;
            $sqlRequestAtm = "SELECT 1";
        } else if (strcmp($tablename, "atms" == 0)){ 
            $sqlRequestAtm = str_replace(" ", " and ", trim($sqlRequestAtm));
            $sqlRequestAtm = "SELECT atms.address, atms.latitude, atms.longitude FROM atms, atms_filters WHERE atms.id=atms_filters.id and " . $sqlRequestAtm;
        }

        if (($countoff == 0) and (strcmp($tablename, "offices") == 0)) { 
            $sqlRequestOffice = "SELECT * FROM offices"; 
        } else if (strcmp($tablename, "offices" == 0)){
            $sqlRequestOffice = str_replace(" ", " and ", trim($sqlRequestOffice));
            $sqlRequestOffice = "SELECT offices.address, offices.latitude, offices.longitude FROM offices, offices_filters WHERE offices.id=offices_filters.id and " . $sqlRequestOffice;
        }

        $user = 'root';
        $password = 'mysql';
        $db = 'vtb_bank_brench';
        $host = 'localhost';
        $charset = 'utf8';

        $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $password);
        if (strcmp($tablename, "atms") == 0) {
            $query = $pdo -> query($sqlRequestAtm);
        } else if (strcmp($tablename, "offices") == 0) {
            $query = $pdo -> query($sqlRequestOffice);
        }
        $rows = array();


        if ((strcmp($tablename, "atms") == 0) and ($noAtm == 1)) {
            $result = '[]';
            echo $result;
        } else { 
            while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
                $rows[] = $row;
            }
            $result = json_encode($rows, JSON_UNESCAPED_UNICODE);
            echo $result;
        }



        // для написания запроса использовать шаблон и к нему прибавлять готовые строки (модульный запрос)
        // при отправке запроса из html, вызвать функцию удаления всех меток
        // передать отфильтрованный список меток 

    }

?>

