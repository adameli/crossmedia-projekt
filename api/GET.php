<?php
ini_set("display_errors", 1);

require_once "central.php";

if($requestMethod == "GET"){
    
    if(!isset($_GET['key'])) {
        abort(400, "Bad Request (missing keys)");
    }

    $key = $_GET["key"];

    if($_GET["entity"] == 'CLUES'){

        if(isset($_GET['place'])){
            foreach($entityData as $index => $clueElement){
                if($clueElement["destination"] == $_GET['place']){
                    sendJson(["img" => $clueElement["img"], "text" => $clueElement["text"]], 200);
                }
            }
        }

        foreach($entityData as $index => $clueElement){
            if($clueElement["key"] == $key){
                sendJson(["clues" => $clueElement["clues"], "destination" => $clueElement["destination"]], 200);
            }
        }
    }

    if($_GET["entity"] == 'QUIZES'){
        foreach($entityData as $index => $quizElement){
            if($quizElement["key"] == $key){
                sendJson($quizElement["quiz"], 200);
            }
        }

        abort(400, "Wrong key value");
    }

    if($_GET["entity"] == 'LEADERBOARD'){
        if($key == 'all'){
            sendJson($entityData, 200);
        }
        abort(400, "Wrong key value");
    }



}