<?php
ini_set("display_errors", 1);

require_once "central.php";

if($requestMethod == "POST"){
    
    if(!isset($requestData['key'], $requestData['entity'])) {
        abort(400, "Bad Request (missing keys)");
    }

    $key = $requestData["key"];
    
    if(isset($requestData["place"])){
        $place = $requestData["place"];

        foreach($entityData as $index => $quizElement){

            if($quizElement["place"] == $place){
        
                if($quizElement["key"] == $key){
                    sendJson(["isCorrect" => true], 200);
                }else {
                    sendJson(["isCorrect" => false], 200);
                }
            }
        }

        abort(400, "Can't find the quiz");
    }

    if(isset($requestData["clueIds"])){
        $clueIds = $requestData["clueIds"];

        if(count($clueIds) == count($entityData)){
            sendJson(["finished" => true], 200);
        }

        $clues = [];
        foreach($entityData as $index => $clueElement){

            if(!in_array($clueElement["id"], $clueIds)){
                $clues[] = $clueElement;
            }
        }

        $randomNum = random_int(0, count($clues) -1);
        $clue = $clues[$randomNum];
        sendJson(["key" => $clue["key"], "id" => $clue["id"]], 200);
        // abort(400, "Can't find the quiz");
    }

    if(isset($requestData["user"])){
        $newUser = $requestData['user'];
        
        $id = 0;

        if(count($entityData) != 0){
            foreach ($entityData as $user) {
                if (isset($user["id"]) && $user["id"] > $id) {
                    $id = $user["id"];
                }
            }
        }

        $newUser["id"] = $id + 1;
        $entityData[] = $newUser;
        $json = json_encode($entityData, JSON_PRETTY_PRINT);
        file_put_contents("entities/LEADERBOARD.json", $json);
        sendJson(["message" => "new user in leaderboard"], 200);
    }

    //* fixa så att du kan radera en user via delete när appen är uppe
    // if($_GET["entity"] == 'CLUES'){
    //     foreach($entityData as $index => $clueElement){
    //         if($clueElement["key"] == $key){
    //             sendJson(["clues" => $clueElement["clues"], "destination" => $clueElement["destination"]], 200);
    //         }
    //     }
    // }




}