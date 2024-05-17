<?php
ini_set("display_errors", 1);
    require_once "functions.php";

 
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    
    if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Methods: *");
        header("Access-Control-Allow-Origin: *");
        exit();
    } else {
        header("Access-Control-Allow-Origin: *");
    }

    $requestJson = file_get_contents("php://input");
    $requestData = json_decode($requestJson, true);

    if($requestMethod == "GET"){
        $entity = $_GET["entity"];
    }else {

        $entity = $requestData["entity"];
    }

    $filename = "entities/" . $entity . ".json";
    $entityData = json_decode(file_get_contents($filename), true);


?>