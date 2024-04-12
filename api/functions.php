<?php

function sendJson ($data, $statuscode){
    header("Content-type: application/json");
    http_response_code($statuscode);
    $json = json_encode($data);
    echo $json;
    exit();
}

function abort($status = 400, $message = "")
{
    sendJson(["error" => $message], $status);
}

?>