<?php

$globalPath = ".";
$currentPath = (substr($_SERVER['REQUEST_URI'], 1) === '') ? '/start' : $_SERVER['REQUEST_URI'];
$ignore_files = [".", ".."];

$components = [];
$cssLinks = [];

$pathComponents = "$globalPath/components$currentPath";
// $allComponentsSets = array_diff(scandir($pathComponents), $ignore_files);

// foreach($allComponentsSets as $folder) find_components("$pathComponents/$folder");
find_components("$pathComponents");

function find_components($working_path)
{
  if (!is_dir("$working_path")) return;
  global $components, $cssLinks, $ignore_files;

  // FILES INSIDE THIS FOLDER  
  $files = array_diff(scandir("$working_path"), $ignore_files);
  foreach ($files as $file)
  {
    // JS FILE === component
    if (substr($file, -2) === "js")
    {
      $components[] = [
        "name" => substr($file, 0, -3),
        "path" => "$working_path/$file",
      ];
    }

    //CSS
    if (substr($file, -3) === "css")
    {
      $cssLinks[] = [
        "html" => "<link rel='stylesheet' href='$working_path/$file'>",
        "href" => "$working_path/$file",
      ];
    }

    // SUBFOLDERS
    if (is_dir("$working_path/$file")) find_components("$working_path/$file");
  }
}

function echo_static_import_lines ()
{
  global $components;
  foreach ($components as $component)
  {
  
    $path = $component["path"];
    $name = $component["name"];  
    echo "    import * as $name from '$path';\n";
  }
}

function static_css_links ()
{
  global $cssLinks;
  $code = "";
  foreach ($cssLinks as $cssLink)
  {
    $code .= "  " . $cssLink["html"] . "\n";
  }
  return $code;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./index.css">
    <?php echo static_css_links(); ?>
    <title>Vart är vi påväg: Malmö Edition</title>
</head>
<body>
    
    <main id="main"></main>

<script type="module" id="my-script">

    import { PubSub } from './logic/pubsub.js';
    import { STATE } from './logic/state.js'
    import * as cm from './components/componentManager.js';
    <?php 
        echo_static_import_lines(); 
        $pathName = substr($currentPath, 1);
        echo "PubSub.publish({ event: 'render$pathName', detail: null }); \n";
    
    ?>

</script>
</body>
</html>