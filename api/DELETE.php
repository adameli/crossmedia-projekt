<?php
ini_set("display_errors", 1);

require_once "central.php";

if($requestMethod == "DELETE"){

    if(!isset($requestData['id'])) {
        abort(400, "Bad Request (missing keys)");
    }

    foreach($entityData as $index => $user){

        if($user["id"] == $requestData["id"]){
            array_splice($entityData, $index, 1);
            $json = json_encode($entityData, JSON_PRETTY_PRINT);
            file_put_contents("entities/LEADERBOARD.json", $json);
            sendJson($user  , 200);
        }
    }
    abort(400, "User doesn't exist");
}