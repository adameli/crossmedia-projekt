<?php
ini_set("display_errors", 1);
    require_once "functions.php";

 
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    // check_request_method($requestMethod);

    // $content_type = $_SERVER["CONTENT_TYPE"];
    // check_content_type($content_type);

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